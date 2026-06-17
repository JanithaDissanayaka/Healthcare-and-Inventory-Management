'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Phone,
  Tag,
  MapPin,
  FileText,
  Save,
  ShieldCheck,
} from 'lucide-react';

export default function AddSupplierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

      if (res.ok) {
        alert(data.message);
        router.push('/suppliers'); // Immediate table redirect
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to network services during execution.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-5xl mx-auto overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 px-8 py-7 relative">
          <div className="absolute right-10 top-6 h-24 w-24 rounded-full bg-cyan-50"></div>
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <Building2 className="text-cyan-600" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Add Dental Supplier</h2>
              <p className="text-slate-500 mt-2 text-base">Register laboratory vendors, clinical instrument suppliers, and medical manufacturers.</p>
            </div>
          </div>
        </div>

        {/* REGISTRATION FORM */}
        <div className="p-6 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={18} className="text-cyan-600" />
                <h3 className="text-lg font-bold text-slate-900">Supplier Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* VENDOR NAME */}
                <InputField
                  label="Supplier / Corporate Name"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  placeholder="e.g. State Pharmaceuticals Corporation (SPC)"
                  icon={<Building2 size={18} />}
                />

                {/* CORPORATE EMAIL */}
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="orders@vendor.lk"
                  icon={<Mail size={18} />}
                />

                {/* CONTACT NUMBER */}
                <InputField
                  label="Phone Number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. +94 11 234 5678"
                  icon={<Phone size={18} />}
                />

                {/* DENTAL CATEGORY SELECT */}
                <SelectField
                  label="Dental Logistics Category"
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
                  label="Supplier Account Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  icon={<ShieldCheck size={18} />}
                  options={['Active', 'Review', 'Inactive']}
                />

                {/* PROCUREMENT NOTES */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Procurement & Contract Notes</label>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-slate-400"><FileText size={18} /></div>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Enter specific delivery timelines, material grades, or contract details..."
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none transition-all focus:ring-2 focus:ring-cyan-500 h-32 resize-none"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* BUTTON ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-70"
              >
                <Save size={20} />
                {loading ? 'Saving Profile...' : 'Register Vendor Profile'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/suppliers')}
                className="px-8 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

// --- Internal Reusable Subcomponents ---

const InputField = ({ label, type = "text", placeholder = "", name, value, onChange, icon }: any) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none transition-all focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  </div>
);

const SelectField = ({ label, options, name, value, onChange, icon }: any) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">{icon}</div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none appearance-none transition-all focus:ring-2 focus:ring-cyan-500"
      >
        <option value="">Select Option</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  </div>
);