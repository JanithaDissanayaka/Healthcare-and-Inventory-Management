'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  CalendarDays,
  Phone,
  MapPin,
  VenusAndMars,
  Save,
  Users,
  Droplets,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Activity
} from 'lucide-react';

export default function NewPatientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      
      if (!res.ok) {
        throw new Error('Failed to register patient');
      }
      
      // 1. Show the beautiful success banner
      setSuccess(true);
      
      // 2. Clear the form fields
      setFormData({
        firstName: '', lastName: '', dob: '', gender: '',
        phone: '', address: '', bloodGroup: '',
      });

      // 3. Wait 2 seconds so the user reads the message, then redirect
      setTimeout(() => {
        router.push('/patients');
      }, 2000);

    } catch (error) {
      console.error(error);
      alert('Error adding patient. Please check your database connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans flex flex-col items-center">
      
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link 
          href="/patients" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-500 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} /> Back to Directory
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={16} className="text-emerald-500" />
          Secure Registry
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden w-full max-w-4xl">
        
        {/* TOP BANNER */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner text-white">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Patient Registration</h2>
              <p className="text-slate-400 mt-1 text-sm font-medium">Create a new healthcare profile in the central database.</p>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-6 lg:p-10 relative">
          
          {/* SUCCESS MESSAGE BANNER */}
          {success && (
            <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4 transition-all duration-500 animate-in fade-in slide-in-from-top-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-900">Registration Successful!</h3>
                <p className="text-sm text-emerald-700 font-medium mt-0.5">Patient profile securely added. Redirecting to directory...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* SECTION 1: Personal Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="text-emerald-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Personal Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" icon={<User size={18} />} />
                <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" icon={<User size={18} />} />
                <InputField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} icon={<CalendarDays size={18} />} />
                
                <SelectField 
                  label="Gender" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  icon={<VenusAndMars size={18} />} 
                  options={['Male', 'Female']} 
                />
              </div>
            </div>

            {/* SECTION 2: Contact & Medical */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="text-emerald-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Contact & Medical Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 077 123 4567" icon={<Phone size={18} />} />
                <InputField label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. O+" icon={<Droplets size={18} />} />
                
                <div className="md:col-span-2">
                  <InputField label="Residential Address" name="address" value={formData.address} onChange={handleChange} placeholder="e.g. 123 Main St, Colombo, Sri Lanka" icon={<MapPin size={18} />} />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/patients')}
                disabled={loading || success}
                className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-3 bg-blue-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
              >
                {success ? (
                  <>Redirecting...</>
                ) : loading ? (
                  <>Registering...</>
                ) : (
                  <>
                    <Save size={20} />
                    Register Patient Profile
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

// --- POLISHED INPUT COMPONENTS ---

const InputField = ({ label, type = 'text', placeholder = '', name, value, onChange, icon }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-emerald-500 transition-colors">
        {icon}
      </div>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white placeholder:text-slate-400 shadow-sm"
      />
    </div>
  </div>
);

const SelectField = ({ label, options, name, value, onChange, icon }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10 group-focus-within:text-emerald-500 transition-colors">
        {icon}
      </div>
      <select
        name={name} value={value} onChange={onChange} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white cursor-pointer shadow-sm appearance-none"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}
      </select>
      {/* Custom Dropdown Arrow to replace the default one */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);