import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, Database, Key, Layers } from 'lucide-react';

export default function PrismaCode() {
  const [copied, setCopied] = useState(false);

  const prismaSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  KASIR
}

/// @description Mengidentifikasi Entitas Toko/Cabang Utama yang terisolasi
model Tenant {
  id           String        @id @default(uuid())
  name         String
  slug         String        @unique // Subdomain identifier (e.g. "kopi-senja")
  customDomain String?       @unique @map("custom_domain") // Domain kustom (e.g. "kopisenja.com")
  createdAt    DateTime      @default(now()) @map("created_at")
  updatedAt    DateTime      @updatedAt @map("updated_at")
  
  // Relations
  users        User[]
  products     Product[]
  transactions Transaction[]

  @@index([slug])
  @@index([customDomain])
  @@map("tenants")
}

/// @description Pengguna dengan Role-Based Access Control terikat ke Tenant tertentu
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  role      Role     @default(KASIR)
  tenantId  String   @map("tenant_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  tenant       Tenant        @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@index([tenantId])
  @@map("users")
}

/// @description Produk yang dijual dalam inventaris Tenant tertentu
model Product {
  id        String   @id @default(uuid())
  name      String
  price     Decimal  @db.Decimal(12, 2)
  stock     Int      @default(0)
  tenantId  String   @map("tenant_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  // Compound index untuk mengoptimalkan query & menjamin isolasi data tenant
  @@index([tenantId, id])
  @@map("products")
}

/// @description Transaksi Penjualan yang terisolasi per Tenant, dicatat oleh User/Kasir
model Transaction {
  id            String   @id @default(uuid())
  totalAmount   Decimal  @db.Decimal(12, 2) @map("total_amount")
  paymentMethod String   @map("payment_method") // e.g. "CASH", "QRIS", "DEBIT"
  userId        String   @map("user_id")
  tenantId      String   @map("tenant_id")
  createdAt     DateTime @default(now()) @map("created_at")

  // Relations
  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user   User   @relation(fields: [userId], references: [id])

  // Index komposit krusial untuk performa query analytics per tenant
  @@index([tenantId, createdAt])
  @@index([tenantId, userId])
  @@map("transactions")
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prismaSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="prisma-blueprint" className="bg-[#0f172a] text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-md">
            <Database className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold tracking-wider text-slate-200">prisma/schema.prisma</h3>
            <p className="text-xs text-slate-400">Prisma v5.x Schema • PostgreSQL Relational Multi-Tenant Model</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-xs text-slate-300 font-medium transition-colors"
          title="Salin skema"
          id="btn-copy-prisma"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
        </button>
      </div>

      {/* Code Content & Explanations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Schema Code Panel */}
        <div className="lg:col-span-7 border-r border-slate-800">
          <pre className="p-6 text-xs font-mono overflow-auto max-h-[640px] leading-relaxed text-slate-300 bg-[#0b0f19]">
            <code>{prismaSchema}</code>
          </pre>
        </div>

        {/* Technical Explanations Panel */}
        <div className="lg:col-span-5 p-6 bg-slate-900/60 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 mb-2">
                <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                Enterprise Security Certified
              </span>
              <h4 className="text-lg font-semibold text-white tracking-tight">Kunci Isolasi Data PostgreSQL</h4>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Arsitektur ini menerapkan desain <strong className="text-indigo-300">Shared Database, Shared Schema</strong> yang paling optimal dan ekonomis untuk skala UMKM (SaaS multi-tenant yang efisien).
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">1</span>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Indeks Komposit (Compound Indexes)</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Perhatikan indeks <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded font-mono">@@index([tenantId, id])</code> pada <code className="text-indigo-300 font-mono">Product</code>. Ini menjamin database engine melakukan scan secara efisien hanya pada segmen tenant yang dimaksud, mempercepat response time secara linear.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">2</span>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Cascade Deletes Pengaman Residu</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Setiap tabel mengimplementasikan kekosongan hubungan bertingkat: <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded font-mono">onDelete: Cascade</code> pada <code className="text-indigo-300 font-mono">Tenant</code>. Jika suatu Toko/Cabang dihapus, semua produk, user, dan transaksi miliknya akan terhapus otomatis, menghindari residu data yatim (orphaned records).
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">3</span>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Keamanan RBAC (Role-Based Access)</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    User memiliki enum role <span className="font-mono text-emerald-400">ADMIN</span> dan <span className="font-mono text-emerald-400">KASIR</span> yang terisolasi per tenant, memastikan kasir Kopi Senja tidak memiliki otorisasi admin untuk mengubah atau melihat setelan toko lain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400 mb-1.5">
              <Layers className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">Rekomendasi Skala Enterprise</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Untuk kepatuhan keamanan data tingkat lanjut (compliance), skema ini dapat diintegrasikan dengan PostgreSQL <span className="text-indigo-300 font-mono">Row-Level Security (RLS)</span>. Setiap transaksi SQL akan selalu diawali penentuan context bypasser <code className="text-emerald-400">app.current_tenant_id</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
