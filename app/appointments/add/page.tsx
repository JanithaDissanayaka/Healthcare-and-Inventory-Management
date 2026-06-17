'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, User, Stethoscope, ClipboardCheck, Save } from 'lucide-react';

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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    status: 'PENDING', // Standard default status matching dental rotations
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  // FETCH PATIENTS
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

  // FETCH DOCTORS
  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        // FIXED: Safely unpacks the array hidden inside data.doctorsList to prevent map crashes
        setDoctors(Array.isArray(data.doctorsList) ? data.doctorsList : []);
      }
    } catch (error) {
      console.error("Staff list processing failed:", error);
      setDoctors([]);
    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  // SUBMIT FORM DATA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.date) {
      alert("Please ensure all clinical fields are assigned before saving.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        router.push('/appointments'); // Head back immediately to the appointments list board
      } else {
        alert(data.error || "Execution rejected by Oracle DB");
      }
    } catch (error) {
      console.error(error);
      alert('Error creating appointment allocation record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-5xl mx-auto overflow-hidden">
        
        {/* TOP BANNER HEADER */}
        <div className="bg-white border-b border-slate-200 px-8 py-7 relative">
          <div className="absolute right-10 top-6 h-24 w-24 rounded-full bg-cyan-50"></div>
          <div className="absolute right-24 top-14 h-14 w-14 rounded-full bg-emerald-50"></div>
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <CalendarDays className="text-cyan-600" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Appointment Scheduling</h2>
              <p className="text-slate-500 mt-2 text-base">Allocate active patient sessions to specialized dental practitioners.</p>
            </div>
          </div>
        </div>

        {/* INPUT FORM CONTENT SHEET */}
        <div className="p-6 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SELECT PATIENT REGISTRY */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Patient</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                    <User size={18} />
                  </div>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                      <option key={p.PATIENT_ID} value={p.PATIENT_ID}>
                        {p.NAME} (ID: #{p.PATIENT_ID})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SELECT ASSIGNED PRACTITIONER */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Assigned Practitioner</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                    <Stethoscope size={18} />
                  </div>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
                  >
                    <option value="">-- Choose Specialist --</option>
                    {/* FIXED: Adjusted properties to match target d.ID and d.NAME aliases */}
                    {doctors.map(d => (
                      <option key={d.ID} value={d.ID}>
                        {d.NAME}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* INPUT DATE CONTROL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Appointment Date</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <CalendarDays size={18} />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900"
                  />
                </div>
              </div>

              {/* SELECT OPERATIONAL STATUS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Primary Operational Status</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                    <ClipboardCheck size={18} />
                  </div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 outline-none appearance-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

            </div>

            {/* BUTTON TRIGGERS */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-70 shadow-lg shadow-cyan-500/10"
              >
                <Save size={20} />
                {loading ? 'Processing Schedule...' : 'Save Scheduling Assignment'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/appointments')}
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