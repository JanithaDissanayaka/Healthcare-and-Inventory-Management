'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Stethoscope,
  CalendarDays,
  Wallet,
  Activity,
  ArrowUpRight,
  Clock3,
  BarChart3,
  PieChart as PieIcon,
  Layers,
  TrendingUp,
  UserCheck,
  HeartPulse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from 'recharts';

type Patient = { PATIENT_ID: number; NAME: string; PHONE: string; };
type Doctor = { DOCTOR_ID: number; NAME: string; SPECIALIZATION: string; };
type MonthlyPatients = { month: string; patients: number; };
type DoctorWorkload = { doctor: string; appointments: number; };
type StockSegment = { name: string; value: number; };
type RevenueNode = { status: string; amount: number; };
type AppointmentStatus = { status: string; total: number; };
type AppointmentTrend = { month: string; appointments: number; };
type GenderDist = { name: string; value: number; };
type TopBilled = { patient: string; total: number; };
type DoctorSpec = { specialization: string; total: number; };

type DashboardData = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  latestPatients: Patient[];
  latestDoctors: Doctor[];
  monthlyPatients: MonthlyPatients[];
  doctorWorkload: DoctorWorkload[];
  stockData: StockSegment[];
  revenueStatus: RevenueNode[];
  appointmentsByStatus: AppointmentStatus[];
  appointmentTrend: AppointmentTrend[];
  genderDistribution: GenderDist[];
  topBilledPatients: TopBilled[];
  doctorsBySpecialization: DoctorSpec[];
};

