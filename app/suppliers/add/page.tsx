'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  Mail,
  Phone,
  Tag,
  MapPin,
  FileText,
  Save,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Building
} from 'lucide-react';

export default function AddSupplierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    supplierName: '',
    email: '',
    contact: '',
    category: '',
    address: '',
    notes: '',
    status: 'Active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register vendor');
      }

      // 1. Show the beautiful success banner
      setSuccess(true);
      
      // 2. Clear the form fields
      setFormData({
        supplierName: '', email: '', contact: '', category: '', address: '', notes: '', status: 'Active'
      });

      // 3. Wait 2 seconds so the user reads the message, then redirect
      setTimeout(() => {
        router.push('/suppliers'); 
      }, 2000);

    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error connecting to network services during execution.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans flex flex-col items-center">
      
      {/* TOP NAVIGATION */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link 
          href="/suppliers" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-500 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} /> Back to Vendor Management
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={16} className="text-blue-500" />
          Secure Supply Chain
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden w-full max-w-4xl">
        
        {/* HEADER BANNER */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner text-white">
              <Building size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Register Supplier</h2>
              <p className="text-slate-400 mt-1 text-sm font-medium">Onboard laboratory vendors, clinical instrument suppliers, and medical manufacturers.</p>
            </div>
          </div>
        </div>

        {/* REGISTRATION FORM CONTENT */}
        <div className="p-6 lg:p-10 relative">
          
          {/* SUCCESS MESSAGE BANNER */}
          {success && (
            <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4 transition-all duration-500 animate-in fade-in slide-in-from-top-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-900">Vendor Registered Successfully!</h3>
                <p className="text-sm text-emerald-700 font-medium mt-0.5">Supplier profile securely added to the ledger. Redirecting...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 className="text-blue-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Corporate Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* VENDOR NAME */}
                <InputField
                  label="Supplier / Corporate Name"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  placeholder="e.g. State Pharmaceuticals (SPC)"
                  icon={<Building2 size={18} />}
                />

                {/* CORPORATE EMAIL */}
                <InputField
                  label="Corporate Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. orders@vendor.lk"
                  icon={<Mail size={18} />}
                />

                {/* CONTACT NUMBER */}
                <InputField
                  label="Direct Line / Dispatch Phone"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. +94 11 234 5678"
                  icon={<Phone size={18} />}
                />

                {/* DENTAL CATEGORY SELECT */}
                <SelectField
                  label="Logistics Category Segment"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  icon={<Tag size={18} />}
                  options={[
                    'Dental Consumables',
                    'Orthodontic Kits',
                    'Prosthodontics',
                    'Endodontics & Restorative',
                    'Clinical Instruments'
                  ]}
                  placeholder="-- Select Supply Segment --"
                />

                {/* OFFICE ADDRESS */}
                <div className="md:col-span-2">
                  <InputField
                    label="Corporate Office Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Galle Road, Colombo, Sri Lanka"
                    icon={<MapPin size={18} />}
                  />
                </div>

                {/* INITIAL VENDOR STATE */}
                <SelectField
                  label="Initial Account Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  icon={<ShieldCheck size={18} />}
                  options={['Active', 'Review', 'Inactive']}
                  placeholder=""
                />

                {/* PROCUREMENT NOTES */}
                <div className="md:col-span-2 group">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                    Procurement & Contract Notes
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <FileText size={18} />
                    </div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Enter specific delivery timelines, material grades, or contract details..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white placeholder:text-slate-400 shadow-sm h-32 resize-none"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* CONTROL REDIRECT TRIGGERS */}
            <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/suppliers')}
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
                  <>Saving Profile...</>
                ) : (
                  <>
                    <Save size={20} />
                    Register Vendor Profile
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

// --- POLISHED REUSABLE COMPONENTS ---

const InputField = ({ label, type = "text", placeholder = "", name, value, onChange, icon }: any) => (
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
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white placeholder:text-slate-400 shadow-sm"
      />
    </div>
  </div>
);

const SelectField = ({ label, options, name, value, onChange, icon, placeholder }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white cursor-pointer shadow-sm appearance-none"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {/* Custom Dropdown Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);