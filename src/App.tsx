import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Zap, 
  Code, 
  HeartHandshake, 
  FileCode, 
  SlidersHorizontal, 
  LineChart, 
  AlertCircle,
  HelpCircle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import PrismaCode from './components/PrismaCode';
import MiddlewareCode from './components/MiddlewareCode';
import ServerComponentCode from './components/ServerComponentCode';
import InteractivePlayground from './components/InteractivePlayground';

export default function App() {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'playground' | 'production-guide'>('blueprint');
  const [subSection, setSubSection] = useState<'all' | 'prisma' | 'middleware' | 'server-component'>('all');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 flex flex-col lg:flex-row">
      
      {/* GEOMETRIC BALANCE SIDEBAR CONSOLE */}
      <aside className="hidden lg:flex w-64 bg-[#0F172A] text-slate-300 flex-col border-r border-slate-800 sticky top-0 h-screen flex-none z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-white font-bold tracking-tight">
            <div className="w-6 h-6 bg-indigo-500 flex items-center justify-center rounded-sm text-xs text-white">P</div>
            <span>OMNIPOS ADMIN</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">Enterprise Console</p>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Arsitektur Core</div>
          
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md font-medium text-left text-xs tracking-wider uppercase transition-all ${
              activeTab === 'blueprint' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            id="sidebar-tab-blueprint"
          >
            <div className={`w-1 h-4 bg-indigo-500 rounded-sm transition-opacity ${activeTab === 'blueprint' ? 'opacity-100' : 'opacity-0'}`}></div>
            <span>Blueprint Code</span>
          </button>
          
          <button
            onClick={() => setActiveTab('playground')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md font-medium text-left text-xs tracking-wider uppercase transition-all ${
              activeTab === 'playground' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            id="sidebar-tab-playground"
          >
            <div className={`w-1 h-4 bg-indigo-500 rounded-sm transition-opacity ${activeTab === 'playground' ? 'opacity-100' : 'opacity-0'}`}></div>
            <span>Simulator Sandbox</span>
          </button>
          
          <button
            onClick={() => setActiveTab('production-guide')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md font-medium text-left text-xs tracking-wider uppercase transition-all ${
              activeTab === 'production-guide' 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            id="sidebar-tab-production-guide"
          >
            <div className={`w-1 h-4 bg-indigo-500 rounded-sm transition-opacity ${activeTab === 'production-guide' ? 'opacity-100' : 'opacity-0'}`}></div>
            <span>Kajian Produksi</span>
          </button>

          <div className="px-3 py-2 pt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stack Spesifikasi</div>
          <div className="px-3 py-1 space-y-1 text-[11px] text-slate-400 font-mono">
            <div className="p-1 px-2 border border-slate-800 rounded bg-[#1e293b]/50">Next.js (App Router)</div>
            <div className="p-1 px-2 border border-slate-800 rounded bg-[#1e293b]/50">Prisma (Multi-tenant)</div>
            <div className="p-1 px-2 border border-slate-800 rounded bg-[#1e293b]/50">PostgreSQL (RLS Index)</div>
          </div>
        </nav>

        {/* Professional badge footer inside sidebar */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center space-x-3 text-xs">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shadow font-mono text-[10px]">PE</div>
            <div>
              <p className="text-white font-semibold">Principal Eng.</p>
              <p className="text-[10px] text-slate-500">v2.4.0-stable</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE RESPONSIVE HEADER */}
      <header className="lg:hidden bg-[#0F172A] border-b border-slate-800 text-slate-300 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-bold tracking-tight">
            <div className="w-5 h-5 bg-indigo-500 flex items-center justify-center rounded-sm text-xs text-white">P</div>
            <span className="text-sm font-semibold tracking-wide">OMNIPOS ADMIN</span>
          </div>
          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[9px] font-bold border border-green-500/20 rounded uppercase tracking-wide">
            Production Ready
          </span>
        </div>
        
        {/* Mobile Navigation controls */}
        <div className="flex space-x-1.5 overflow-x-auto text-xs pb-1">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-semibold ${activeTab === 'blueprint' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            id="mobile-tab-blueprint"
          >
            Blueprint Code
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-semibold ${activeTab === 'playground' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            id="mobile-tab-playground"
          >
            Simulator Sandbox
          </button>
          <button
            onClick={() => setActiveTab('production-guide')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-semibold ${activeTab === 'production-guide' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            id="mobile-tab-production-guide"
          >
            Kajian Produksi
          </button>
        </div>
      </header>

      {/* CORE CONTENT MAIN AREA */}
      <main className="flex-grow flex flex-col min-h-screen lg:h-screen lg:overflow-y-auto">
        
        {/* HEADER BAR FOR DESKTOP */}
        <header className="h-16 border-b border-slate-200 hidden lg:flex items-center justify-between px-8 bg-white shadow-sm flex-none">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider font-mono">
              <Cpu className="h-3 w-3 mr-1" /> Multi-Tenant System
            </span>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Next.js Multi-Tenant Blueprint</h1>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold border border-green-200 rounded uppercase tracking-wider">
              Production Ready
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Stack:</span>
            <span className="text-slate-900 bg-slate-100 px-2.5 py-1 rounded">Next.js App Router</span>
            <span className="text-slate-900 bg-slate-100 px-2.5 py-1 rounded">Prisma</span>
            <span className="text-slate-900 bg-slate-100 px-2.5 py-1 rounded">PostgreSQL</span>
          </div>
        </header>

        {/* CONTAINER AND PAGES RENDER */}
        <div className="p-4 md:p-8 flex-grow">
          
          {/* TAB 1: BLUEPRINT CODE FILES */}
          {activeTab === 'blueprint' && (
            <div className="space-y-8 animate-fadeIn" id="blueprint-panel">
              {/* Subsection Filter Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight">Berkas Arsitektur Utama</h2>
                  <p className="text-sm text-slate-500 mt-1">Gunakan tab filter berikut untuk menyaring berkas source code hulu-ke-hilir.</p>
                </div>
                
                {/* Geometric Filters */}
                <div className="flex items-center space-x-1.5 bg-slate-150 p-1.5 rounded-lg border border-slate-200 self-start md:self-auto bg-slate-100 shadow-inner">
                  <button
                    onClick={() => setSubSection('all')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${subSection === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    id="sub-all"
                  >
                    Semua Berkas
                  </button>
                  <button
                    onClick={() => setSubSection('prisma')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${subSection === 'prisma' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    id="sub-prisma"
                  >
                    prisma.schema
                  </button>
                  <button
                    onClick={() => setSubSection('middleware')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${subSection === 'middleware' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    id="sub-middleware"
                  >
                    middleware.ts
                  </button>
                  <button
                    onClick={() => setSubSection('server-component')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${subSection === 'server-component' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
                    id="sub-server"
                  >
                    dashboard/page.tsx
                  </button>
                </div>
              </div>

              {/* Grid content space */}
              <div className="space-y-12">
                {(subSection === 'all' || subSection === 'prisma') && (
                  <section className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                      <h3 className="text-base font-bold text-slate-900">1. Skema Database Relasional Multi-Tenant (schema.prisma)</h3>
                    </div>
                    <PrismaCode />
                  </section>
                )}

                {(subSection === 'all' || subSection === 'middleware') && (
                  <section className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-4 bg-pink-500 rounded-full"></div>
                      <h3 className="text-base font-bold text-slate-900">2. DNS Domain Multi-Subdomain Rewrite (middleware.ts)</h3>
                    </div>
                    <MiddlewareCode />
                  </section>
                )}

                {(subSection === 'all' || subSection === 'server-component') && (
                  <section className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-base font-bold text-slate-900">3. Kunci Saring Penarikan Server Component (dashboard/page.tsx)</h3>
                    </div>
                    <ServerComponentCode />
                  </section>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="space-y-6 animate-fadeIn" id="playground-panel">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight">Simulator Interaktif Sandbox</h2>
                  <p className="text-sm text-slate-500 mt-1">Ujicoba interaktif isolasi multi-tenant secara live untuk menjamin tidak ada kebocoran data.</p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start space-x-3 text-indigo-950">
                <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong className="font-bold text-indigo-900">Petunjuk Simulasi Sandbox:</strong> Di bawah ini, Anda dapat memainkan peran sebagai pengguna yang mengontrol browser. Ubah url untuk berganti toko (subdomain / kustom domain), atau ganti session akun untuk mensimulasikan otentikasi. Anda akan melihat secara visual bagaimana Middleware dan kueri SQL relasional berkolaborasi menjaga isolasi data tenant secara ketat!
                </div>
              </div>

              <InteractivePlayground />
            </div>
          )}

          {/* TAB 3: ANALYSIS / ROADMAP */}
          {activeTab === 'production-guide' && (
            <div className="space-y-8 animate-fadeIn" id="production-panel">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight">Kandungan & Keandalan Produksi</h2>
                  <p className="text-sm text-slate-500 mt-1">Ulasan strategis keamanan data dan mitigasi overhead infrastruktur oleh Principal Engineer.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Guides columns */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-indigo-500" />
                      1. Isolasi Data Berlapis (Multilayer Defense-in-Depth)
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Sistem tidak menggantungkan keamanan hanya pada penyaringan di UI (Client-Side). Keamanan dilapis dari Edge DNS level (Middleware me-rewrite alamat), Server level (Verifikasi silang token JWT dengan basis parameter), hingga Database level (Query explicit dengan <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono">where tenantId</code> berindeks komposit). Pendekatan berlapis ini mereduksi potensi kegagalan tunggal (single point of failure) hingga ke titik terendah.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-indigo-500" />
                      2. Resolusi Domain Berlatensi Rendah via Redis Cache di Edge
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Bagi UMKM, performa toko adalah segalanya. Penggunaan Next.js Edge Middleware memastikan domain dinamis diselesaikan global di CDN terdekat dengan user. Kami sangat merekomendasikan penyimpanan pemetaan Custom Domain ke slug dalam memori volatile (seperti <strong className="text-slate-800">Upstash Redis</strong> atau Redis Cluster Cloud) dengan TTL caching yang tepat agar waktu respons Edge Middleware stabil di bawah <strong className="text-emerald-650 font-bold">20ms</strong>!
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-indigo-500" />
                      3. Proteksi Sempurna Terhadap Serangan IDOR (Insecure Direct Object Reference)
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      IDOR adalah celah di mana akun milik Toko A mengakses data Toko B hanya dengan mengganti ID di URL browser. Terobosan validasi silang pada Server Component kami secara mutlak memberantas celah ini: data transaksi <strong className="text-slate-950 font-semibold">tidak akan pernah</strong> ditarik kecuali ID Tenant pada payload JWT Session terenkripsi cocok secara mutlak dengan record ID Tenant yang mewakili subdomain URL tersebut.
                    </p>
                  </div>

                  <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <HeartHandshake className="h-5 w-5 text-indigo-500" />
                      4. Efisiensi Biaya Operasional (Shared Database Cost-Effectiveness)
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Dengan menerapkan skema <strong className="text-slate-950 font-semibold">Shared Database - Shared Schema</strong>, SaaS Anda tidak perlu mengontrak ratusan klaster database kecil untuk ratusan UMKM yang baru merintis. Satu database PostgreSQL sanggup menampung hingga jutaan baris data produk dan transaksi dalam satu tabel berkat optimasi indeks terkluster <code className="text-indigo-600 bg-slate-100 px-1 py-0.5 rounded font-mono">@@index([tenantId, createdAt])</code>.
                    </p>
                  </div>
                </div>

                {/* Right hand advice block */}
                <div className="space-y-6">
                  <div className="p-6 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl space-y-4 shadow-md">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                      <HelpCircle className="h-4 w-4 text-emerald-400 animate-pulse" />
                      Peta Skalabilitas (SaaS Roadmap)
                    </h4>
                    <p className="text-xs text-slate-405 leading-relaxed">
                      Sebagai Principal Engineer, berikut adalah langkah lanjutan yang direkomendasikan saat produk SaaS UMKM Anda bertumbuh dari ratusan menjadi puluhan ribu penyewa aktif:
                    </p>

                    <div className="space-y-4 pt-2">
                      <div className="border-l-2 border-indigo-500 pl-3 space-y-1">
                        <span className="text-xs font-semibold text-slate-200 block">PostgreSQL Row-Level Security</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Aktifkan RLS di PostgreSQL. Buat kebijakan agar database engine sendiri yang memblokir query yang tidak membawa session ID tenant yang sah dari middleware DB connection pool.
                        </p>
                      </div>

                      <div className="border-l-2 border-indigo-500 pl-3 space-y-1">
                        <span className="text-xs font-semibold text-slate-200 block">Database Partitioning</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Jika transaksi melampaui puluhan juta baris, lakukan partisi PostgreSQL secara deklaratif berdasarkan <code className="text-slate-300 font-mono">tenantId</code> untuk memecah tabel raksasa menjadi segmen fisik yang lincah.
                        </p>
                      </div>

                      <div className="border-l-2 border-indigo-500 pl-3 space-y-1">
                        <span className="text-xs font-semibold text-slate-200 block">Multi-Region Failover</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Gunakan Cloud database terkelola (seperti Google Cloud SQL berreplika lintas zona) untuk menjaga ketersediaan tinggi tanpa jeda transaksi UMKM Anda di seluruh wilayah nusantara.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-indigo-700 font-mono uppercase tracking-wider block">Standar Keamanan Sertifikasi</span>
                    <p className="text-xs text-indigo-950 leading-relaxed">
                      Sistem multi-tenant POS yang dirancang dengan landasan blueprint ini mempermudah pemenuhan standar audit kepatuhan eksternal seperti <strong className="text-indigo-900">ISO 27001</strong> dan <strong className="text-indigo-900">SOC 2 Type II</strong> mengenai pemisahan data penyewa (tenant segregation/isolation controls).
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-slate-500 text-xs flex-none mt-auto">
          <div className="max-w-7xl mx-auto px-6 space-y-1">
            <p className="font-mono text-slate-900 tracking-wider font-semibold">&copy; 2026 OmniPOS Enterprise Cloud Architecture</p>
            <p className="text-slate-405">System Status: Healthy • Uptime: 99.99% • Tenant Isolation Rules: Verified</p>
          </div>
        </footer>

      </main>

    </div>
  );
}