const PIE_COLORS   = ['#10B981', '#F59E0B', '#EF4444'];
const GENDER_COLORS = ['#6366F1', '#EC4899', '#14B8A6'];
const SPEC_COLORS  = ['#10B981', '#6366F1', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#8B5CF6'];
const STATUS_COLORS: Record<string, string> = {
  Scheduled: '#6366F1',
  Completed: '#10B981',
  Cancelled: '#EF4444',
};

const StatCard = ({ title, value, icon, color, growth }: any) => (
  <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm text-slate-500 font-semibold">{title}</p>
        <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 mt-3">{value}</h2>
        <div className="flex items-center gap-1 mt-4 text-emerald-600 text-sm font-medium">
          <ArrowUpRight size={16} /> {growth}
        </div>
      </div>
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-slate-50 rounded-full opacity-60"></div>
  </div>
);

const SectionTitle = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500 text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalPatients: 0, totalDoctors: 0, totalAppointments: 0, totalRevenue: 0,
    latestPatients: [], latestDoctors: [], monthlyPatients: [],
    doctorWorkload: [], stockData: [], revenueStatus: [],
    appointmentsByStatus: [], appointmentTrend: [],
    genderDistribution: [], topBilledPatients: [], doctorsBySpecialization: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const payload = await res.json();
          setData(payload);
        }
      } catch (err) {
        console.error("Dashboard synchronization breakdown:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-sm lg:text-lg font-medium animate-pulse text-center px-4">Synchronizing Live Oracle Ledger Metrics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 space-y-8">

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Patients"     value={data.totalPatients}                              growth="Updated live"    color="bg-emerald-100 text-emerald-600" icon={<Users size={30} />} />
        <StatCard title="Doctors"            value={data.totalDoctors}                               growth="Hospital staff"  color="bg-cyan-100 text-cyan-600"       icon={<Stethoscope size={30} />} />
        <StatCard title="Appointments"       value={data.totalAppointments}                          growth="Active channels" color="bg-indigo-100 text-indigo-600"   icon={<CalendarDays size={30} />} />
        <StatCard title="Revenue Collected"  value={`Rs. ${data.totalRevenue.toLocaleString()}`}     growth="Billing balance" color="bg-orange-100 text-orange-600"   icon={<Wallet size={30} />} />
      </div>

      {/* ── ROW 1 : Patient admissions + Inventory pie ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Patient Admissions – Area */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Patient Admissions</h2>
              <p className="text-slate-500 mt-1">Monthly registration lifecycle trends</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
              <Activity size={18} /> Live DB Pipeline
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.monthlyPatients}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Area type="monotone" dataKey="patients" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Allocation – Donut */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionTitle
            icon={<PieIcon className="text-cyan-600" size={20} />}
            title="Inventory Allocation"
            subtitle="Stock status distribution"
          />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.stockData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                {data.stockData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 2 : Appointment trend + Appointment status donut ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Appointment Trend – Line */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionTitle
            icon={<TrendingUp className="text-indigo-500" size={20} />}
            title="Appointment Trends"
            subtitle="Monthly appointment volume over time"
          />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.appointmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Line type="monotone" dataKey="appointments" stroke="#6366F1" strokeWidth={3} dot={{ r: 5, fill: '#6366F1' }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments by Status – Donut */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionTitle
            icon={<CalendarDays className="text-indigo-600" size={20} />}
            title="Appointment Status"
            subtitle="Breakdown by processing state"
          />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.appointmentsByStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="total" nameKey="status">
                {data.appointmentsByStatus.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.status] ?? '#CBD5E1'} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 3 : Doctor workload + Revenue bar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Doctor Workload – Bar */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionTitle
            icon={<BarChart3 className="text-indigo-600" size={22} />}
            title="Clinical Load Factor"
            subtitle="Appointments allocated per medical official"
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.doctorWorkload}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="doctor" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="appointments" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Status – Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionTitle
            icon={<Layers className="text-orange-500" size={22} />}
            title="Financial Liquidity"
            subtitle="Revenue by billing status"
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.revenueStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickFormatter={(v) => `Rs.${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="status" stroke="#94A3B8" fontSize={12} width={70} />
              <Tooltip formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={28}>
                {data.revenueStatus.map((entry, i) => {
                  const c = entry.status === 'Paid' ? '#10B981' : entry.status === 'Pending' ? '#F59E0B' : '#EF4444';
                  return <Cell key={i} fill={c} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 4 : Gender distribution + Doctors by Specialization ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Doctors by Specialization – Horizontal Bar */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionTitle
            icon={<Stethoscope className="text-cyan-600" size={20} />}
            title="Doctors by Specialization"
            subtitle="Distribution of medical expertise on staff"
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.doctorsBySpecialization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis type="category" dataKey="specialization" stroke="#94A3B8" fontSize={11} width={120} />
              <Tooltip />
              <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={22}>
                {data.doctorsBySpecialization.map((_, i) => (
                  <Cell key={i} fill={SPEC_COLORS[i % SPEC_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution – Donut */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <SectionTitle
            icon={<UserCheck className="text-pink-500" size={20} />}
            title="Patient Gender Split"
            subtitle="Demographic distribution"
          />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.genderDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" nameKey="name">
                {data.genderDistribution.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 5 : Top Billed Patients ── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <SectionTitle
          icon={<HeartPulse className="text-orange-500" size={20} />}
          title="Top Billed Patients"
          subtitle="Patients with the highest cumulative billing amount"
        />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.topBilledPatients}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="patient" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" tickFormatter={(v) => `Rs.${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, 'Total Billed']} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={48}>
              {data.topBilledPatients.map((_, i) => (
                <Cell key={i} fill={SPEC_COLORS[i % SPEC_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── QUICK ACTIONS + CLUSTER STATUS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Registration Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/patients/add" className="p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition block">
              <Users className="text-emerald-600 mb-3" />
              <h3 className="font-semibold text-slate-900">Register Patient</h3>
            </Link>
            <Link href="/appointments/add" className="p-5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition block">
              <CalendarDays className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-900">Schedule Slip</h3>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <Clock3 className="text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Cluster Status</h2>
          </div>
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <p className="text-slate-600 text-sm">Oracle Docker Container</p>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600 text-sm">Next.js API Engines</p>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">Active</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}