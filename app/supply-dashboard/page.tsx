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
  RefreshCw
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

  // Dynamically calculate low stock count based on live inventory
  const lowStockCount = inventory.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length;

  // Live filter for inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, inventory]);

  // Phone Call Timer Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  // ACTION: Manual Individual Restock
  const handleRestock = (id: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        // Boost stock safely above threshold
        const newStock = item.minThreshold + 50; 
        return { ...item, stock: newStock, status: 'In Stock' };
      }
      return item;
    }));
    setStats(prev => ({ ...prev, pendingOrders: prev.pendingOrders + 1 }));
  };

  // ACTION: Start Phone Call
  const handleCall = (name: string, phone: string) => {
    setActiveCall({ name, phone, duration: 0 });
  };

  // ACTION: End Phone Call
  const endCall = () => {
    setActiveCall(null);
  };

  // ACTION: AI Auto-Restock Everything
  const handleAIPurchase = () => {
    setAiProcessing(true);
    
    // Simulate AI thinking time
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
      setShowAlert(false); // Clear the top alert since everything is fixed
    }, 1500);
  };

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8 relative">
      
      {/* --- ACTIVE CALL OVERLAY --- */}
      {activeCall && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-slate-700 w-80 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse">
              <PhoneCall className="text-emerald-400" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm">{activeCall.name}</h4>
              <p className="text-emerald-400 font-mono text-xs mt-0.5">{formatTime(activeCall.duration)}</p>
            </div>
          </div>
          <button 
            onClick={endCall}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Phone size={16} className="rotate-[135deg]" /> End Call
          </button>
        </div>
      )}

      {/* --- AI SMART AGENT MODAL --- */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <Bot size={28} />
                <div>
                  <h3 className="font-black text-lg">AI Supply Chain Agent</h3>
                  <p className="text-blue-100 text-xs">Automated Restock Analysis</p>
                </div>
              </div>
              <button onClick={() => setAiModalOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {lowStockCount === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900 text-lg">Inventory is Optimal</h4>
                  <p className="text-slate-500 text-sm mt-1">No AI actions required at this time.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600 mb-4">
                    I detected <b>{lowStockCount}</b> items operating below safe thresholds. I have mapped them to your preferred suppliers.
                  </p>
                  
                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                    {inventory.filter(i => i.status !== 'In Stock').map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Deficit: {item.minThreshold - item.stock} {item.unit}</p>
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">+100 Auto-Order</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleAIPurchase}
                    disabled={aiProcessing}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                  >
                    {aiProcessing ? (
                      <><RefreshCw size={20} className="animate-spin" /> Transmitting Orders...</>
                    ) : (
                      <><Sparkles size={20} className="text-blue-400" /> Approve All & Auto-Restock</>
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
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500 rounded-xl text-white">
              <ShieldAlert size={28} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">Critical Stock Warning</p>
              <p className="text-sm text-slate-600">You have <b>{lowStockCount}</b> items falling below their minimum required threshold. Restock recommended immediately.</p>
            </div>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-slate-400 hover:text-slate-600 p-2">
            <X size={24} />
          </button>
        </div>
      )}

      {/* HEADER STRIP */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 lg:p-8 text-white border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-widest">
            <Warehouse size={20} /> Supply Chain Hub
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mt-2">Inventory & Suppliers</h1>
          <p className="text-slate-400 text-base mt-1">Unified monitoring of clinic supplies and vendor networks.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => setAiModalOpen(true)}
            className="px-6 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition flex items-center gap-2 shadow-sm border border-indigo-400"
          >
            <Sparkles size={20} /> Run AI Analysis
          </button>
          <button className="px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition flex items-center gap-2 shadow-sm">
            <ShoppingCart size={20} /> Manual Purchase Order
          </button>
        </div>
      </div>

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Catalog</span>
            <h3 className="text-4xl font-black text-slate-900 mt-2">{stats.totalProducts}</h3>
            <p className="text-sm text-slate-500 font-bold mt-2">Active SKUs</p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center"><Boxes size={32} /></div>
        </div>

        <div className={`bg-white rounded-3xl border p-6 shadow-sm flex items-center justify-between transition-colors ${lowStockCount > 0 ? 'border-rose-200' : 'border-slate-200'}`}>
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Attention Required</span>
            <h3 className={`text-4xl font-black mt-2 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>{lowStockCount}</h3>
            <p className={`text-sm font-bold mt-2 flex items-center gap-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
              {lowStockCount > 0 ? <><AlertTriangle size={16}/> Low Stock Items</> : <><CheckCircle2 size={16}/> All Optimal</>}
            </p>
          </div>
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-500'}`}>
            {lowStockCount > 0 ? <PackageOpen size={32} /> : <PackageCheck size={32} />}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Vendors</span>
            <h3 className="text-4xl font-black text-slate-900 mt-2">{stats.activeSuppliers}</h3>
            <p className="text-sm text-blue-600 font-bold mt-2">Approved Suppliers</p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><Truck size={32} /></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Inbound Shipments</span>
            <h3 className="text-4xl font-black text-emerald-600 mt-2">{stats.pendingOrders}</h3>
            <p className="text-sm text-emerald-600 font-bold mt-2">Pending Deliveries</p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><PackageCheck size={32} /></div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT PANEL: INVENTORY TABLE */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Boxes className="text-blue-600" size={24} /> Fast-Moving Inventory
              </h2>
            </div>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm outline-none text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 z-10">
                <tr>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Level</th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length > 0 ? filteredInventory.map((item) => {
                  const isCritical = item.status === 'Critical' || item.status === 'Low Stock';
                  return (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: #{item.id}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-end gap-1">
                          <span className={`text-lg font-black ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>
                            {item.stock}
                          </span>
                          <span className="text-xs text-slate-500 font-medium pb-0.5">{item.unit}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">Min threshold: {item.minThreshold}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 
                          'bg-rose-100 text-rose-700 animate-pulse'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {isCritical ? (
                          <button 
                            onClick={() => handleRestock(item.id)}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
                          >
                            Restock
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-slate-100 text-slate-400 cursor-not-allowed rounded-lg text-xs font-bold transition">
                            Stocked
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500 font-medium">No inventory items match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link href="/inventory" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
              View Complete Inventory <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL: SUPPLIER DIRECTORY */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Truck className="text-emerald-600" size={24} /> Preferred Suppliers
            </h2>
            <p className="text-slate-500 text-xs mt-1">Quick access to top vendor contacts</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {MOCK_SUPPLIERS.map((supplier) => (
              <div key={supplier.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-emerald-200 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{supplier.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">{supplier.type}</p>
                  </div>
                  <div className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                    ★ {supplier.rating}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4 pt-3 border-t border-slate-200/60">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Lead Time</p>
                    <p className="text-sm font-bold text-slate-700 mt-0.5">{supplier.leadTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5">Active</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleCall(supplier.name, supplier.phone)}
                  disabled={activeCall !== null}
                  className="w-full py-2.5 bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Phone size={14} /> {supplier.phone}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link href="/suppliers" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1">
              Manage All Suppliers <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}