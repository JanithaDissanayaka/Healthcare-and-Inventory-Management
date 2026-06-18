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
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
  DOB: string;
  GENDER: string;
  PHONE: string;
  ADDRESS: string;
};

type GenderStat  = { GENDER: string; TOTAL: number; };
type ActivePatient = { NAME: string; };
type RegistrationPoint = { month: string; patients: number; };
type AgeGroup = { group: string; total: number; };

const GENDER_COLORS = ['#6366F1', '#EC4899', '#14B8A6'];
const AGE_COLORS    = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function PatientsPage() {
  const [patients,          setPatients]          = useState<Patient[]>([]);
  const [genderStats,       setGenderStats]       = useState<GenderStat[]>([]);
  const [activePatients,    setActivePatients]    = useState<ActivePatient[]>([]);
  const [registrationTrend, setRegistrationTrend] = useState<RegistrationPoint[]>([]);
  const [ageGroups,         setAgeGroups]         = useState<AgeGroup[]>([]);
  const [loading,           setLoading]           = useState(true);
  const [search,            setSearch]            = useState('');

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const res  = await fetch('/api/patients');
      const data = await res.json();
      setPatients(data.patients || []);
      setGenderStats(data.genderStats || []);
      setActivePatients(data.activePatients || []);
      setRegistrationTrend(data.registrationTrend || []);
      setAgeGroups(data.ageGroups || []);
    } catch (error) {
      console.error(error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() =>
    patients.filter(p =>
      p.NAME?.toLowerCase().includes(search.toLowerCase()) ||
      p.PHONE?.includes(search) ||
      p.ADDRESS?.toLowerCase().includes(search.toLowerCase())
    ), [patients, search]);

  const getGenderTotal = (gender: string) =>
    genderStats.find(g => g.GENDER?.toLowerCase() === gender.toLowerCase())?.TOTAL || 0;

  // Shape gender data for Recharts
  const genderChartData = genderStats.map(g => ({
    name: g.GENDER,
    value: Number(g.TOTAL),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="h-14 w-14 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-6 text-slate-600 font-medium">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 space-y-8">

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Patients</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">{patients.length}</h2>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Users className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Male Patients</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">{getGenderTotal('male')}</h2>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
              <UserRound className="text-cyan-600" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Female Patients</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">{getGenderTotal('female')}</h2>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-pink-100 flex items-center justify-center">
              <UserRound className="text-pink-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 1 : Registration Trend + Gender Donut ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Registration Trend – Area */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-emerald-500" size={20} />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Patient Registrations Over Time</h3>
              <p className="text-slate-500 text-sm">Monthly new patient intake trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={registrationTrend}>
              <defs>
                <linearGradient id="gradReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="patients" stroke="#10B981" strokeWidth={3} fill="url(#gradReg)" dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 7 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution – Donut */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <PieIcon className="text-indigo-500" size={20} />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Gender Distribution</h3>
              <p className="text-slate-500 text-sm">Male / Female / Other split</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={genderChartData}
                cx="50%" cy="46%"
                innerRadius={60} outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {genderChartData.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 2 : Age Group Breakdown (full width) ── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-orange-500" size={20} />
          <div>
            <h3 className="text-xl font-bold text-slate-900">Age Group Breakdown</h3>
            <p className="text-slate-500 text-sm">Patient distribution across age demographics</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={ageGroups} barSize={52}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="group" stroke="#94A3B8" fontSize={13} />
            <YAxis stroke="#94A3B8" allowDecimals={false} />
            <Tooltip formatter={(v: any) => [v, 'Patients']} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              {ageGroups.map((_, i) => (
                <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── PATIENTS WITH APPOINTMENTS ── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Patients With Appointments</h2>
        <div className="flex flex-wrap gap-3">
          {activePatients.map((patient, i) => (
            <div key={i} className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 text-sm font-semibold">
              {patient.NAME}
            </div>
          ))}
        </div>
      </div>

      {/* ── PATIENT RECORDS TABLE ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Patient Records</h2>
            <p className="text-slate-500 mt-1">Complete healthcare patient list</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <Link
              href="/patients/add"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition"
            >
              <Plus size={16} /> Add Patient
            </Link>
            <span className="px-3 py-2 rounded-2xl bg-emerald-100 text-emerald-700 text-sm font-semibold whitespace-nowrap">
              {filteredPatients.length} Records
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50">
              <tr>
                {['Patient', 'DOB', 'Gender', 'Phone', 'Address', 'Action'].map(h => (
                  <th key={h} className="text-left p-5 text-sm font-semibold text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                <tr key={patient.PATIENT_ID} className="border-t border-slate-100 hover:bg-slate-50 transition-all">

                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
                        {patient.NAME?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{patient.NAME}</h3>
                        <p className="text-sm text-slate-500">ID #{patient.PATIENT_ID}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CalendarDays size={16} className="text-slate-400" />
                      {patient.DOB?.split('T')[0]}
                    </div>
                  </td>

                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      patient.GENDER?.toLowerCase() === 'male'
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {patient.GENDER}
                    </span>
                  </td>

                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone size={16} className="text-slate-400" />
                      {patient.PHONE}
                    </div>
                  </td>

                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-700 max-w-[250px]">
                      <MapPin size={16} className="text-slate-400 min-w-[16px]" />
                      <span className="truncate">{patient.ADDRESS}</span>
                    </div>
                  </td>

                  <td className="p-5">
                    <Link
                      href={`/patients/${patient.PATIENT_ID}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold transition"
                    >
                      <Eye size={16} /> View
                    </Link>
                  </td>

                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center p-16">
                    <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
                      <Users className="text-slate-400" size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No Patients Found</h3>
                    <p className="text-slate-500 mt-2">No patient records match your search.</p>
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