import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Terminal, 
  User as UserIcon, 
  Plus, 
  ShoppingCart, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  Server, 
  CreditCard, 
  PlusCircle, 
  RefreshCw,
  Search,
  Sliders,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { Tenant, User, Product, Transaction } from '../types';

// Initial Mock Data
const INITIAL_TENANTS: Tenant[] = [
  { id: 'tenant-1', name: 'Kopi Senja (Bandung)', slug: 'kopi-senja', customDomain: 'kopisenja.com' },
  { id: 'tenant-2', name: 'Boba Time (Jakarta)', slug: 'boba-time', customDomain: 'bobatime.co.id' },
  { id: 'tenant-3', name: 'Angkringan Modern (Yogya)', slug: 'angkringan-modern', customDomain: null },
];

const INITIAL_USERS: User[] = [
  { id: 'user-1', name: 'Budi Raharjo', role: 'KASIR', tenantId: 'tenant-1' },
  { id: 'user-2', name: 'Siti Aminah', role: 'KASIR', tenantId: 'tenant-2' },
  { id: 'user-3', name: 'Rian Wijaya', role: 'ADMIN', tenantId: 'tenant-3' },
  { id: 'user-hack', name: 'Hacker Jahat', role: 'KASIR', tenantId: 'tenant-2' }, // Lives in tenant 2 but will attempt to access tenant 1
];

