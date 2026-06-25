import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Exactly one PrismaClient per warm runtime. DATABASE_URL must point to Supabase's
 * transaction pooler (port 6543) and include `pgbouncer=true`.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

globalForPrisma.prisma = prisma;
