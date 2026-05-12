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
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
  PHONE: string;
};

type Doctor = {
  DOCTOR_ID: number;
  NAME: string;
  SPECIALIZATION: string;
};

type WeeklyPatients = {
  month: string;
  patients: number;
};

type DashboardData = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;

  latestPatients: Patient[];
  latestDoctors: Doctor[];

  weeklyPatients: WeeklyPatients[];
};

const StatCard = ({
  title,
  value,
  icon,
  color,
  growth,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  growth: string;
}) => {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-3xl
        bg-white
        border border-slate-200
        p-6
        shadow-sm
        hover:shadow-lg
        transition-all duration-300
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {value}
          </h2>

          <div className="flex items-center gap-1 mt-4 text-emerald-600 text-sm font-medium">
            <ArrowUpRight size={16} />
            {growth}
          </div>
        </div>

        <div
          className={`
            h-16 w-16 rounded-2xl
            flex items-center justify-center
            ${color}
          `}
        >
          {icon}
        </div>
      </div>

      <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-slate-100 rounded-full opacity-40"></div>
    </div>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,

    latestPatients: [],
    latestDoctors: [],

    weeklyPatients: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');

      const dashboardData = await res.json();

      setData({
        totalPatients:
          dashboardData.totalPatients || 0,

        totalDoctors:
          dashboardData.totalDoctors || 0,

        totalAppointments:
          dashboardData.totalAppointments || 0,

        totalRevenue:
          dashboardData.totalRevenue || 0,

        latestPatients:
          dashboardData.latestPatients || [],

        latestDoctors:
          dashboardData.latestDoctors || [],

        weeklyPatients:
          dashboardData.weeklyPatients || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-lg font-medium">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={data.totalPatients}
          growth="Updated live"
          color="bg-emerald-100 text-emerald-600"
          icon={<Users size={30} />}
        />

        <StatCard
          title="Doctors"
          value={data.totalDoctors}
          growth="Hospital staff"
          color="bg-cyan-100 text-cyan-600"
          icon={<Stethoscope size={30} />}
        />

        <StatCard
          title="Appointments"
          value={data.totalAppointments}
          growth="Scheduled records"
          color="bg-indigo-100 text-indigo-600"
          icon={<CalendarDays size={30} />}
        />

        <StatCard
          title="Revenue"
          value={`Rs. ${data.totalRevenue}`}
          growth="Billing total"
          color="bg-orange-100 text-orange-600"
          icon={<Wallet size={30} />}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="xl:col-span-2 space-y-8">
          {/* CHART */}
          <div
            className="
              bg-white
              rounded-3xl
              border border-slate-200
              p-8
              shadow-sm
            "
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Patient Analytics
                </h2>

                <p className="text-slate-500 mt-1">
                  Weekly patient registrations
                </p>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <Activity size={18} />
                Live Report
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={data.weeklyPatients}>
                <defs>
                  <linearGradient
                    id="colorPatients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#10B981"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="95%"
                      stopColor="#10B981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis dataKey="month" />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* RECENT PATIENTS */}
          <div
            className="
              bg-white
              rounded-3xl
              border border-slate-200
              p-8
              shadow-sm
            "
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Recent Patients
                </h2>

                <p className="text-slate-500 mt-1">
                  Latest hospital registrations
                </p>
              </div>

              <Link
                href="/patients"
                className="text-emerald-600 font-semibold hover:text-emerald-700"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-5">
              {data.latestPatients.length > 0 ? (
                data.latestPatients.map((patient) => (
                  <div
                    key={patient.PATIENT_ID}
                    className="
                      flex items-center justify-between
                      p-5 rounded-2xl
                      border border-slate-100
                      hover:border-emerald-200
                      hover:bg-emerald-50/40
                      transition-all
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          h-14 w-14 rounded-2xl
                          bg-emerald-100
                          flex items-center justify-center
                          text-emerald-700
                          font-bold text-lg
                        "
                      >
                        {patient.NAME?.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {patient.NAME}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {patient.PHONE}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      className="text-slate-400"
                      size={20}
                    />
                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  No recent patients
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">
          {/* DOCTORS */}
          <div
            className="
              bg-white
              rounded-3xl
              border border-slate-200
              p-8
              shadow-sm
            "
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Doctors
                </h2>

                <p className="text-slate-500 mt-1">
                  Available specialists
                </p>
              </div>

              <Link
                href="/doctors"
                className="text-cyan-600 font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-5">
              {data.latestDoctors.length > 0 ? (
                data.latestDoctors.map((doctor) => (
                  <div
                    key={doctor.DOCTOR_ID}
                    className="
                      flex items-center justify-between
                      p-4 rounded-2xl
                      border border-slate-100
                      hover:border-cyan-200
                      hover:bg-cyan-50/40
                      transition-all
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          h-14 w-14 rounded-2xl
                          bg-cyan-100
                          flex items-center justify-center
                          text-cyan-700
                          font-bold
                        "
                      >
                        {doctor.NAME?.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {doctor.NAME}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {doctor.SPECIALIZATION}
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        px-3 py-1
                        rounded-full
                        bg-cyan-100
                        text-cyan-700
                        text-xs font-semibold
                      "
                    >
                      Active
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  No doctors found
                </p>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div
            className="
              bg-white
              rounded-3xl
              border border-slate-200
              p-8
              shadow-sm
            "
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/patients/add"
                className="
                  p-5 rounded-2xl
                  bg-emerald-50
                  hover:bg-emerald-100
                  transition
                "
              >
                <Users className="text-emerald-600 mb-3" />

                <h3 className="font-semibold text-slate-900">
                  Add Patient
                </h3>
              </Link>

              <Link
                href="/appointments/add"
                className="
                  p-5 rounded-2xl
                  bg-indigo-50
                  hover:bg-indigo-100
                  transition
                "
              >
                <CalendarDays className="text-indigo-600 mb-3" />

                <h3 className="font-semibold text-slate-900">
                  Appointments
                </h3>
              </Link>

              <Link
                href="/billing"
                className="
                  p-5 rounded-2xl
                  bg-orange-50
                  hover:bg-orange-100
                  transition
                "
              >
                <Wallet className="text-orange-600 mb-3" />

                <h3 className="font-semibold text-slate-900">
                  Billing
                </h3>
              </Link>

              <Link
                href="/reports"
                className="
                  p-5 rounded-2xl
                  bg-cyan-50
                  hover:bg-cyan-100
                  transition
                "
              >
                <Activity className="text-cyan-600 mb-3" />

                <h3 className="font-semibold text-slate-900">
                  Reports
                </h3>
              </Link>
            </div>
          </div>

          {/* SYSTEM STATUS */}
          <div
            className="
              bg-white
              rounded-3xl
              border border-slate-200
              p-8
              shadow-sm
            "
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock3 className="text-emerald-600" />

              <h2 className="text-2xl font-bold text-slate-900">
                System Status
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">
                  Database
                </p>

                <span
                  className="
                    px-3 py-1 rounded-full
                    bg-emerald-100
                    text-emerald-700
                    text-sm font-semibold
                  "
                >
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-slate-600">
                  API Services
                </p>

                <span
                  className="
                    px-3 py-1 rounded-full
                    bg-emerald-100
                    text-emerald-700
                    text-sm font-semibold
                  "
                >
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-slate-600">
                  Server Status
                </p>

                <span
                  className="
                    px-3 py-1 rounded-full
                    bg-emerald-100
                    text-emerald-700
                    text-sm font-semibold
                  "
                >
                  Healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}