'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Truck,
  AlertTriangle,
  PackageCheck,
  Search,
  ShoppingCart,
  Phone,
  PackageOpen,
  ArrowRight,
  ShieldAlert,
  X,
  Warehouse,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Bot,
  RefreshCw,
  TrendingDown,
  Activity
} from 'lucide-react';

// --- INITIAL DATA ---
const INITIAL_STATS = {
  totalProducts: 142,
  activeSuppliers: 8,
  pendingOrders: 4
};

const INITIAL_INVENTORY = [
  { id: 101, name: 'Lidocaine HCL 2%', category: 'Anesthetics', stock: 45, minThreshold: 50, unit: 'Vials', status: 'Low Stock' as const },
  { id: 102, name: 'Nitrile Examination Gloves (M)', category: 'PPE', stock: 120, minThreshold: 30, unit: 'Boxes', status: 'In Stock' as const },
  { id: 103, name: 'Composite Resin Syringes', category: 'Restorative', stock: 12, minThreshold: 15, unit: 'Units', status: 'Low Stock' as const },
  { id: 104, name: 'Surgical Face Masks (Level 3)', category: 'PPE', stock: 350, minThreshold: 100, unit: 'Boxes', status: 'In Stock' as const },
  { id: 105, name: 'Endodontic Files (Assorted)', category: 'Endodontics', stock: 8, minThreshold: 20, unit: 'Packs', status: 'Critical' as const },
  { id: 106, name: 'Dental Alginate Impression Material', category: 'Materials', stock: 24, minThreshold: 10, unit: 'Bags', status: 'In Stock' as const }
];

const MOCK_SUPPLIERS = [
  { id: 1, name: 'MediSupply Co.', type: 'General Dental Supplies', phone: '011 234 5678', leadTime: '2 Days', rating: 4.8 },
  { id: 2, name: 'Apex Ortho Labs', type: 'Orthodontic Brackets & Wires', phone: '077 987 6543', leadTime: '5 Days', rating: 4.5 },
  { id: 3, name: 'Global PPE Imports', type: 'Gloves, Masks & Sanitizers', phone: '071 555 4444', leadTime: '1 Day', rating: 4.9 }
];

