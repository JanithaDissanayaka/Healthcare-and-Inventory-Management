'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Boxes,
  Save,
  DollarSign,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  PackagePlus,
  Tag
} from 'lucide-react';

export default function AddInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unitPrice: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add inventory item');
      }

      // 1. Show the beautiful success banner
      setSuccess(true);
      
      // 2. Clear the form fields
      setFormData({
        itemName: '', quantity: '', unitPrice: '',
      });

      // 3. Wait 2 seconds so the user reads the message, then redirect
      setTimeout(() => {
        router.push('/inventory'); 
      }, 2000);

    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error adding inventory. Please check your database connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans flex flex-col items-center">
      
      {/* TOP NAVIGATION */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link 
          href="/inventory" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-500 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} /> Back to Master Catalog
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={16} className="text-blue-500" />
          Secure Inventory Hub
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden w-full max-w-4xl">
        
        {/* HEADER BANNER */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner text-white">
              <PackagePlus size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Add New SKU</h2>
              <p className="text-slate-400 mt-1 text-sm font-medium">Register a new product, medicine, or equipment into the clinical catalog.</p>
            </div>
          </div>
        </div>

        {/* INPUT FORM CONTENT */}
        <div className="p-6 lg:p-10 relative">
          
          {/* SUCCESS MESSAGE BANNER */}
          {success && (
            <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4 transition-all duration-500 animate-in fade-in slide-in-from-top-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-900">Inventory Updated!</h3>
                <p className="text-sm text-emerald-700 font-medium mt-0.5">New SKU securely added to the catalog. Redirecting...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* SECTION 1: Item Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Tag className="text-blue-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Item Specifications</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* ITEM NAME (Full Width) */}
                <div className="md:col-span-2">
                  <InputField
                    label="Product Name / Description"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    icon={<Package size={18} />}
                    placeholder="e.g. Nitrile Examination Gloves (Box of 100)"
                  />
                </div>

                {/* QUANTITY */}
                <InputField
                  label="Initial Stock Quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  icon={<Boxes size={18} />}
                  placeholder="e.g. 50"
                />

                {/* UNIT PRICE */}
                <InputField
                  label="Unit Price (LKR)"
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  icon={<span className="font-bold text-sm">Rs</span>}
                  placeholder="e.g. 2500.00"
                />

              </div>
            </div>

            {/* CONTROL REDIRECT TRIGGERS */}
            <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/inventory')}
                disabled={loading || success}
                className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-lg shadow-blue-600/30 active:scale-[0.98]"
              >
                {success ? (
                  <>Redirecting...</>
                ) : loading ? (
                  <>Saving Item...</>
                ) : (
                  <>
                    <Save size={20} />
                    Add Inventory Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

// --- POLISHED REUSABLE INPUT COMPONENT ---

const InputField = ({ label, name, value, onChange, icon, placeholder, type = 'text' }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required
        min={type === 'number' ? "0" : undefined}
        step={type === 'number' ? "any" : undefined}
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white placeholder:text-slate-400 shadow-sm"
      />
    </div>
  </div>
);