'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Stethoscope,
  Phone,
  Mail,
  Save,
  BriefcaseMedical,
  DollarSign,
} from 'lucide-react';

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

      const data = await res.json();
      alert(data.message);
      
      if (res.ok) {
        router.push('/doctors'); // Route straight back to grid panel view on success
      }
    } catch (error) {
      console.error(error);
      alert('Error registering practitioner profile');
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
          <div className="absolute right-24 top-14 h-14 w-14 rounded-full bg-emerald-50"></div>
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <BriefcaseMedical className="text-cyan-600" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Specialist Registration</h2>
              <p className="text-slate-500 mt-2 text-base">Register and onboard specialized dental surgeons into the CarePulse system.</p>
            </div>
          </div>
        </div>

        {/* INPUT FORM CONTENT SHEET */}
        <div className="p-6 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SPECIALIST FULL NAME */}
              <InputField
                label="Practitioner Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={<User size={18} />}
                placeholder="Dr. John Doe"
              />

              {/* SPECIFIC DENTAL BRANCH SELECT DROP PANEL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Dental Specialization</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                    <Stethoscope size={18} />
                  </div>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none appearance-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">-- Select Dental Track --</option>
                    <option value="General Dentistry">General Dentistry (OPD Diagnostics)</option>
                    <option value="Orthodontics">Orthodontics (Braces & Aligners)</option>
                    <option value="Endodontics">Endodontics (Root Canal Specialist)</option>
                    <option value="Periodontics">Periodontics (Gum Disease Specialist)</option>
                    <option value="Prosthodontics">Prosthodontics (Dentures & Implants)</option>
                    <option value="Oral & Maxillofacial Surgery">Oral & Maxillofacial Surgery</option>
                    <option value="Pedodontics">Pedodontics (Pediatric Dental Specialist)</option>
                  </select>
                </div>
              </div>

              {/* PHONE CONNECTION */}
              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<Phone size={18} />}
                placeholder="+94 77 123 4567"
              />

              {/* EMAIL */}
              <InputField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail size={18} />}
                placeholder="doctor@carepulse.lk"
                type="email"
              />

              {/* COMPENSATION BASE PAY */}
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

            {/* CONTROL REDIRECT TRIGGERS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-70"
              >
                <Save size={20} />
                {loading ? 'Processing Profiles...' : 'Register Practitioner Profile'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/doctors')}
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

// --- Reusable Input Base Shell ---
const InputField = ({ label, name, value, onChange, icon, placeholder, type = 'text' }: any) => (
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
        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none transition focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
    </div>
  </div>
);