const INITIAL_PRODUCTS: Product[] = [
  // Products Kopi Senja
  { id: 'p1-1', name: 'Espresso Double Shot', price: 18000, stock: 120, tenantId: 'tenant-1' },
  { id: 'p1-2', name: 'Kopi Susu Gula Aren', price: 22000, stock: 85, tenantId: 'tenant-1' },
  { id: 'p1-3', name: 'Matcha Green Tea Latte', price: 25000, stock: 40, tenantId: 'tenant-1' },
  { id: 'p1-4', name: 'Croissant Butter', price: 24000, stock: 15, tenantId: 'tenant-1' },
  
  // Products Boba Time
  { id: 'p2-1', name: 'Brown Sugar Milk Tea', price: 28000, stock: 200, tenantId: 'tenant-2' },
  { id: 'p2-2', name: 'Taro Classic Bubble Tea', price: 26000, stock: 110, tenantId: 'tenant-2' },
  { id: 'p2-3', name: 'Mango Green Tea Boba', price: 29000, stock: 75, tenantId: 'tenant-2' },

  // Products Angkringan Modern
  { id: 'p3-1', name: 'Nasi Kucing Sambal Teri', price: 6000, stock: 50, tenantId: 'tenant-3' },
  { id: 'p3-2', name: 'Sate Usus Bakar Pecel', price: 3000, stock: 150, tenantId: 'tenant-3' },
  { id: 'p3-3', name: 'Sate Puyuh Bacem', price: 4000, stock: 80, tenantId: 'tenant-3' },
  { id: 'p3-4', name: 'Es Teh Manis Jumbo', price: 3000, stock: 300, tenantId: 'tenant-3' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  // Kopi Senja Tx
  { id: 'tx-101', totalAmount: 40000, paymentMethod: 'QRIS', userId: 'user-1', tenantId: 'tenant-1', createdAt: '2026-06-05T14:20:00Z' },
  { id: 'tx-102', totalAmount: 22000, paymentMethod: 'CASH', userId: 'user-1', tenantId: 'tenant-1', createdAt: '2026-06-10T09:15:00Z' },
  { id: 'tx-103', totalAmount: 71000, paymentMethod: 'DEBIT', userId: 'user-1', tenantId: 'tenant-1', createdAt: '2026-06-19T21:40:00Z' },

  // Boba Time Tx
  { id: 'tx-201', totalAmount: 54000, paymentMethod: 'QRIS', userId: 'user-2', tenantId: 'tenant-2', createdAt: '2026-06-03T11:05:00Z' },
  { id: 'tx-202', totalAmount: 29000, paymentMethod: 'QRIS', userId: 'user-2', tenantId: 'tenant-2', createdAt: '2026-06-12T16:30:00Z' },

  // Angkringan Tx
  { id: 'tx-301', totalAmount: 18000, paymentMethod: 'CASH', userId: 'user-3', tenantId: 'tenant-3', createdAt: '2026-06-11T20:10:00Z' },
  { id: 'tx-302', totalAmount: 26000, paymentMethod: 'CASH', userId: 'user-3', tenantId: 'tenant-3', createdAt: '2026-06-18T22:00:00Z' },
];

export default function InteractivePlayground() {
  // State managers
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Simulation Controls STATE
  const [browserUrlInput, setBrowserUrlInput] = useState<string>('kopi-senja.localhost:3000');
  const [loggedInUserId, setLoggedInUserId] = useState<string>('user-1'); // Default: Budi (Kasir @ Kopi Senja)
  
  // Custom interactive state
  const [posSelectedProductId, setPosSelectedProductId] = useState<string>('');
  const [posQuantity, setPosQuantity] = useState<number>(1);
  const [posPaymentMethod, setPosPaymentMethod] = useState<string>('QRIS');
  const [posSuccessMsg, setPosSuccessMsg] = useState<string>('');

  // Fields for adding new custom Tenant
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [newTenantCustomDomain, setNewTenantCustomDomain] = useState('');
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);

  // Real-time calculated resolution (Simulating Edge Middleware)
  const middlewareResolution = useMemo(() => {
    let rawInput = browserUrlInput.trim().toLowerCase();
    
    // Clean protocol prefixes if any
    rawInput = rawInput.replace(/^(https?:\/\/)/, '');
    
    // Extract domain and path
    const [hostWithPort] = rawInput.split('/');
    const host = hostWithPort;
    
    const rootDomain = 'localhost:3000';
    let resolvedTenantSlug = '';
    let isCustomDomain = false;
    let matchTenant: Tenant | undefined = undefined;

    if (host === rootDomain) {
      resolvedTenantSlug = ''; // Root Domain landing page state
    } else if (host.endsWith(`.${rootDomain}`)) {
      resolvedTenantSlug = host.replace(`.${rootDomain}`, '');
      matchTenant = tenants.find(t => t.slug === resolvedTenantSlug);
    } else {
      // Treat as custom domain
      isCustomDomain = true;
      matchTenant = tenants.find(t => t.customDomain && t.customDomain.toLowerCase() === host);
      if (matchTenant) {
        resolvedTenantSlug = matchTenant.slug;
      }
    }

    return {
      host,
      isRoot: host === rootDomain,
      isCustomDomain,
      extractedSlug: resolvedTenantSlug,
      matchedTenant: matchTenant,
      rewritePath: resolvedTenantSlug ? `/app/[${resolvedTenantSlug}]/dashboard` : '/app/landing-page'
    };
  }, [browserUrlInput, tenants]);

  // Auth Context Simulation for the dashboard
  const activeUser = useMemo(() => {
    return users.find(u => u.id === loggedInUserId);
  }, [loggedInUserId, users]);

  const activeUserTenant = useMemo(() => {
    if (!activeUser) return null;
    return tenants.find(t => t.id === activeUser.tenantId);
  }, [activeUser, tenants]);

  // Cross-verification security status
  const securityAnalysis = useMemo(() => {
    if (middlewareResolution.isRoot) {
      return { authorized: true, code: 'ROOT_ACCESS', message: 'Mengakses Gerbang Utama (Landing & Registrasi SaaS)' };
    }
    
    const targetTenant = middlewareResolution.matchedTenant;
    if (!targetTenant) {
      return { authorized: false, code: 'NOT_FOUND', message: 'Domain / Subdomain tidak terdaftar di sistem multi-tenant DNS!' };
    }

    if (!activeUser) {
      return { authorized: false, code: 'UNAUTHENTICATED', message: 'Session kosong. Pengguna diharuskan Login.' };
    }

    // Enterprise validation: Does the logged-in user's tenantId match the requested tenant's id?
    const isMatched = activeUser.tenantId === targetTenant.id;
    if (isMatched) {
      return { 
        authorized: true, 
        code: 'AUTHORIZED', 
        message: `Akses Diizinkan! ${activeUser.name} (${activeUser.role}) tersertifikasi valid untuk mengelola ${targetTenant.name}.`
      };
    } else {
      return { 
        authorized: false, 
        code: 'IDOR_BLOCKED', 
        message: `BLOCKED! Percobaan Data Leakage Terdeteksi. Pengguna ${activeUser.name} terikat pada Tenant [${activeUserTenant?.name || 'Lain'}], namun mencoba meretas data [${targetTenant.name}]!`
      };
    }
  }, [middlewareResolution, activeUser, activeUserTenant]);

  // Handle transaction creation inside simulation
  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posSelectedProductId) return;
    
    const product = products.find(p => p.id === posSelectedProductId);
    if (!product) return;

    if (product.stock < posQuantity) {
      alert('Stok produk tidak mencukupi untuk simulasi transaksi ini.');
      return;
    }

    // Deduct stock
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return { ...p, stock: p.stock - posQuantity };
      }
      return p;
    }));

    // Create new Transaction
    const amount = product.price * posQuantity;
    const newTx: Transaction = {
      id: `tx-${Math.floor(100 + Math.random() * 900)}`,
      totalAmount: amount,
      paymentMethod: posPaymentMethod,
      userId: loggedInUserId,
      tenantId: product.tenantId,
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [newTx, ...prev]);
    setPosSuccessMsg(`Sukses mencetak transaksi ${newTx.id}! Rp ${amount.toLocaleString('id-ID')} masuk laci POS.`);
    setTimeout(() => {
      setPosSuccessMsg('');
    }, 4000);

    // Reset controls
    setPosQuantity(1);
  };

  // Add a new Tenant simulator
  const handleAddTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSlug) {
      alert('Nama dan Slug subdomain wajib diisi!');
      return;
    }

    const cleanSlug = newTenantSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (tenants.some(t => t.slug === cleanSlug)) {
      alert('Subdomain slug ini sudah terpakai!');
      return;
    }

    const tenantId = `tenant-${Date.now()}`;
    const newTenant: Tenant = {
      id: tenantId,
      name: newTenantName,
      slug: cleanSlug,
      customDomain: newTenantCustomDomain ? newTenantCustomDomain.trim().toLowerCase() : null
    };

    // Auto create an Admin & Product for this new tenant
    const newTechUser: User = {
      id: `user-${Date.now()}`,
      name: `Owner ${newTenantName}`,
      role: 'ADMIN',
      tenantId: tenantId
    };

    const newDefaultProduct: Product = {
      id: `p-${Date.now()}`,
      name: 'Produk Unggulan Baru',
      price: 15000,
      stock: 50,
      tenantId: tenantId
    };

    setTenants(prev => [...prev, newTenant]);
    setUsers(prev => [...prev, newTechUser]);
    setProducts(prev => [...prev, newDefaultProduct]);

    // Set simulator URL to the newly created tenant
    setBrowserUrlInput(`${cleanSlug}.localhost:3000`);
    setLoggedInUserId(newTechUser.id);
    setShowAddTenantModal(false);
    
    // Clear inputs
    setNewTenantName('');
    setNewTenantSlug('');
    setNewTenantCustomDomain('');
  };

  // Filter products and transactions strictly based on the resolution matched tenant to prevent UI visual leakages
  const currentTenantOnScreen = middlewareResolution.matchedTenant;

  const visibleProducts = useMemo(() => {
    if (!currentTenantOnScreen || !securityAnalysis.authorized || securityAnalysis.code === 'IDOR_BLOCKED') return [];
    return products.filter(p => p.tenantId === currentTenantOnScreen.id);
  }, [currentTenantOnScreen, products, securityAnalysis]);

  const visibleTransactions = useMemo(() => {
    if (!currentTenantOnScreen || !securityAnalysis.authorized || securityAnalysis.code === 'IDOR_BLOCKED') return [];
    return transactions.filter(t => t.tenantId === currentTenantOnScreen.id);
  }, [currentTenantOnScreen, transactions, securityAnalysis]);

  const aggregateSales = useMemo(() => {
    return visibleTransactions.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [visibleTransactions]);

  const rawSQLQuery = useMemo(() => {
    if (!currentTenantOnScreen) return '-- Siap memproses query SQL relasional';
    
    const tId = currentTenantOnScreen.id;
    const uId = loggedInUserId;
    
    return `/* SQL executed on target PostgreSQL DB cluster */
PREPARE get_monthly_sales(text, text, timestamp, timestamp) AS
  SELECT t.id, t.total_amount, t.payment_method, t.created_at, u.name as cashier_name
  FROM transactions t
  INNER JOIN users u ON t.user_id = u.id
  WHERE t.tenant_id = $1 
    AND t.user_id = $2
    AND t.created_at >= $3 
    AND t.created_at <= $4
  ORDER BY t.created_at DESC;

EXECUTE get_monthly_sales('${tId}', '${uId}', '2026-06-01 00:00:00', '2026-06-30 23:59:59');`;
  }, [currentTenantOnScreen, loggedInUserId]);

  const middlewareTraceLog = useMemo(() => {
    const lines = [];
    lines.push(`[Edge Router] Incoming Request Host: "${middlewareResolution.host}"`);
    lines.push(`[Edge Router] Parsing root domain suffix...`);
    
    if (middlewareResolution.isRoot) {
      lines.push(`[Edge Router] Host matches standard root domain. Routing bypass to Landing Gate.`);
      lines.push(`[Edge Router] Action: NEXT (Bypass rewriting)`);
    } else if (middlewareResolution.isCustomDomain) {
      lines.push(`[Edge Router] Custom Domain detected. Looking up mapping record...`);
      if (currentTenantOnScreen) {
        lines.push(`[Edge Router] Success! Found Custom Domain mapping: "${middlewareResolution.host}" -> Slug "${middlewareResolution.extractedSlug}" id: "${currentTenantOnScreen.id}"`);
        lines.push(`[Edge Router] Rewriting Request internally to: ${middlewareResolution.rewritePath}`);
        lines.push(`[Edge Router] Set response header: x-tenant-slug = "${middlewareResolution.extractedSlug}"`);
      } else {
        lines.push(`[Edge Router] Danger! Custom domain "${middlewareResolution.host}" has no active Tenant association!`);
        lines.push(`[Edge Router] Rewriting internally to /404`);
      }
    } else {
      lines.push(`[Edge Router] Subdomain matched. Extracted Slug: "${middlewareResolution.extractedSlug}"`);
      if (currentTenantOnScreen) {
        lines.push(`[Edge Router] Tenant identified: "${currentTenantOnScreen.name}"`);
        lines.push(`[Edge Router] Rewriting Request internally to: ${middlewareResolution.rewritePath}`);
        lines.push(`[Edge Router] Set header: x-tenant-slug = "${middlewareResolution.extractedSlug}"`);
      } else {
        lines.push(`[Edge Router] Warning: Subdomain "${middlewareResolution.extractedSlug}" tidak terdaftar.`);
        lines.push(`[Edge Router] Rewriting internally to /404`);
      }
    }
    return lines;
  }, [middlewareResolution, currentTenantOnScreen]);

  return (
    <div id="interactive-playground" className="space-y-8">
      {/* Simulation Header controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-400" />
              Kontrol Simulator Multi-Tenant
            </h3>
            <p className="text-xs text-slate-400">Sesuaikan simulasi url browser & user sesi aktif untuk menguji keamanan routing.</p>
          </div>
          <button
            onClick={() => setShowAddTenantModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-all self-start md:self-auto"
            id="btn-trigger-add-tenant"
          >
            <Plus className="h-4 w-4" />
            <span>Daftarkan Toko Baru (Tenant SaaS)</span>
          </button>
        </div>

        {/* CONTROLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CONTROL: BROWSER ALAMAT BAR */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest font-mono">
              1. Simulasikan URL Browser (Routing)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Globe className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={browserUrlInput}
                onChange={(e) => setBrowserUrlInput(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-600"
                placeholder="slug.localhost:3000"
                id="field-browser-url"
              />
            </div>
            
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500 self-center mr-1">Preset URL:</span>
              <button 
                onClick={() => setBrowserUrlInput('kopi-senja.localhost:3000')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${browserUrlInput === 'kopi-senja.localhost:3000' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                id="preset-kopi-senja"
              >
                kopi-senja (Reguler)
              </button>
              <button 
                onClick={() => setBrowserUrlInput('bobatime.co.id')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${browserUrlInput === 'bobatime.co.id' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                id="preset-boba-domain"
              >
                bobatime.co.id (Custom Domain)
              </button>
              <button 
                onClick={() => setBrowserUrlInput('angkringan-modern.localhost:3000')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${browserUrlInput === 'angkringan-modern.localhost:3000' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                id="preset-angkringan"
              >
                angkringan-modern
              </button>
              <button 
                onClick={() => setBrowserUrlInput('localhost:3000')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${browserUrlInput === 'localhost:3000' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'}`}
                id="preset-root"
              >
                localhost:3000 (SaaS Root)
              </button>
            </div>
          </div>

          {/* CONTROL: USER SESI */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest font-mono">
              2. Sesi Kasir / Pengguna Aktif (Login)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="h-4 w-4" />
              </div>
              <select
                value={loggedInUserId}
                onChange={(e) => setLoggedInUserId(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                id="field-user-session"
              >
                {users.map(u => {
                  const userTenantObj = tenants.find(t => t.id === u.tenantId);
                  return (
                    <option key={u.id} value={u.id} className="bg-slate-950">
                      {u.name} ({u.role} @ {userTenantObj?.name || 'Toko tidak dikenal'})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Quick Context warning helper */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 pt-1">
              <span>Sesi pengguna terikat ke:</span>
              <span className="font-semibold text-sky-400 font-mono">
                {activeUserTenant?.name}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED MIDDLEWARE & QUERY TRACE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* EDGE MIDDLEWARE DYNAMIC TERMINAL */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[340px]">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
              EDGE ROUTING RUNTIME ANALYZER
            </span>
            <div className="flex space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
          </div>
          <div className="p-4 font-mono text-xs text-slate-300 space-y-2 overflow-y-auto flex-1 bg-[#0b0f19]">
            {middlewareTraceLog.map((line, idx) => (
              <div key={idx} className={
                line.includes('NEXT') ? 'text-emerald-400 font-semibold' :
                line.includes('Success!') ? 'text-indigo-300 font-semibold' :
                line.includes('Danger!') || line.includes('Warning') ? 'text-red-400 font-bold' :
                line.includes('Rewriting') ? 'text-pink-400 font-semibold' :
                'text-slate-400'
              }>
                <span className="text-slate-600 mr-2">&gt;</span>{line}
              </div>
            ))}
          </div>
          <div className="p-3 bg-slate-950 border-t border-slate-900 text-right">
            <span className="text-[10px] font-mono text-slate-500">Edge Exec Time: <strong className="text-emerald-400 font-normal">~0.4ms</strong></span>
          </div>
        </div>

        {/* PRISMA RELATIONAL ENGINE LOGS */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[340px]">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-indigo-400" />
              DATABASE ENGINE MONITOR (POSTGRESQL)
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
              SQL Logging
            </span>
          </div>
          <div className="p-4 font-mono text-xs text-slate-300 space-y-1 overflow-y-auto flex-1 bg-[#0b0f19] leading-relaxed">
            <pre className="text-slate-400 break-all select-all hover:text-white transition-colors cursor-pointer">
              {rawSQLQuery}
            </pre>
          </div>
          <div className="p-3 bg-slate-950 border-t border-slate-900 text-right">
            <span className="text-[10px] font-mono text-slate-500">Query Plan cost: <strong className="text-indigo-400 font-normal">Index Scan using transactions_tenant_id_idx</strong></span>
          </div>
        </div>

      </div>

      {/* CORE SECURE SECURITY STATUS CARD */}
      <div className={`p-6 border rounded-xl overflow-hidden shadow-lg transition-all ${
        securityAnalysis.code === 'AUTHORIZED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' :
        securityAnalysis.code === 'ROOT_ACCESS' ? 'bg-sky-500/10 border-sky-500/20 text-sky-100' :
        'bg-red-500/10 border-red-500/20 text-red-100'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="mt-1 flex-shrink-0">
            {securityAnalysis.code === 'AUTHORIZED' || securityAnalysis.code === 'ROOT_ACCESS' ? (
              <div className="p-2.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
            ) : (
              <div className="p-2.5 bg-red-500/20 rounded-lg text-red-400 animate-bounce">
                <ShieldAlert className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2.5">
              <h4 className="text-base font-bold tracking-tight uppercase font-mono">
                {securityAnalysis.code}
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase font-mono tracking-wider ${
                securityAnalysis.code === 'AUTHORIZED' ? 'bg-emerald-500/20 text-emerald-300' :
                securityAnalysis.code === 'ROOT_ACCESS' ? 'bg-sky-500/20 text-sky-300' :
                'bg-red-500/20 text-red-300 animate-pulse'
              }`}>
                {securityAnalysis.code === 'AUTHORIZED' || securityAnalysis.code === 'ROOT_ACCESS' ? 'Aman' : 'Ditolak'}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">{securityAnalysis.message}</p>
            
            {securityAnalysis.code === 'IDOR_BLOCKED' && (
              <div className="mt-3 p-3 bg-black/40 rounded-lg border border-red-500/30">
                <p className="text-xs font-mono text-red-400">
                  ⚡ <strong>Pertahanan IDOR Bekerja:</strong> URL meminta Toko {currentTenantOnScreen?.name}, tetapi database mengembalikan error otorisasi karena ID Toko di browser ({currentTenantOnScreen?.id}) tidak identik dengan klaim payload token ({activeUser?.tenantId}). Proses kueri dihentikan sebelum membaca baris PostgreSQL tunggal pun!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIMULATED WORKSPACE (IF AUTHORIZED SHOW POS & EXPLAIN ANALYTICS) */}
      {securityAnalysis.code === 'AUTHORIZED' && currentTenantOnScreen && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all">
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 font-bold">Workspace Tenant Terisolasi</span>
              <h4 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Server className="h-5 w-5 text-indigo-400" />
                {currentTenantOnScreen.name} Pos Terminal
              </h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-mono">Domain: {currentTenantOnScreen.customDomain || `${currentTenantOnScreen.slug}.mypos.com`}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
            {/* POS SALES TRANSACTION PANEL */}
            <div className="xl:col-span-4 p-6 border-r border-slate-800 bg-slate-900/30">
              <h5 className="text-sm font-semibold text-slate-200 uppercase tracking-widest font-mono mb-4 flex items-center gap-1.5">
                <ShoppingCart className="h-4 w-4 text-emerald-400" />
                Input Transaksi Baru
              </h5>

              <form onSubmit={handleProcessTransaction} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-400">Pilih Item Menu</label>
                  <select
                    value={posSelectedProductId}
                    onChange={(e) => setPosSelectedProductId(e.target.value)}
                    required
                    className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="pos-select-product"
                  >
                    <option value="" className="bg-slate-950">-- Pilih Produk --</option>
                    {visibleProducts.map(p => (
                      <option key={p.id} value={p.id} disabled={p.stock <= 0} className="bg-slate-950">
                        {p.name} - Rp {p.price.toLocaleString('id-ID')} (Sisa Stok: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-400">SST / Jumlah</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={posQuantity}
                      onChange={(e) => setPosQuantity(parseInt(e.target.value) || 1)}
                      required
                      className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none font-mono"
                      id="pos-item-quantity"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-400">Metode Bayar</label>
                    <select
                      value={posPaymentMethod}
                      onChange={(e) => setPosPaymentMethod(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none font-mono"
                      id="pos-payment-method"
                    >
                      <option value="QRIS" className="bg-slate-950">QRIS</option>
                      <option value="CASH" className="bg-slate-950">TUNAI (CASH)</option>
                      <option value="DEBIT" className="bg-slate-950">KARTU DEBIT</option>
                    </select>
                  </div>
                </div>

                {posSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg animate-fadeIn text-center">
                    {posSuccessMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-slate-100 text-sm font-semibold tracking-wide transition-all uppercase mt-2"
                  id="btn-process-pos"
                >
                  Proses Transaksi POS
                </button>
              </form>

              {/* Products Directory Quick View */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Katalog Produk Terdaftar ({visibleProducts.length})</h5>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {visibleProducts.map(p => (
                    <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-slate-950 rounded border border-slate-900">
                      <div>
                        <span className="font-semibold text-slate-200">{p.name}</span>
                        <p className="text-[10px] text-slate-500 font-mono">ID: {p.id}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-mono">Rp {p.price.toLocaleString('id-ID')}</span>
                        <p className="text-[10px] text-slate-400 font-mono">Stok: {p.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE POS ANALYTICS VIEW */}
            <div className="xl:col-span-8 p-6 flex flex-col justify-between space-y-6">
              
              {/* STATS OVERVIEW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-emerald-400" /> Total Omset Terkunci
                  </span>
                  <div className="text-xl font-black text-white mt-1.5 font-mono">
                    Rp {aggregateSales.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[9px] text-slate-500 leading-none">Isolated to {currentTenantOnScreen.slug}</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-indigo-400" /> Total Transaksi Bulanan
                  </span>
                  <div className="text-xl font-black text-white mt-1.5 font-mono">
                    {visibleTransactions.length} Resit
                  </div>
                  <span className="text-[9px] text-slate-500 leading-none">Query: date-isolated filter</span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-sky-400" /> Operator Aktif
                  </span>
                  <div className="text-xl font-black text-slate-200 mt-1.5 truncate">
                    {activeUser?.name}
                  </div>
                  <span className="text-[9px] text-indigo-400 font-mono font-semibold uppercase">{activeUser?.role} LEVEL</span>
                </div>
              </div>

              {/* LIVE TRANSACTIONS CHART (HTML STYLED HOVERABLE BARS) */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <h6 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Simulasi Pola Transaksi (Harian)</h6>
                  <span className="text-[10px] text-indigo-400 font-mono">SaaS Real-time Analytics Feed</span>
                </div>

                {visibleTransactions.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-slate-600 bg-slate-900/10 rounded-lg text-xs font-mono">
                    Belum ada transaksi bulan ini
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleTransactions.map((tx, index) => {
                      // Calculate width percentage relative to largest tx
                      const maxAmount = Math.max(...visibleTransactions.map(t => t.totalAmount));
                      const percent = Math.min(100, Math.max(15, (tx.totalAmount / maxAmount) * 100));
                      const timeStr = new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div key={tx.id} className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>ID: [{tx.id}] • Kasir: {users.find(u => u.id === tx.userId)?.name || 'Sistem'} • {timeStr}</span>
                            <span className="text-emerald-400 font-semibold">Rp {tx.totalAmount.toLocaleString('id-ID')} ({tx.paymentMethod})</span>
                          </div>
                          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                              style={{ width: `${percent}%` }}
                            >
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECURITY ASSURANCE BOX */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <p className="leading-relaxed pr-4">
                  💡 <strong>Keuntungan Isolation Tenant_Id:</strong> Seluruh dashboard di atas dirender murni bersumber dari variabel database berindeks <code className="text-indigo-400">tenantId</code>. Tidak ada saringan memori di sisi klien (Client-Side filtering) sehingga pertahanan anti kebocoran data sangat kuat.
                </p>
                <div className="flex-shrink-0 text-indigo-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL UNTUK MENAMBAH TENANT BARU */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">Kanal Registrasi Tenant SaaS</h4>
                <p className="text-xs text-slate-400">Simulasikan onboarding toko UMKM baru ke ekosistem multi-tenant SaaS Anda.</p>
              </div>
              <button 
                onClick={() => setShowAddTenantModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold p-1"
                id="btn-close-tenant-modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTenantSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Nama Toko / Cabang</label>
                <input
                  type="text"
                  required
                  placeholder="Kopi Nako Bandung"
                  value={newTenantName}
                  onChange={(e) => {
                    setNewTenantName(e.target.value);
                    // Autofill slug for developer ease
                    setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  id="modal-tenant-name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Subdomain Slug (Resolving URL)</label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    required
                    placeholder="kopi-nako"
                    value={newTenantSlug}
                    onChange={(e) => setNewTenantSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-l-lg text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    id="modal-tenant-slug"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-slate-800 bg-slate-950 text-slate-400 text-xs font-mono">
                    .localhost:3000
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Custom Domain Mapped (Opsional)</label>
                <input
                  type="text"
                  placeholder="kopinako.com"
                  value={newTenantCustomDomain}
                  onChange={(e) => setNewTenantCustomDomain(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  id="modal-tenant-customdomain"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-lg tracking-wide shadow transition-all uppercase"
                id="btn-submit-tenant"
              >
                Inisialisasi Database Tenant
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
