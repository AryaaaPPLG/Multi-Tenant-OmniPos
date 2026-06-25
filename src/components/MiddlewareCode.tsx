import React, { useState } from 'react';
import { Copy, Check, GitBranch, Terminal, Globe, ArrowRight } from 'lucide-react';

export default function MiddlewareCode() {
  const [copied, setCopied] = useState(false);

  const middlewareCode = `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar asset statis dan rute publik sistem utama yang tidak perlu di-rewrite
const PUBLIC_FILE_OR_ROUTE = [
  "/_next",
  "/api",
  "/assets",
  "/favicon.ico",
  "/site.webmanifest",
  "/login",
  "/register"
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const pathname = url.pathname;

  // 1. Lewati asset statis dan rute internal Next.js
  if (PUBLIC_FILE_OR_ROUTE.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. Tentukan domain dasar aplikasi SaaS kita
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  // 3. Deteksi Subdomain & Custom Domain
  let tenant = "";

  if (hostname === rootDomain) {
    // Permintaan datang dari domain utama (misal: "mypos.com" atau "localhost:3000")
    // Arahkan ke landing page atau dashboard utama untuk registrasi tenant baru
    return NextResponse.next();
  } else if (hostname.endsWith(\`.\${rootDomain}\`)) {
    // Permintaan menggunakan subdomain (misal: "kopi-senja.localhost:3000")
    tenant = hostname.replace(\`.\${rootDomain}\`, "");
  } else {
    // Permintaan menggunakan Custom Domain (misal: "kopisenja.com")
    // Di produksi, Anda bisa mencocokkan custom domain ini dengan database/cache (Redis)
    tenant = await fetchTenantSlugFromCustomDomain(hostname);
  }

  // 4. Jika tenant tidak ditemukan secara valid, arahkan ke halaman 404 tenant
  if (!tenant) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  // 5. Lakukan rewrite internal ke folder dinamis App Router: /app/[tenant]/...
  // Browser user tetap melihat "kopi-senja.localhost:3000/dashboard", bukan "localhost:3000/kopi-senja/dashboard"
  const rewriteUrl = new URL(\`/\${tenant}\${pathname}\${url.search}\`, req.url);
  
  // Kirim header kustom agar Server Component dapat dengan mudah membaca tenant_id/slug tanpa memparsing ulang URL
  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("x-tenant-slug", tenant);

  return response;
}

/**
 * Simulasi pemanggilan database/Redis cache kecepatan tinggi di Edge Runtime 
 * untuk me-resolve Custom Domain ke Slug Tenant asal.
 */
async function fetchTenantSlugFromCustomDomain(customDomain: string): Promise<string> {
  try {
    // Rekomendasi produksi: Gunakan Upstash Redis atau cache memory Edge 
    // agar response time tetap di bawah < 50ms!
    const response = await fetch(\`https://api.\${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/v1/resolve-domain?domain=\${customDomain}\`, {
      headers: { "Authorization": \`Bearer \${process.env.INTERNAL_API_TOKEN}\` },
      next: { revalidate: 300 } // Cache hasil penelusuran selama 5 menit
    });

    if (!response.ok) return "";
    const data = await response.json();
    return data.tenantSlug || "";
  } catch (error) {
    console.error("Gagal mendeteksi custom domain di Edge Middleware:", error);
    return "";
  }
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua jalur permintaan kecuali file statis biasa.
     * Mendukung pemrosesan middleware penuh untuk navigasi dinamis.
     */
    "/((?!api/|_next/static|_next/image|assets/|favicon.ico).*)",
  ],
};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(middlewareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="middleware-blueprint" className="bg-[#0f172a] text-slate-100 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-500/10 rounded-md">
            <GitBranch className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold tracking-wider text-slate-200">middleware.ts</h3>
            <p className="text-xs text-slate-400">Next.js Edge Middleware • Dynamic Rewriting & Domain Resolution</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-xs text-slate-300 font-medium transition-colors"
          title="Salin kode middleware"
          id="btn-copy-middleware"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Code View */}
        <div className="lg:col-span-7 border-r border-slate-800">
          <pre className="p-6 text-xs font-mono overflow-auto max-h-[640px] leading-relaxed text-slate-300 bg-[#0b0f19]">
            <code>{middlewareCode}</code>
          </pre>
        </div>

        {/* Explain Grid */}
        <div className="lg:col-span-5 p-6 bg-slate-900/60 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 mb-2">
                <Globe className="h-3.5 w-3.5 mr-1" />
                Zero-Latency Subdomain Router
              </span>
              <h4 className="text-lg font-semibold text-white tracking-tight">Resolusi Domain Dinamis</h4>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Edge Middleware berjalan di atas jaringan global CDN (Edge Network). Ini memangkas latensi routing sehingga pengguna tidak merasakan jeda saat mengakses subdomain mereka.
              </p>
            </div>

            {/* Steps explanation */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Terminal className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Bypass Aset Statis</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Saringan <code className="text-pink-300 font-mono">PUBLIC_FILE_OR_ROUTE</code> memastikan file seperti CSS, gambar, atau favicon langsung didistribusikan tanpa penahanan, menghemat CPU runtime secara substansial.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Terminal className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Internal Rewrite (Transparent Routing)</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Metode <code className="text-pink-300 font-mono">NextResponse.rewrite()</code> menyembunyikan struktur folder internal proyek <code className="text-slate-300 bg-slate-950 px-1 py-0.5 rounded font-mono">app/[tenant]/...</code>. Di mata pengguna & mesin pencari (SEO), file beralamat di subdomain terlihat murni dan independen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Terminal className="h-4 w-4 text-pink-400" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Inject Header Khusus</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Penerusan header <code className="text-pink-300 font-mono">x-tenant-slug</code> sangat mempermudah server dan API di rute bawahnya untuk mendeteksi tenant aktif dalam <strong className="text-slate-200">O(1)</strong> tanpa repot menguraikan string URL lagi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-2 text-pink-400 mb-1.5 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-pink-500"></span>
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">Edge Resolving Workflow</span>
            </div>
            <div className="text-xs text-slate-400 font-mono space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-slate-500">REQUEST:</span>
                <span className="text-amber-400">kopi.mypos.com/dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-pink-400 font-bold">MIDDLEWARE:</span>
                <span className="text-slate-300">Extracts 'kopi' -&gt; Rewrites</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-500">NEXT.JS:</span>
                <span className="text-emerald-400">app/[tenant]/dashboard/page.tsx</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
