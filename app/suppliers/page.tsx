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
  Tag,
  MapPin,
  FileText
} from 'lucide-react';
import StatusBadge from "@/app/components/StatusBadge";

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

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, review: 0 });
  const [searchTerm, setSearchTerm] = useState("");
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
          total: data.total,
          active: data.active,
          review: data.review
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

  // Quick Action: Handle Status Dropdown Change
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_STATUS', status: newStatus }),
      });
      if (res.ok) {
        loadSuppliers(); // Reload numbers and tables automatically
      }
    } catch (err) {
      console.error("Error updating status inline:", err);
    }
  };

  // Open Edit Dialog Sheet
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

  // Submit profile alterations
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

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) =>
      s.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.CATEGORY?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, suppliers]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* TOP HEADER SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="bg-white border-b border-slate-200 px-8 py-7 relative">
          <div className="absolute right-10 top-6 h-24 w-24 rounded-full bg-cyan-50"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                <Truck className="text-cyan-600" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Dental Supplier Hub</h2>
                <p className="text-slate-500 mt-1 text-base">Manage clinical consumables, laboratory partners, and dental equipment vendors.</p>
              </div>
            </div>
            <Link
              href="/suppliers/add"
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
            >
              <Plus size={18} /> Register Supplier
            </Link>
          </div>
        </div>

        {/* METRICS & SEARCH AREA */}
        <div className="p-6 lg:p-8">
          <div className="relative mb-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by vendor name or dental material category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-[400px] pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Total Vendors</p>
                  <h2 className="text-4xl font-bold text-slate-900 mt-3">{metrics.total}</h2>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                  <Building2 className="text-cyan-600" size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Active Channels</p>
                  <h2 className="text-4xl font-bold text-emerald-600 mt-3">{metrics.active}</h2>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <ShieldCheck className="text-emerald-600" size={24} />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Under Review</p>
                  <h2 className="text-4xl font-bold text-amber-600 mt-3">{metrics.review}</h2>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="text-amber-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATA LEDGER TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-5">Supplier Profile</th>
                <th className="p-5">Dental Specialty</th>
                <th className="p-5">Contact Connection</th>
                <th className="p-5">Office Address</th>
                <th className="p-5">State Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredSuppliers.map((s) => (
                <tr key={s.ID} className="hover:bg-slate-50/60 transition">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-cyan-50 text-cyan-700 font-black text-md flex items-center justify-center">
                        {s.NAME ? s.NAME.charAt(0).toUpperCase() : 'V'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{s.NAME}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Mail size={12} /> {s.EMAIL}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 font-semibold text-slate-600">{s.CATEGORY}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <Phone size={14} className="text-slate-400" /> {s.CONTACT}
                    </div>
                  </td>
                  <td className="p-5 max-w-xs truncate text-slate-500 font-medium" title={s.ADDRESS}>{s.ADDRESS}</td>
                  
                  {/* FUNCTIONAL LIVE STATE COLUMN DROPDOWN */}
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={s.STATUS} />
                      <select
                        value={s.STATUS}
                        onChange={(e) => handleStatusChange(s.ID, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-600 outline-none cursor-pointer focus:ring-1 focus:ring-cyan-500 font-medium"
                      >
                        <option value="Active">Active</option>
                        <option value="Review">Review</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </td>

                  {/* EDIT PROFILE INVOCATION */}
                  <td className="p-5 text-right">
                    <button
                      onClick={() => startEditing(s)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
                    >
                      <Pencil size={13} /> Edit Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL SUPPLIER EDIT MODAL SHEETS OVERLAY */}
      {isEditOpen && editingSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="text-cyan-600" size={24} />
              <h3 className="text-xl font-bold text-slate-900">Modify Vendor Profile</h3>
            </div>

            <form onSubmit={saveProfileEdit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.supplierName}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, supplierName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-cyan-500 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Connection</label>
                  <input
                    type="email"
                    required
                    value={editingSupplier.email}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-cyan-500 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.contact}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, contact: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-cyan-500 bg-slate-50 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category Segment</label>
                  <select
                    value={editingSupplier.category}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-cyan-500 bg-slate-50 text-slate-900"
                  >
                    <option value="Dental Consumables">Dental Consumables</option>
                    <option value="Orthodontic Kits">Orthodontic Kits</option>
                    <option value="Prosthodontics">Prosthodontics</option>
                    <option value="Endodontics & Restorative">Endodontics & Restorative</option>
                    <option value="Clinical Instruments">Clinical Instruments</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Corporate Address</label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.address}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-cyan-500 bg-slate-50 text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Procurement Notes</label>
                  <textarea
                    value={editingSupplier.notes || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-cyan-500 bg-slate-50 text-slate-900 h-24 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
                >
                  <Save size={16} /> {saving ? "Saving Changes..." : "Save Alterations"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}