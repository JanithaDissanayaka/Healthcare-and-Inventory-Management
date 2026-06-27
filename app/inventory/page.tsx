'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  AlertTriangle,
  Search,
  Boxes,
  Trash2,
  Plus,
  CheckCircle2,
  Activity,
  Archive
} from 'lucide-react';

type InventoryItem = {
  ITEM_ID: number;
  ITEM_NAME: string;
  QUANTITY: number;
  UNIT_PRICE: number;
  STATUS: string;
};

// Helper for dynamic product avatars
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-indigo-500', 'bg-cyan-500', 
  'bg-violet-500', 'bg-sky-500', 'bg-slate-700'
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.ITEM_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      item.ITEM_ID?.toString().includes(search)
    );
  }, [items, search]);

  const deleteItem = async (id: number, name: string) => {
    const confirmDelete = confirm(`CRITICAL ACTION: Are you sure you want to permanently delete "${name}" from the inventory ledger?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Deletion rejected by server');
      fetchInventory();
    } catch (error) {
      console.error(error);
      alert('Failed to remove item from the database.');
    }
  };

  // Metric Calculations
  const lowStockCount = items.filter(i => i.STATUS?.toUpperCase() === 'LOW STOCK').length;
  const availableCount = items.filter(i => i.STATUS?.toUpperCase() === 'AVAILABLE' || i.STATUS?.toUpperCase() === 'IN STOCK').length;

  const getAvatarColor = (name: string) => {
    if (!name) return AVATAR_COLORS[0];
    const charCode = name.charCodeAt(0) + (name.charCodeAt(name.length - 1) || 0);
    return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Loading Catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">
      
      {/* ANALYTICS SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* TOTAL ITEMS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total SKUs</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{items.length}</h2>
            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1"><Boxes size={14} /> Unique Products</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Archive size={28} />
          </div>
        </div>

        {/* LOW STOCK ALERT */}
        <div className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between ${lowStockCount > 0 ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'}`}>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Attention Required</p>
            <h2 className={`text-3xl font-black mt-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
              {lowStockCount}
            </h2>
            <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${lowStockCount > 0 ? 'text-rose-600' : 'text-emerald-500'}`}>
              {lowStockCount > 0 ? <><AlertTriangle size={14} className="animate-pulse" /> Critical Stock Levels</> : <><CheckCircle2 size={14}/> Optimal Levels</>}
            </p>
          </div>
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-500'}`}>
            <AlertTriangle size={28} />
          </div>
        </div>

        {/* AVAILABLE ITEMS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Healthy Stock</p>
            <h2 className="text-3xl font-black text-emerald-600 mt-1">{availableCount}</h2>
            <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><Activity size={14} /> Ready for Deployment</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package size={28} />
          </div>
        </div>
      </div>

      {/* SEARCH & TABLE CONTAINER */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* SEARCH BAR HEADER */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10 relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <Boxes size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Inventory Ledger</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredItems.length} Records Found</p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by Item Name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Item Details</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Quantity In Stock</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Unit Price</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isLowStock = item.STATUS?.toUpperCase() === 'LOW STOCK';

                  return (
                    <tr key={item.ITEM_ID} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* ITEM IDENTITY */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm ${getAvatarColor(item.ITEM_NAME)}`}>
                            {item.ITEM_NAME?.charAt(0).toUpperCase() || 'P'}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {item.ITEM_NAME}
                            </h3>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider font-mono">
                              SKU #{item.ITEM_ID}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* QUANTITY */}
                      <td className="p-5">
                        <span className={`text-lg font-black ${isLowStock ? 'text-rose-600' : 'text-slate-900'}`}>
                          {item.QUANTITY}
                        </span>
                      </td>

                      {/* UNIT PRICE */}
                      <td className="p-5">
                        <span className="font-bold text-slate-700 font-mono">
                          Rs. {Number(item.UNIT_PRICE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="p-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                            isLowStock
                              ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100'
                          }`}
                        >
                          {isLowStock && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
                          {item.STATUS}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-5 text-right">
                        <button
                          onClick={() => deleteItem(item.ITEM_ID, item.ITEM_NAME)}
                          title="Purge Item from Catalog"
                          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all active:scale-95 ml-auto flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Search className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">No Inventory Found</h3>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Try adjusting your search query or add a new item.</p>
                    {search && (
                      <button 
                        onClick={() => setSearch('')}
                        className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}