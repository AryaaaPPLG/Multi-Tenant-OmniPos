"use server";

import "server-only";

import { PaymentMethod, Prisma } from "@prisma/client";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_DISTINCT_ITEMS = 100;
const MAX_QUANTITY_PER_ITEM = 10_000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export type CheckoutResult =
  | {
      ok: true;
      transaction: {
        id: string;
        totalAmount: string;
        createdAt: string;
      };
    }
  | {
      ok: false;
      code:
        | "UNAUTHENTICATED"
        | "FORBIDDEN"
        | "INVALID_CART"
        | "PRODUCT_NOT_FOUND"
        | "INSUFFICIENT_STOCK"
        | "CONFLICT"
        | "INTERNAL_ERROR";
      message: string;
    };

class CheckoutError extends Error {
  constructor(
    readonly code: Exclude<CheckoutResult, { ok: true }>["code"],
    message: string,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

function normalizeCart(items: readonly CartItemInput[]): Map<string, number> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutError("INVALID_CART", "Keranjang tidak boleh kosong.");
  }

  const normalized = new Map<string, number>();

  for (const item of items) {
    if (
      !item ||
      typeof item.productId !== "string" ||
      !UUID_PATTERN.test(item.productId) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new CheckoutError("INVALID_CART", "Item keranjang tidak valid.");
    }

    const quantity = (normalized.get(item.productId) ?? 0) + item.quantity;
    if (quantity > MAX_QUANTITY_PER_ITEM) {
      throw new CheckoutError("INVALID_CART", "Jumlah item melebihi batas.");
    }
    normalized.set(item.productId, quantity);
  }

  if (normalized.size > MAX_DISTINCT_ITEMS) {
    throw new CheckoutError("INVALID_CART", "Terlalu banyak produk berbeda.");
  }

  return normalized;
}

/**
 * Processes one cash checkout. Prices, tenant ownership, and user identity are
 * resolved on the server. The client only supplies product IDs and quantities.
 */
export async function processCheckout(
  cartItems: readonly CartItemInput[],
): Promise<CheckoutResult> {
  try {
    const session = await getSessionUser();
    if (!session) {
      return {
        ok: false,
        code: "UNAUTHENTICATED",
        message: "Sesi berakhir. Silakan login kembali.",
      };
    }

    if (session.role !== "KASIR" && session.role !== "ADMIN") {
      return {
        ok: false,
        code: "FORBIDDEN",
        message: "Akun tidak diizinkan memproses transaksi.",
      };
    }

    const normalizedCart = normalizeCart(cartItems);
    const productIds = [...normalizedCart.keys()];

    const transaction = await prisma.$transaction(
      async (tx) => {
        const products = await tx.product.findMany({
          where: {
            tenantId: session.tenantId,
            id: { in: productIds },
          },
          select: { id: true, name: true, price: true },
        });

        if (products.length !== productIds.length) {
          throw new CheckoutError(
            "PRODUCT_NOT_FOUND",
            "Satu atau lebih produk tidak tersedia untuk tenant ini.",
          );
        }

        let totalAmount = new Prisma.Decimal(0);
        const lines = products.map((product) => {
          const quantity = normalizedCart.get(product.id);
          if (quantity === undefined) {
            throw new CheckoutError("INVALID_CART", "Item keranjang tidak valid.");
          }

          if (product.price.isNegative()) {
            throw new Error(`Invalid stored price for product ${product.id}`);
          }

          const lineTotal = product.price.mul(quantity);
          totalAmount = totalAmount.add(lineTotal);

          return {
            product,
            quantity,
            unitPrice: product.price,
            lineTotal,
          };
        });

        // The conditional update prevents overselling under concurrent checkouts.
        for (const line of lines) {
          const stockUpdate = await tx.product.updateMany({
            where: {
              id: line.product.id,
              tenantId: session.tenantId,
              stock: { gte: line.quantity },
            },
            data: { stock: { decrement: line.quantity } },
          });

          if (stockUpdate.count !== 1) {
            throw new CheckoutError(
              "INSUFFICIENT_STOCK",
              `Stok produk ${line.product.name} tidak mencukupi.`,
            );
          }
        }

        return tx.transaction.create({
          data: {
            // Security boundary: all ownership values come from the verified session.
            tenantId: session.tenantId,
            userId: session.userId,
            paymentMethod: PaymentMethod.CASH,
            totalAmount,
            items: {
              create: lines.map((line) => ({
                tenantId: session.tenantId,
                productId: line.product.id,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                lineTotal: line.lineTotal,
              })),
            },
          },
          select: { id: true, totalAmount: true, createdAt: true },
        });
      },
      { timeout: 10_000 },
    );

    return {
      ok: true,
      transaction: {
        id: transaction.id,
        totalAmount: transaction.totalAmount.toFixed(2),
        createdAt: transaction.createdAt.toISOString(),
      },
    };
  } catch (error: unknown) {
    if (error instanceof CheckoutError) {
      return { ok: false, code: error.code, message: error.message };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2034" || error.code === "P2002")
    ) {
      return {
        ok: false,
        code: "CONFLICT",
        message: "Transaksi berbenturan dengan perubahan lain. Silakan coba lagi.",
      };
    }

    console.error("processCheckout failed", {
      error,
      // Never log cart contents, cookies, tokens, or tenant data here.
    });

    return {
      ok: false,
      code: "INTERNAL_ERROR",
      message: "Transaksi gagal diproses. Silakan coba kembali.",
    };
  }
}
