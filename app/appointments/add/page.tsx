'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CalendarDays, 
  User, 
  Stethoscope, 
  ClipboardCheck, 
  Save, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  CalendarPlus,
  Clock
} from 'lucide-react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
};

type Doctor = {
  ID: number;
  NAME: string;
};

export default function NewAppointmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    status: 'PENDING',
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error("Patient list processing failed:", error);
      setPatients([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(Array.isArray(data.doctorsList) ? data.doctorsList : []);
      }
    } catch (error) {
      console.error("Staff list processing failed:", error);
      setDoctors([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.date) {
      // Replaced alert with a cleaner validation flow could go here, 
      // but 'required' on inputs handles most of this automatically now.
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error('Execution rejected by server');
      }

      // 1. Show beautiful success banner
      setSuccess(true);

      // 2. Clear form
      setFormData({
        patientId: '', doctorId: '', date: '', status: 'PENDING',
      });

      // 3. Wait 2 seconds, then redirect
      setTimeout(() => {
        router.push('/appointments'); 
      }, 2000);

    } catch (error) {
      console.error(error);
      alert('Error creating appointment allocation record. Please check your connection.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans flex flex-col items-center">
      
      {/* TOP NAVIGATION */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link 
          href="/appointments" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-500 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={16} /> Back to Schedule Ledger
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <ShieldCheck size={16} className="text-indigo-500" />
          Secure Scheduling System
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden w-full max-w-4xl">
        
        {/* HEADER BANNER */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-inner text-white">
              <CalendarPlus size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Book Appointment</h2>
              <p className="text-slate-400 mt-1 text-sm font-medium">Allocate patient sessions to specialized clinical faculty.</p>
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
                <h3 className="text-base font-black text-emerald-900">Session Scheduled Successfully!</h3>
                <p className="text-sm text-emerald-700 font-medium mt-0.5">Appointment allocated. Redirecting to schedule ledger...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* SECTION 1: Participants */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="text-indigo-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Session Participants</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Select Patient"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  icon={<User size={18} />}
                  options={patients.length > 0 
                    ? patients.map(p => ({ value: String(p.PATIENT_ID), label: `${p.NAME} (ID: #${p.PATIENT_ID})` }))
                    : [{ value: '', label: 'Loading patients...' }]}
                  placeholder="-- Choose Patient --"
                />

                <SelectField 
                  label="Assigned Practitioner"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  icon={<Stethoscope size={18} />}
                  options={doctors.length > 0 
                    ? doctors.map(d => ({ value: String(d.ID), label: `Dr. ${d.NAME}` }))
                    : [{ value: '', label: 'Loading practitioners...' }]}
                  placeholder="-- Choose Specialist --"
                />
              </div>
            </div>

            {/* SECTION 2: Logistics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="text-indigo-500" size={20} />
                <h3 className="text-lg font-black text-slate-900">Schedule Logistics</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Appointment Date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  icon={<CalendarDays size={18} />}
                  type="date"
                />

                <SelectField 
                  label="Initial Operational Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  icon={<ClipboardCheck size={18} />}
                  options={[
                    { value: 'PENDING', label: 'PENDING (Awaiting Check-in)' },
                    { value: 'COMPLETED', label: 'COMPLETED (Session Finished)' },
                    { value: 'CANCELLED', label: 'CANCELLED (Voided)' },
                  ]}
                  placeholder=""
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/appointments')}
                disabled={loading || success}
                className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all duration-200 disabled:opacity-70 shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
              >
                {success ? (
                  <>Redirecting...</>
                ) : loading ? (
                  <>Processing Schedule...</>
                ) : (
                  <>
                    <Save size={20} />
                    Save Scheduling Assignment
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
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white placeholder:text-slate-400 shadow-sm"
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, icon, options, placeholder }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <select
        name={name} value={value} onChange={onChange} required
        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white cursor-pointer shadow-sm appearance-none"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
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