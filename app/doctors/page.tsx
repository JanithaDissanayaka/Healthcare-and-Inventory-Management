'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Phone,
  Award,
  Users,
  Trash2,
  Plus,
  Search,
  Clock3,
  Mail,
  Stethoscope,
  ChevronRight,
  Building2,
  ShieldAlert
} from 'lucide-react';

type Doctor = {
  ID: number;
  NAME: string;
  SPECIALIZATION: string;
  PHONE: string;
  EMAIL: string;
  SALARY: number;
};

// Distinct gradients to give cards clinical variety
const DOC_GRADIENTS = [
  'from-cyan-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-blue-600 to-indigo-700',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activeOnDuty, setActiveOnDuty] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
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

  // 1. Extract unique departments dynamically for the filter bar
  const departments = useMemo(() => {
    const list = doctors.map(d => d.SPECIALIZATION).filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [doctors]);

  // 2. Multi-tier filter (Search query + Department Pill)
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch = 
        doc.NAME?.toLowerCase().includes(search.toLowerCase()) ||
        doc.SPECIALIZATION?.toLowerCase().includes(search.toLowerCase());
      
      const matchesDept = selectedDept === 'All' || doc.SPECIALIZATION === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [doctors, search, selectedDept]);

  // Assign a deterministic gradient based on doctor's ID
  const getBadgeStyle = (id: number) => DOC_GRADIENTS[(id || 0) % DOC_GRADIENTS.length];

  // Safe discharge handler
  const handleDischarge = async (id: number, name: string) => {
    const confirmed = confirm(`CRITICAL ACTION: Are you sure you want to revoke clinical privileges and discharge Dr. ${name}?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Discharge rejected by server');
      
      // Update UI instantly without a full page reload
      setDoctors(prev => prev.filter(d => d.ID !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to remove specialist from system registry.');
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Loading Clinical Staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">

      {/* ANALYTICS SUMMARY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Faculty Members</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{doctors.length}</h2>
            <p className="text-xs font-bold text-slate-500 mt-2">Active Contracts</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center"><Users size={28} /></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Departments</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{departments.length - 1}</h2>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2"><Award size={14} /> Certified Units</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Building2 size={28} /></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Shifts</p>
            <h2 className="text-3xl font-black text-blue-600 mt-1">{activeOnDuty} <span className="text-lg font-bold text-slate-400">/ {doctors.length}</span></h2>
            <p className="text-xs font-bold text-blue-600 mt-2">Staff Currently On-Duty</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse"><Clock3 size={28} /></div>
        </div>
      </div>

      {/* SEARCH & DEPARTMENT FILTER BAR */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-4 lg:p-6 shadow-sm mb-8 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search physicians by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-cyan-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Dynamic Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 pr-2 shrink-0">Filter Unit:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                selectedDept === dept 
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* DOCTORS GRID */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-200 text-center py-20 px-4 shadow-sm">
          <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={32} className="opacity-40" />
          </div>
          <h3 className="text-lg font-black text-slate-900">No Specialists Found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            {selectedDept !== 'All' 
              ? `We couldn't find anyone assigned to the "${selectedDept}" department matching "${search}".`
              : "No medical professionals matched your search parameters."}
          </p>
          {(search || selectedDept !== 'All') && (
            <button 
              onClick={() => { setSearch(''); setSelectedDept('All'); }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-cyan-50 text-cyan-700 font-bold text-xs hover:bg-cyan-100 transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.ID}
              className="group bg-white rounded-[2.5rem] border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-cyan-200/80 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute -right-16 -top-16 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none"></div>

              <div>
                {/* TOP ROW: Avatar + Names + Quiet Trash Icon */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br ${getBadgeStyle(doc.ID)} flex items-center justify-center text-white font-black text-xl shadow-md shrink-0`}>
                      {doc.NAME ? doc.NAME.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-cyan-700 transition-colors leading-tight">
                        Dr. {doc.NAME}
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-50 text-cyan-700 border border-cyan-100 mt-2.5">
                        <Stethoscope size={12} /> {doc.SPECIALIZATION || 'General Practice'}
                      </span>
                    </div>
                  </div>

                  {/* Safely tucked away discharge action */}
                  <button
                    onClick={() => handleDischarge(doc.ID, doc.NAME)}
                    title="Revoke Specialist Privileges"
                    className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* MIDDLE: Clinical Ledger Data */}
                <div className="mt-8 space-y-3 pt-6 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-3 text-slate-600 font-medium p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 shrink-0"><Phone size={14} /></div>
                    <span className="font-semibold text-slate-800">{doc.PHONE || 'No extension listed'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600 font-medium p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 shrink-0"><Mail size={14} /></div>
                    <span className="font-semibold text-slate-800 truncate">{doc.EMAIL || 'No secure inbox'}</span>
                  </div>

                  {/* Exposed Salary Row */}
                  {doc.SALARY !== undefined && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100/80 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Retainer</span>
                      <span className="font-mono font-bold text-slate-700">Rs. {Number(doc.SALARY).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM: Action CTA */}
              <div className="mt-8 pt-2">
                <Link
                  href={`/doctors/${doc.ID}`}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-100/70 group-hover:bg-slate-900 text-slate-700 group-hover:text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  View Faculty Profile <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}