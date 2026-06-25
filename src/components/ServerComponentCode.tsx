import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Cpu, Code2, AlertTriangle } from 'lucide-react';

export default function ServerComponentCode() {
  const [copied, setCopied] = useState(false);

  const serverComponentCode = `import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth"; // Mengembalikan JWT Session pengguna saat ini
import { notFound, redirect } from "next/navigation";
import { startOfMonth, endOfMonth } from "date-fns";

// Definisikan tipe params yang ketat sesuai konvensi App Router Next.js 14/15
interface DashboardParams {
  params: {
    tenant: string; // [tenant] parameter dinamis
  };
}

export default async function TenantDashboardPage({ params }: DashboardParams) {
  // Await params karena di Next.js terbaru params diperlakukan sebagai Promise
  const { tenant: tenantSlug } = await params;

  // 1. Ambil session pengguna secara aman dari sisi Server (HTTP-Only Secure Cookie)
  const currentUser = await getSessionUser();
  if (!currentUser) {
    return redirect("/login");
  }

  // 2. Tarik informasi Tenant berdasarkan slug dinamis pada URL halaman
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true, name: true }
  });

  if (!tenant) {
    return notFound(); // Lempar ke standard Next.js 404 jika slug tidak terdaftar
  }

  // 3. 🚨 PERTAHANAN MULTI-TENANT CRITICAL 🚨
  // Lakukan validasi silang (cross-verification) antara tenant yang diakses di URL
  // dengan Tenant ID terenkripsi pada Session Token pengguna.
  // Mencegah "IDOR" (Insecure Direct Object Reference) di mana user kopi-sedap mencoba
  // mengakses dashboard kopi-senja dengan mengganti URL browser secara manual.
  const isAuthorized = currentUser.tenantId === tenant.id || currentUser.role === "SUPERADMIN";
  if (!isAuthorized) {
    throw new Error("Otorisasi Ditolak: Anda tidak memiliki akses ke data tenant ini!");
  }

  // 4. Hitung rentang waktu transaksi bulanan saat ini
  const rawDate = new Date();
  const rangeStart = startOfMonth(rawDate);
  const rangeEnd = endOfMonth(rawDate);

  // 5. Query transaksi dengan klausa WHERE yang terkunci di level Database
  // Kita menuntut pencocokan tenantId secara eksplisit demi menghindari Data Leakage.
  const transactions = await prisma.transaction.findMany({
    where: {
      tenantId: tenant.id, // Kunci utama isolasi multi-tenant
      createdAt: {
        gte: rangeStart,
        lte: rangeEnd
      }
    },
    include: {
      user: {
        select: {
          name: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  // 6. Hitung akumulasi agregat total pendapatan
  const totalMonthlySales = transactions.reduce(
    (sum, txn) => sum + Number(txn.totalAmount), 
    0
  );

  return (
    <div className="p-8 space-y-6">
      {/* Visualisasi Header Dashboard */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
        <p className="text-sm text-muted-foreground">
          Sistem POS & Transaksi Bulan: {rawDate.toLocaleString("id-ID", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Grid KPI Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">omset Transaksi Bulanan</p>
          <p className="text-3xl font-extrabold mt-2">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalMonthlySales)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Isolasi Keras pada ID: {tenant.id}</p>
        </div>
        
        <div className="p-6 bg-card border rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Performa Kasir</p>
          <p className="text-3xl font-extrabold mt-2">{transactions.length} Transaksi</p>
          <p className="text-xs text-muted-foreground mt-1">Dicatat oleh {currentUser.name} ({currentUser.role})</p>
        </div>
      </div>

      {/* List transaksi terisolasi aman */}
      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-sm">Log Transaksi Terkunci ({tenant.name})</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-[#f8fafc]/50 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-3">ID Transaksi</th>
              <th className="px-6 py-3">Kasir</th>
              <th className="px-6 py-3">Metode Bayar</th>
              <th className="px-6 py-3 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{txn.id}</td>
                <td className="px-6 py-4">{txn.user.name}</td>
                <td className="px-6 py-4">{txn.paymentMethod}</td>
                <td className="px-6 py-4 text-right font-medium">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(txn.totalAmount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverComponentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="server-blueprint" className="bg-[#0f172a] text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-md">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold tracking-wider text-slate-200">app/[tenant]/dashboard/page.tsx</h3>
            <p className="text-xs text-slate-400">Next.js App Router Server Component • Secure Data Retrieval</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-xs text-slate-300 font-medium transition-colors"
          title="Salin kode komponen"
          id="btn-copy-server"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Code Content */}
        <div className="lg:col-span-7 border-r border-slate-800">
          <pre className="p-6 text-xs font-mono overflow-auto max-h-[640px] leading-relaxed text-slate-300 bg-[#0b0f19]">
            <code>{serverComponentCode}</code>
          </pre>
        </div>

        {/* Explain Grid */}
        <div className="lg:col-span-5 p-6 bg-slate-900/60 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 mb-2">
                <Code2 className="h-3.5 w-3.5 mr-1" />
                Anti Data Leakage Guard
              </span>
              <h4 className="text-lg font-semibold text-white tracking-tight">Perisai IDOR & Kebocoran Multi-Tenant</h4>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Di lingkungan enterprise, mempercayai identitas dari alamat URL semata merupakan kesalahan fatal. Di sini kita menuntut lapisan pertahanan hulu-hilir.
              </p>
            </div>

            {/* Technical points */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Bahaya Otentikasi Lemah (Cross-Tenant)</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Bila aplikasi hanya mengecek apakah pengguna telah login, seorang kasir dari <span className="text-yellow-400 font-mono">Tenant A</span> dapat melihat semua data <span className="text-indigo-400 font-mono">Tenant B</span> hanya dengan mengganti URL halaman dashboard!
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Implementasi Cross-Verification</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Langkah <code className="text-emerald-400 font-mono">currentUser.tenantId === tenant.id</code> melakukan korelasi silang berbasis kriptografi JWT session. Ini adalah pertahanan kuat menghadapi serangan manipulasi parameter URL (IDOR).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Kueri Terkunci Maksimal (Prisma)</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Klausa <code className="text-emerald-400 font-mono">where: {"{ tenantId: tenant.id }"}</code> memaksa SQL engine PostgreSQL menyaring data transaksi di bawah jaminan database level indexing, mencegah data tenant bocor di sisi server.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/20 rounded-lg border border-emerald-500/20">
            <h5 className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono mb-1">Mencegah N+1 Query</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dengan memuat relasi kasir melalui instruksi <code className="text-slate-300 font-mono">include: {"{ user: ... }"}</code>, Prisma menyatukan permintaan dalam satu kali pemanggilan join SQL yang dioptimalkan, mencegah bottleneck kinerja di produksi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