export default function SupplyDashboardPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  // Interactive UI States
  const [activeCall, setActiveCall] = useState<{ name: string; phone: string; duration: number } | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  const lowStockCount = inventory.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length;

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toString().includes(searchQuery)
    );
  }, [searchQuery, inventory]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleRestock = (id: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = item.minThreshold + 50; 
        return { ...item, stock: newStock, status: 'In Stock' };
      }
      return item;
    }));
    setStats(prev => ({ ...prev, pendingOrders: prev.pendingOrders + 1 }));
  };

  const handleCall = (name: string, phone: string) => {
    setActiveCall({ name, phone, duration: 0 });
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const handleAIPurchase = () => {
    setAiProcessing(true);
    
    setTimeout(() => {
      setInventory(prev => prev.map(item => {
        if (item.status === 'Low Stock' || item.status === 'Critical') {
          return { ...item, stock: item.minThreshold + 100, status: 'In Stock' };
        }
        return item;
      }));
      
      setStats(prev => ({ ...prev, pendingOrders: prev.pendingOrders + lowStockCount }));
      setAiProcessing(false);
      setAiModalOpen(false);
      setShowAlert(false); 
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Helper for stock visualization bar
  const getStockPercentage = (stock: number, threshold: number) => {
    const maxExpected = threshold * 3; // Arbitrary max for visual scale
    const percentage = (stock / maxExpected) * 100;
    return Math.min(Math.max(percentage, 5), 100); // cap between 5% and 100%
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans relative">
      
      {/* --- ACTIVE CALL OVERLAY --- */}
      {activeCall && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white p-5 rounded-[2rem] shadow-2xl shadow-emerald-500/10 border border-slate-700 w-80 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <PhoneCall className="text-emerald-400" size={20} />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">{activeCall.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-emerald-400 font-mono text-xs">{formatTime(activeCall.duration)}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={endCall}
            className="w-full py-3 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Phone size={16} className="rotate-[135deg]" /> End Connection
          </button>
        </div>
      )}

      {/* --- AI SMART AGENT MODAL --- */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-6 flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white tracking-tight">AI Supply Agent</h3>
                  <p className="text-blue-200/70 text-xs font-semibold uppercase tracking-widest mt-0.5">Automated Restock Analysis</p>
                </div>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="relative z-10 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8">
              {lowStockCount === 0 ? (
                <div className="text-center py-8">
                  <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <CheckCircle2 size={36} className="text-emerald-500" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xl">Inventory is Optimal</h4>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Your supply chain is perfectly balanced. No automated actions required.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-slate-700">
                    <Sparkles className="text-blue-500 shrink-0 mt-0.5" size={18} />
                    <p>
                      I detected <b className="text-blue-700">{lowStockCount}</b> items operating below safe thresholds. I have mapped them to your preferred suppliers and calculated optimal restock volumes.
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                    {inventory.filter(i => i.status !== 'In Stock').map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-rose-500 font-semibold mt-0.5 flex items-center gap-1">
                            <TrendingDown size={12} /> Deficit: {item.minThreshold - item.stock} {item.unit}
                          </p>
                        </div>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg shadow-sm shrink-0">
                          +100 Units
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAIPurchase}
                    disabled={aiProcessing}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-80"
                  >
                    {aiProcessing ? (
                      <><RefreshCw size={20} className="animate-spin text-blue-400" /> Transmitting Purchase Orders...</>
                    ) : (
                      <><Sparkles size={20} className="text-blue-400" /> Approve & Execute Auto-Restock</>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CRITICAL STOCK ALERTS STRIP */}
      {lowStockCount > 0 && showAlert && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500 rounded-xl text-white shadow-inner">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-base font-black text-rose-900">Critical Stock Warning</p>
              <p className="text-sm text-rose-700 font-medium mt-0.5"><b>{lowStockCount}</b> items have fallen below their minimum operating threshold. Immediate restock required.</p>
            </div>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-rose-400 hover:text-rose-600 p-2 bg-rose-100/50 hover:bg-rose-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
      )}

      {/* HEADER STRIP */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-widest mb-3 border border-blue-500/20">
            <Warehouse size={14} /> Supply Chain Hub
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Inventory & Logistics</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium max-w-xl">
            Unified monitoring of clinical supplies, real-time stock levels, and vendor management network.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 mt-4 lg:mt-0 flex-wrap">
          <button 
            onClick={() => setAiModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 border border-blue-400/50"
          >
            <Sparkles size={18} /> Run AI Analysis
          </button>
          <button className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md border border-white/10 active:scale-95">
            <ShoppingCart size={18} /> Manual PO
          </button>
        </div>
      </div>

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Catalog</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">{stats.totalProducts}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1"><Boxes size={14} /> Active SKUs</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center"><Activity size={28} /></div>
        </div>

        <div className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between ${lowStockCount > 0 ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'}`}>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Attention Required</p>
            <h3 className={`text-4xl font-black mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>{lowStockCount}</h3>
            <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
              {lowStockCount > 0 ? <><AlertTriangle size={14}/> Low Stock Alerts</> : <><CheckCircle2 size={14}/> Optimal Levels</>}
            </p>
          </div>
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-500'}`}>
            {lowStockCount > 0 ? <PackageOpen size={28} /> : <PackageCheck size={28} />}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Vendors</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">{stats.activeSuppliers}</h3>
            <p className="text-xs font-bold text-blue-600 mt-2 flex items-center gap-1"><ShieldAlert size={14} /> Approved Suppliers</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Truck size={28} /></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inbound Shipments</p>
            <h3 className="text-4xl font-black text-slate-900 mt-1">{stats.pendingOrders}</h3>
            <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><Truck size={14} /> Pending Deliveries</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><PackageCheck size={28} /></div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: INVENTORY TABLE */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10 relative">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Boxes size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Fast-Moving Inventory</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredInventory.length} Items Listed</p>
              </div>
            </div>
            
            <div className="relative w-full sm:w-72">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search SKU or Category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Product Line</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-48">Stock Health</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                  <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredInventory.length > 0 ? filteredInventory.map((item) => {
                  const isCritical = item.status === 'Critical' || item.status === 'Low Stock';
                  const stockPercent = getStockPercentage(item.stock, item.minThreshold);
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      <td className="p-4">
                        <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">#{item.id}</span>
                          <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-end justify-between mb-1.5">
                          <span className={`font-black ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>
                            {item.stock} <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Min: {item.minThreshold}</span>
                        </div>
                        {/* Visual Stock Bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.status === 'Critical' ? 'bg-rose-500' :
                              item.status === 'Low Stock' ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        {isCritical ? (
                          <button 
                            onClick={() => handleRestock(item.id)}
                            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                          >
                            Order Restock
                          </button>
                        ) : (
                          <button disabled className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed rounded-xl text-xs font-bold transition-all">
                            Sufficient
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="p-16 text-center">
                       <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-300" size={24} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900">No Inventory Found</h3>
                      <p className="text-slate-500 mt-1 text-sm font-medium">Try adjusting your search query.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link href="/inventory" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 transition-colors">
              Access Complete Master Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL: SUPPLIER DIRECTORY */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Truck className="text-emerald-600" size={22} /> Preferred Vendors
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-semibold">Direct line to top-rated suppliers</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {MOCK_SUPPLIERS.map((supplier) => (
              <div key={supplier.id} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="min-w-0 pr-2">
                    <h3 className="font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{supplier.name}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1 truncate">{supplier.type}</p>
                  </div>
                  <div className="px-2 py-1 bg-amber-50 border border-amber-100 rounded-lg text-xs font-bold text-amber-700 shadow-sm flex items-center gap-1 shrink-0">
                    ★ {supplier.rating}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead Time</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{supplier.leadTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleCall(supplier.name, supplier.phone)}
                  disabled={activeCall !== null}
                  className="w-full py-3 bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Phone size={14} /> Call {supplier.phone}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link href="/suppliers" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 transition-colors">
              Vendor Management Console <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}