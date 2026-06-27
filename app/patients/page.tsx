'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Phone,
  MapPin,
  CalendarDays,
  Eye,
  UserRound,
  Search,
  Plus,
  Activity
} from 'lucide-react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
  DOB: string;
  GENDER: string;
  PHONE: string;
  ADDRESS: string;
};

type GenderStat = {
  GENDER: string;
  TOTAL: number;
};

type ActivePatient = {
  NAME: string;
};

// Helper for dynamic avatar colors
const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-cyan-500', 'bg-blue-500', 
  'bg-violet-500', 'bg-rose-500', 'bg-amber-500'
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [genderStats, setGenderStats] = useState<GenderStat[]>([]);
  const [activePatients, setActivePatients] = useState<ActivePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // LOAD PATIENTS
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();

      setPatients(data.patients || []);
      setGenderStats(data.genderStats || []);
      setActivePatients(data.activePatients || []);
    } catch (error) {
      console.error(error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // FILTER
  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.NAME?.toLowerCase().includes(search.toLowerCase()) ||
        patient.PHONE?.includes(search) ||
        patient.ADDRESS?.toLowerCase().includes(search.toLowerCase())
    );
  }, [patients, search]);

  // GET GENDER COUNT directly from the loaded patients array
  const getGenderTotal = (gender: string) => {
    return patients.filter(
      (p) => p.GENDER?.toLowerCase() === gender.toLowerCase()
    ).length;
  };

  // Get a deterministic color for the avatar based on the name
  const getAvatarColor = (name: string) => {
    if (!name) return AVATAR_COLORS[0];
    const charCode = name.charCodeAt(0);
    return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Loading Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* TOTAL */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Patients</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{patients.length}</h2>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
              <Activity size={14} /> Active Registry
            </p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={28} />
          </div>
        </div>

        {/* MALE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Male</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{getGenderTotal('male')}</h2>
            <p className="text-xs font-bold text-slate-500 mt-2">Registered profiles</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <UserRound size={28} />
          </div>
        </div>

        {/* FEMALE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Female</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{getGenderTotal('female')}</h2>
            <p className="text-xs font-bold text-slate-500 mt-2">Registered profiles</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <UserRound size={28} />
          </div>
        </div>
      </div>

      {/* QUICK ACCESS: ACTIVE PATIENTS */}
      {activePatients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Currently Scheduled</h2>
          <div className="flex flex-wrap gap-2">
            {activePatients.map((patient, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 cursor-default hover:border-emerald-300 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-bold text-slate-700">{patient.NAME}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* TABLE CONTROLS & SEARCH */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10 relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">All Records</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredPatients.length} Results Found</p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full sm:w-72">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search name, phone, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Patient Profile</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">DOB</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Gender</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Location</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.PATIENT_ID}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* PATIENT */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-sm ${getAvatarColor(patient.NAME)}`}>
                          {patient.NAME?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {patient.NAME}
                          </h3>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                            ID #{patient.PATIENT_ID}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DOB */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <CalendarDays size={16} className="text-slate-400" />
                        {patient.DOB?.split('T')[0] || 'N/A'}
                      </div>
                    </td>

                    {/* GENDER */}
                    <td className="p-5">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                          patient.GENDER?.toLowerCase() === 'male'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-100'
                            : patient.GENDER?.toLowerCase() === 'female'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {patient.GENDER || 'Unspecified'}
                      </span>
                    </td>

                    {/* PHONE */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Phone size={16} className="text-slate-400" />
                        {patient.PHONE || 'N/A'}
                      </div>
                    </td>

                    {/* ADDRESS */}
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 max-w-[200px]">
                        <MapPin size={16} className="text-slate-400 shrink-0" />
                        <span className="truncate">{patient.ADDRESS || 'N/A'}</span>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="p-5 text-right">
                      <Link
                        href={`/patients/${patient.PATIENT_ID}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-sm font-bold shadow-sm active:scale-95 transition-all"
                      >
                        <Eye size={16} />
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Search className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">No Patients Found</h3>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Try adjusting your search or register a new patient.</p>
                    {search && (
                      <button 
                        onClick={() => setSearch('')}
                        className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}