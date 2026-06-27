'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Pencil,
  Building2,
  Plus,
  X,
  Save,
  MapPin,
  Tag,
  FileText
} from 'lucide-react';

type Supplier = {
  ID: number;
  NAME: string;
  EMAIL: string;
  CATEGORY: string;
  CONTACT: string;
  ADDRESS: string;
  NOTES: string;
  STATUS: string;
};

// Helper for dynamic product avatars
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-indigo-500', 'bg-cyan-500', 
  'bg-violet-500', 'bg-sky-500', 'bg-slate-700'
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, review: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function loadSuppliers() {
    try {
      const res = await fetch('/api/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers || []);
        setMetrics({
          total: data.total || (data.suppliers || []).length,
          active: data.active || (data.suppliers || []).filter((s: Supplier) => s.STATUS?.toLowerCase() === 'active').length,
          review: data.review || (data.suppliers || []).filter((s: Supplier) => s.STATUS?.toLowerCase() === 'review').length
        });
      }
    } catch (error) {
      console.error("Failed syncing dental procurement dataset:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Extract unique categories dynamically for the filter bar
  const categories = useMemo(() => {
    const list = suppliers.map(s => s.CATEGORY).filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [suppliers]);

  // Multi-tier filter (Search query + Category Pill)
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch = 
        s.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.CATEGORY?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ADDRESS?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || s.CATEGORY === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, suppliers]);

  // Handle Status Dropdown Change
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATUS', status: newStatus }),
      });
      if (res.ok) {
        loadSuppliers(); 
      }
    } catch (err) {
      console.error("Error updating status inline:", err);
    }
  };

  // Open Edit Dialog
  const startEditing = (s: Supplier) => {
    setEditingSupplier({
      id: s.ID,
      supplierName: s.NAME,
      email: s.EMAIL,
      contact: s.CONTACT,
      category: s.CATEGORY,
      address: s.ADDRESS,
      notes: s.NOTES,
    });
    setIsEditOpen(true);
  };

  // Submit alterations
  const saveProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/suppliers/${editingSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_PROFILE', ...editingSupplier }),
      });
      if (res.ok) {
        setIsEditOpen(false);
        setEditingSupplier(null);
        loadSuppliers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Loading Procurement Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* TOTAL */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Vendors</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{metrics.total}</h2>
            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1"><Building2 size={14} /> Registered Partners</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck size={28} />
          </div>
        </div>

        {/* ACTIVE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Channels</p>
            <h2 className="text-3xl font-black text-emerald-600 mt-1">{metrics.active}</h2>
            <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><ShieldCheck size={14} /> Verified Supply Lines</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
        </div>

        {/* REVIEW */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Under Review</p>
            <h2 className="text-3xl font-black text-amber-600 mt-1">{metrics.review}</h2>
            <p className="text-xs font-bold text-amber-600 mt-2 flex items-center gap-1"><AlertTriangle size={14} /> Pending Audits</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
        </div>
      </div>

      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-4 lg:p-6 shadow-sm mb-8 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by vendor name, location, or consumables category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Dynamic Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 pr-2 shrink-0">Filter Segment:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DATA LEDGER CONTAINER */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header Row */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Truck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Procurement Ledger</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredSuppliers.length} Vendors Listed</p>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {filteredSuppliers.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Vendors Match</h3>
            <p className="text-slate-500 mt-1 text-sm font-medium">Try adjusting your category filters or register a new partner.</p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="mt-4 text-blue-600 font-bold text-sm hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Supplier Identity</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Supply Segment</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Direct Line</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Location</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Audit Status</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSuppliers.map((s) => {
                  const isActive = s.STATUS?.toLowerCase() === 'active';
                  const isReview = s.STATUS?.toLowerCase() === 'review';

                  return (
                    <tr key={s.ID} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* PROFILE IDENTITY */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0 ${getAvatarColor(s.NAME)}`}>
                            {s.NAME ? s.NAME.charAt(0).toUpperCase() : 'V'}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {s.NAME}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                              <Mail size={12} className="shrink-0" /> {s.EMAIL}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-xs">
                          {s.CATEGORY || 'General Supplies'}
                        </span>
                      </td>

                      {/* CONTACT */}
                      <td className="p-5 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-slate-400" /> {s.CONTACT || 'N/A'}
                        </div>
                      </td>

                      {/* ADDRESS */}
                      <td className="p-5 max-w-[200px]">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate" title={s.ADDRESS}>{s.ADDRESS || 'No physical office'}</span>
                        </div>
                      </td>
                      
                      {/* INLINE STATUS SELECTOR */}
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            isReview ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {s.STATUS}
                          </span>
                          
                          <select
                            value={s.STATUS}
                            onChange={(e) => handleStatusChange(s.ID, e.target.value)}
                            title="Quick Toggle Status"
                            className="text-xs bg-slate-100/80 hover:bg-slate-200 text-slate-600 rounded-lg p-1 outline-none cursor-pointer font-bold transition-colors border border-transparent focus:border-blue-500"
                          >
                            <option value="Active">Active</option>
                            <option value="Review">Review</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </td>

                      {/* EDIT ACTION */}
                      <td className="p-5 text-right">
                        <button
                          onClick={() => startEditing(s)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 font-bold text-xs shadow-sm active:scale-95 transition-all ml-auto"
                        >
                          <Pencil size={14} /> Edit Vendor
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODIFICATION MODAL SHEET --- */}
      {isEditOpen && editingSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            {/* Modal Header Banner */}
            <div className="bg-slate-900 p-8 flex justify-between items-start relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                  <Building2 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Modify Vendor Profile</h3>
                  <p className="text-blue-200/70 text-xs font-semibold uppercase tracking-widest mt-0.5">Audit & Ledger Updates</p>
                </div>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="relative z-10 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={saveProfileEdit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <InputField
                  label="Vendor Enterprise Name"
                  required
                  value={editingSupplier.supplierName}
                  onChange={(e: any) => setEditingSupplier({ ...editingSupplier, supplierName: e.target.value })}
                />
                
                <InputField
                  label="Procurement Email"
                  type="email"
                  required
                  value={editingSupplier.email}
                  onChange={(e: any) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                />
                
                <InputField
                  label="Direct Line / Dispatch Phone"
                  required
                  value={editingSupplier.contact}
                  onChange={(e: any) => setEditingSupplier({ ...editingSupplier, contact: e.target.value })}
                />
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Segment</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><Tag size={18} /></div>
                    <select
                      value={editingSupplier.category}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, category: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="Dental Consumables">Dental Consumables</option>
                      <option value="Orthodontic Kits">Orthodontic Kits</option>
                      <option value="Prosthodontics">Prosthodontics</option>
                      <option value="Endodontics & Restorative">Endodontics & Restorative</option>
                      <option value="Clinical Instruments">Clinical Instruments</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <InputField
                    label="Corporate Dispatch Address"
                    required
                    value={editingSupplier.address}
                    onChange={(e: any) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Audit Notes</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400"><FileText size={18} /></div>
                    <textarea
                      value={editingSupplier.notes || ''}
                      placeholder="Add compliance notes, lead times, or contract terms..."
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, notes: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm h-28 resize-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70"
                >
                  <Save size={18} /> {saving ? "Updating Ledger..." : "Save Vendor Alterations"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- POLISHED MODAL INPUT FIELD ---
const InputField = ({ label, value, onChange, type = 'text', required = false }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
    />
  </div>
);