'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Award,
  Users,
  Trash2,
  Plus,
  Search,
  Clock3,
} from 'lucide-react';

type Doctor = {
  ID: number;
  NAME: string;
  SPECIALIZATION: string;
  PHONE: string;
  EMAIL: string;
  SALARY: number;
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activeOnDuty, setActiveOnDuty] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        // Sets data using the safe matching property shapes
        setDoctors(Array.isArray(data.doctorsList) ? data.doctorsList : []);
        setActiveOnDuty(data.activeOnDuty || 0);
      }
    } catch (error) {
      console.error("Error reading clinical registers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Safe checks for lowercase/uppercase fallback bindings
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.NAME?.toLowerCase().includes(search.toLowerCase()) ||
      doc.SPECIALIZATION?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      

      {/* SEARCH LAYOUT */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search specialists by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Fixed: Added standard functional parentheses execution call
          className="w-full lg:w-[400px] pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
        />
      </div>

      {/* ANALYTICS SUMMARY SHIPS HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* TOTAL DOCTORS */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold">Total Specialists</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">{doctors.length}</h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                <Users className="text-cyan-600" size={24} />
              </div>
            </div>
          </div>

          {/* DENTAL DEPARTMENTS */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold">Dental Departments</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {new Set(doctors.map((d) => d.SPECIALIZATION)).size}
                </h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Award className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          {/* ACTIVE ON-DUTY STAFF MODULE */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold">Active On-Duty Staff</p>
                <h2 className="text-3xl font-bold text-cyan-600 mt-2">
                  {activeOnDuty} / {doctors.length} Shifts Active
                </h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-cyan-100/70 flex items-center justify-center animate-pulse">
                <Clock3 className="text-cyan-600" size={24} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DOCTORS CARDS DISPLAY GRID */}
      {loading ? (
        <div className="text-slate-500 text-center py-12 font-medium animate-pulse">Syncing clinical registries...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-slate-400 text-center py-12 font-medium">No dental practitioners match the search query.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.ID}
              className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative"
            >
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-50/60 group-hover:scale-110 transition-transform duration-300"></div>

              {/* PROFILE IDENTITY BLOCK */}
              <div className="relative flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-500/10">
                  {doc.NAME ? doc.NAME.charAt(0).toUpperCase() : 'D'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{doc.NAME}</h2>
                  <p className="text-cyan-600 font-semibold mt-0.5 text-sm">{doc.SPECIALIZATION}</p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-6 space-y-3 relative">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50">
                  <div className="h-9 w-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600"><Phone size={16} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Contact Connection</p>
                    <p className="font-semibold text-slate-800 text-sm mt-0.5">{doc.PHONE}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-bold">@</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                    <p className="font-semibold text-slate-800 text-sm mt-0.5 truncate">{doc.EMAIL}</p>
                  </div>
                </div>
              </div>

              {/* PURGE DISCHARGE TRIGGER BUTTON */}
              <div className="mt-6 relative z-10">
                <button
                  onClick={async () => {
                    const confirmDelete = confirm('Discharge practitioner and remove permanently from active clinical rotations?');
                    if (!confirmDelete) return;

                    try {
                      const res = await fetch(`/api/doctors/${doc.ID}`, { method: 'DELETE' });
                      if (!res.ok) throw new Error('Delete operation rejected');
                      fetchDoctors();
                    } catch (error) {
                      console.error(error);
                      alert('Failed to remove physician from system');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition"
                >
                  <Trash2 size={16} />
                  Remove Specialist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}