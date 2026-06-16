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
} from 'recharts';

type Patient = { PATIENT_ID: number; NAME: string; PHONE: string; };
type Doctor = { DOCTOR_ID: number; NAME: string; SPECIALIZATION: string; };
type MonthlyPatients = { month: string; patients: number; };
type DoctorWorkload = { doctor: string; appointments: number; };
type StockSegment = { name: string; value: number; };
type RevenueNode = { status: string; amount: number; };

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
};

const PIE_COLORS = ['#10B981', '#EF4444', '#6366F1'];

const StatCard = ({ title, value, icon, color, growth }: any) => (
  <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm text-slate-500 font-semibold">{title}</p>
        <h2 className="text-4xl font-bold text-slate-900 mt-3">{value}</h2>
        <div className="flex items-center gap-1 mt-4 text-emerald-600 text-sm font-medium">
          <ArrowUpRight size={16} /> {growth}
        </div>
      </div>
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-slate-50 rounded-full opacity-60"></div>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalPatients: 0, totalDoctors: 0, totalAppointments: 0, totalRevenue: 0,
    latestPatients: [], latestDoctors: [], monthlyPatients: [],
    doctorWorkload: [], stockData: [], revenueStatus: []
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
        <div className="text-slate-600 text-lg font-medium animate-pulse">Synchronizing Live Oracle Ledger Metrics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* SUMMARY INSIGHTS METRICS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Patients" value={data.totalPatients} growth="Updated live" color="bg-emerald-100 text-emerald-600" icon={<Users size={30} />} />
        <StatCard title="Doctors" value={data.totalDoctors} growth="Hospital staff" color="bg-cyan-100 text-cyan-600" icon={<Stethoscope size={30} />} />
        <StatCard title="Appointments" value={data.totalAppointments} growth="Active channels" color="bg-indigo-100 text-indigo-600" icon={<CalendarDays size={30} />} />
        <StatCard title="Revenue Collected" value={`Rs. ${data.totalRevenue.toLocaleString()}`} growth="Billing balance" color="bg-orange-100 text-orange-600" icon={<Wallet size={30} />} />
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* PATIENT REGISTRATIONS AREA TIMELINE */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
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
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Area type="monotone" dataKey="patients" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* INVENTORY CRITICAL LEVEL PIECHART */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="text-cyan-600" size={20} />
            <h3 className="text-xl font-bold text-slate-900">Inventory Allocation</h3>
          </div>
          <p className="text-slate-500 text-sm mb-4">Stock status distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.stockData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* SECOND ANALYTICS AND DATA BATCH CONTAINER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* DOCTOR ALLOCATION AND PERFORMANCE ANALYSIS */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-indigo-600" size={22} />
            <h3 className="text-xl font-bold text-slate-900">Clinical Load Factor</h3>
          </div>
          <p className="text-slate-500 text-sm mb-6">Appointments allocated per medical official</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.doctorWorkload}>
              <XAxis dataKey="doctor" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="appointments" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* REVENUE STATUS STRUCTURE ANALYSIS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="text-orange-500" size={22} />
            <h3 className="text-xl font-bold text-slate-900">Financial Liquidity</h3>
          </div>
          <p className="text-slate-500 text-sm mb-6">Total volume categorized by processing state</p>
          <div className="space-y-4">
            {data.revenueStatus.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">No outstanding transactions found.</p>
            ) : (
              data.revenueStatus.map((item, index) => (
                <div key={index} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status Accounts</span>
                    <h4 className="font-semibold text-slate-800 text-md mt-0.5">{item.status}</h4>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-lg">Rs. {item.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS LINKS CONTAINER FLOATS AT BOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Registration Options</h2>
          <div className="grid grid-cols-2 gap-4">
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