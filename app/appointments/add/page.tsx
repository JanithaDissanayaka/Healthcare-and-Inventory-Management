'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, User, Stethoscope, ClipboardCheck, Save } from 'lucide-react';

type Patient = { PATIENT_ID: number; NAME: string; };
type Doctor = { ID: number; NAME: string; };

export default function NewAppointmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsError, setDoctorsError] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    status: 'PENDING', // Sensible database preset default
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error("Patient list processing failed:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      // /api/doctors returns a bare array on success, but an error object
      // like { error: "Database error" } if the DB connection fails.
      // Guard against that shape so the dropdown never crashes.
      if (Array.isArray(data)) {
        setDoctors(data);
        setDoctorsError(false);
      } else {
        console.error("Doctor list fetch returned a non-array response:", data);
        setDoctors([]);
        setDoctorsError(true);
      }
    } catch (error) {
      console.error("Staff list processing failed:", error);
      setDoctors([]);
      setDoctorsError(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        router.push('/appointments'); // Redirect instantly to the list board
      } else {
        alert(data.error);
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
        
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 px-8 py-7 relative">
          <div className="absolute right-10 top-6 h-24 w-24 rounded-full bg-emerald-50"></div>
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CalendarDays className="text-emerald-600" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Appointment Scheduling</h2>
              <p className="text-slate-500 mt-2 text-base">Allocate active patient allocations to specialized medical practitioners.</p>
            </div>
          </div>
        </div>

        {/* INPUT FORM CONTENT SHEET */}
        <div className="p-6 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SELECT FIELD: PATIENTS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Patient</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><User size={18} /></div>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                      <option key={p.PATIENT_ID} value={p.PATIENT_ID}>{p.NAME} (ID: #{p.PATIENT_ID})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SELECT FIELD: DOCTORS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Assigned Practitioner</label>
                {doctorsError && (
                  <p className="text-sm text-rose-600 mb-2">
                    Couldn&apos;t load the doctor list. Check your database connection and refresh this page.
                  </p>
                )}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><Stethoscope size={18} /></div>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                    disabled={doctorsError}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">-- Choose Specialist --</option>
                    {doctors.map(d => (
                      <option key={d.ID} value={d.ID}>{d.NAME}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* INPUT DATE CONTROL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Appointment Date</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><CalendarDays size={18} /></div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              {/* SELECT FIELD: STATUS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Primary Operational Status</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"><ClipboardCheck size={18} /></div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-70"
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