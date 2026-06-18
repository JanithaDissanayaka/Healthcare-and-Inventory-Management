'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  CalendarDays,
  Phone,
  MapPin,
  VenusAndMars,
  Save,
  Users,
  Droplets,
  ArrowLeft
} from 'lucide-react';

export default function NewPatientForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    phone: '', address: '', bloodGroup: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      alert(data.message || 'Patient added successfully!');
      
      setFormData({
        firstName: '', lastName: '', dob: '', gender: '',
        phone: '', address: '', bloodGroup: '',
      });
    } catch (error) {
      console.error(error);
      alert('Error adding patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      
      <div className="mb-6">
        <Link href="/patients" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-4xl">
        
        {/* TOP BANNER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute right-10 top-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
          <div className="absolute right-24 top-14 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl"></div>

          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm">
              <Users className="text-emerald-400" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Patient Registration</h2>
              <p className="text-slate-400 mt-1 text-sm font-medium">Add a new healthcare profile to the secure registry.</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" icon={<User size={18} />} />
              <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" icon={<User size={18} />} />
              <InputField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} icon={<CalendarDays size={18} />} />
              
              <SelectField 
                label="Gender" 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                icon={<VenusAndMars size={18} />} 
                options={['Male', 'Female']} 
              />
              
              <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="077 123 4567" icon={<Phone size={18} />} />
              <InputField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="A+" icon={<Droplets size={18} />} />
              
              <div className="md:col-span-2">
                <InputField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Colombo, Sri Lanka" icon={<MapPin size={18} />} />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-sm"
              >
                <Save size={20} />
                {loading ? 'Registering Patient...' : 'Register Patient Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// FIXED: Added pointer-events-none to the icon wrapper so it doesn't block clicks
const InputField = ({ label, type = 'text', placeholder = '', name, value, onChange, icon }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white"
      />
    </div>
  </div>
);

// FIXED: Added pointer-events-none and styled the dropdown arrow properly
const SelectField = ({ label, options, name, value, onChange, icon }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">{icon}</div>
      <select
        name={name} value={value} onChange={onChange} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white cursor-pointer"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
    </div>
  </div>
);