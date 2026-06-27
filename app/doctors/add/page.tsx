'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Stethoscope,
  Phone,
  Mail,
  Save,
  BriefcaseMedical,
  DollarSign,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Contact
} from 'lucide-react';

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    email: '',
    salary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.specialization) {
      alert("Please select a dental specialization department.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to register practitioner');
      }

      // 1. Show the beautiful success banner
      setSuccess(true);
      
      // 2. Clear the form fields
      setFormData({
        name: '', specialization: '', phone: '', email: '', salary: '',
      });

      // 3. Wait 2 seconds so the user reads the message, then redirect
      setTimeout(() => {
        router.push('/doctors'); 
      }, 2000);

    } catch (error) {
      console.error(error);
      alert('Error registering practitioner profile. Please check database connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans flex flex-col items-center">
      
      {/* TOP NAVIGATION */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link 
          href="/doctors" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-500 hover:text-cyan-700 hover:border-cyan-200 hover:bg-cyan-50 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} /> Back to Faculty
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={16} className="text-cyan-500" />
          Secure Staff Registry
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden w-full max-w-4xl">
        
        {/* HEADER BANNER */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-cyan-500/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner text-white">
              <BriefcaseMedical size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Specialist Registration</h2>
              <p className="text-slate-400 mt-1 text-sm font-medium">Onboard specialized dental surgeons into the clinical system.</p>
            </div>
          </div>
        </div>

        {/* INPUT FORM CONTENT */}
        <div className="p-6 lg:p-10 relative">
          
          {/* SUCCESS MESSAGE BANNER */}
          {success && (
            <div className="mb-8 p-5 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center gap-4 transition-all duration-500 animate-in fade-in slide-in-from-top-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-cyan-500 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
                <CheckCircle2 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-base font-black text-cyan-900">Registration Successful!</h3>
                <p className="text-sm text-cyan-700 font-medium mt-0.5">Specialist profile securely added. Redirecting to faculty directory...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* SECTION 1: Identity & Contact */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Contact className="text-cyan-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Identity & Contact</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Practitioner Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<User size={18} />}
                  placeholder="e.g. John Doe"
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone size={18} />}
                  placeholder="e.g. +94 77 123 4567"
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Secure Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail size={18} />}
                    placeholder="e.g. doctor@carepulse.lk"
                    type="email"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Professional Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Stethoscope className="text-cyan-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Professional Portfolio</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Dental Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  icon={<Stethoscope size={18} />}
                  options={[
                    { value: 'General Dentistry', label: 'General Dentistry (OPD Diagnostics)' },
                    { value: 'Orthodontics', label: 'Orthodontics (Braces & Aligners)' },
                    { value: 'Endodontics', label: 'Endodontics (Root Canal Specialist)' },
                    { value: 'Periodontics', label: 'Periodontics (Gum Disease Specialist)' },
                    { value: 'Prosthodontics', label: 'Prosthodontics (Dentures & Implants)' },
                    { value: 'Oral & Maxillofacial Surgery', label: 'Oral & Maxillofacial Surgery' },
                    { value: 'Pedodontics', label: 'Pedodontics (Pediatric Dental Specialist)' },
                  ]}
                />

                <InputField
                  label="Payroll Salary Base (Rs.)"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  icon={<DollarSign size={18} />}
                  placeholder="e.g. 250000"
                  type="number"
                />
              </div>
            </div>

            {/* CONTROL REDIRECT TRIGGERS */}
            <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/doctors')}
                disabled={loading || success}
                className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-lg shadow-cyan-600/30 active:scale-[0.98]"
              >
                {success ? (
                  <>Redirecting...</>
                ) : loading ? (
                  <>Registering...</>
                ) : (
                  <>
                    <Save size={20} />
                    Register Practitioner Profile
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

const InputField = ({ label, name, value, onChange, icon, placeholder, type = 'text' }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-cyan-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors">
        {icon}
      </div>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-cyan-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white placeholder:text-slate-400 shadow-sm"
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, icon, options }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-cyan-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-cyan-500 transition-colors">
        {icon}
      </div>
      <select
        name={name} value={value} onChange={onChange} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-cyan-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white cursor-pointer shadow-sm appearance-none"
      >
        <option value="" disabled>-- Select Dental Track --</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {/* Custom Dropdown Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
);