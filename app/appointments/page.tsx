'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  CheckCircle,
  XCircle,
  CalendarDays,
  Plus,
  PieChart as PieIcon,
  Activity,
  Stethoscope,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import StatusBadge from "@/app/components/StatusBadge";

type Appointment = {
  APPOINTMENT_ID: number;
  PATIENT_NAME: string;
  DOCTOR_NAME: string;
  APPOINTMENT_DATE: string;
  STATUS: string;
};

type StatusBreakdownRow = { STATUS_KEY: string; TOTAL: number };
type DailyTrendRow = { DAY_KEY: string; DAY_LABEL: string; TOTAL: number };
type DoctorAnalyticsRow = { DOCTOR_NAME: string; TOTAL_APPOINTMENTS: number };

// Mirrors the palette used in StatusBadge so the donut segments read
// consistently with the status pills shown in the table below.
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  COMPLETED: '#10B981',
  CANCELLED: '#F43F5E',
};
const FALLBACK_STATUS_COLOR = '#94A3B8';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdownRow[]>([]);
  const [dailyTrend, setDailyTrend] = useState<DailyTrendRow[]>([]);
  const [doctorAnalytics, setDoctorAnalytics] = useState<DoctorAnalyticsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
      setStatusBreakdown(data.statusBreakdown || []);
      setDailyTrend(data.dailyTrend || []);
      setDoctorAnalytics(data.analytics || []);
    } catch (error) {
      console.error("Failed fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
    } catch (error) {
      console.error("Failed updating appointment status:", error);
    }
  };

  const deleteAppointment = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this appointment channel permanently?');
    if (!confirmDelete) return;

    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch (error) {
      console.error("Failed deleting appointment:", error);
    }
  };

  // Donut chart: appointments grouped by current status
  const statusChartData = useMemo(() => {
    return statusBreakdown
      .filter((row) => Number(row.TOTAL) > 0)
      .map((row) => ({
        name: row.STATUS_KEY,
        value: Number(row.TOTAL),
      }));
  }, [statusBreakdown]);

  const totalStatusCount = useMemo(
    () => statusChartData.reduce((sum, row) => sum + row.value, 0),
    [statusChartData]
  );

  // Area chart: appointments booked per day over the last 14 days
  const dailyChartData = useMemo(() => {
    return dailyTrend.map((row) => ({
      day: row.DAY_LABEL,
      appointments: Number(row.TOTAL),
    }));
  }, [dailyTrend]);

  // Horizontal bar chart: appointment volume per doctor, busiest first
  const doctorChartData = useMemo(() => {
    return doctorAnalytics
      .map((row) => ({
        doctor: row.DOCTOR_NAME,
        appointments: Number(row.TOTAL_APPOINTMENTS),
      }))
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 8);
  }, [doctorAnalytics]);

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-500 mt-1">Review sessions, change booking statuses, or drop patient allocations.</p>
        </div>
        <Link
          href="/appointments/add"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-semibold transition"
        >
          <Plus size={18} />
          New Appointment
        </Link>
      </div>

      {/* ANALYTICS CHARTS GRID */}
      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

          {/* APPOINTMENTS BY STATUS — DONUT CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="text-emerald-600" size={20} />
              <h3 className="text-xl font-bold text-slate-900">Status Distribution</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Scheduled, completed, and cancelled split</p>
            {statusChartData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-16">No status data available yet.</p>
            ) : (
              <div className="relative">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell
                          key={`status-cell-${index}`}
                          fill={STATUS_COLORS[entry.name?.toUpperCase()] || FALLBACK_STATUS_COLOR}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-x-0 top-[78px] text-center pointer-events-none">
                  <p className="text-2xl font-bold text-slate-900">{totalStatusCount}</p>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Total</p>
                </div>
              </div>
            )}
          </div>

          {/* APPOINTMENTS PER DAY — AREA CHART */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-indigo-600" size={20} />
                <h3 className="text-xl font-bold text-slate-900">Booking Volume</h3>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">Appointments scheduled per day, last 14 days</p>
            {dailyChartData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-16">No recent booking activity to chart.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={dailyChartData}>
                  <defs>
                    <linearGradient id="colorDailyAppointments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="#6366F1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDailyAppointments)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* APPOINTMENTS BY DOCTOR — HORIZONTAL BAR CHART */}
          <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="text-cyan-600" size={20} />
              <h3 className="text-xl font-bold text-slate-900">Practitioner Load</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Total appointments handled per doctor</p>
            {doctorChartData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-16">No doctor allocation data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(220, doctorChartData.length * 48)}>
                <BarChart
                  data={doctorChartData}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="doctor"
                    stroke="#94A3B8"
                    fontSize={12}
                    width={140}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#06B6D4" radius={[0, 8, 8, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      )}

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse font-medium">
            Fetching active scheduling allocations...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <CalendarDays size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-5">ID</th>
                  <th className="p-5">Patient Name</th>
                  <th className="p-5">Assigned Practitioner</th>
                  <th className="p-5">Schedule Date</th>
                  <th className="p-5">Live State</th>
                  <th className="p-5 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {appointments.map((app) => (
                  <tr key={app.APPOINTMENT_ID} className="hover:bg-slate-50/60 transition">
                    <td className="p-5 font-bold text-slate-400">#{app.APPOINTMENT_ID}</td>
                    <td className="p-5 font-semibold text-slate-900">{app.PATIENT_NAME}</td>
                    <td className="p-5 font-medium">{app.DOCTOR_NAME}</td>
                    <td className="p-5 text-slate-600">
                      {app.APPOINTMENT_DATE ? app.APPOINTMENT_DATE.split('T')[0] : 'N/A'}
                    </td>
                    <td className="p-5">
                      <StatusBadge status={app.STATUS} />
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2 justify-end print:hidden">
                        
                        {/* MARK COMPLETED BUTTON */}
                        <button
                          onClick={() => updateStatus(app.APPOINTMENT_ID, 'COMPLETED')}
                          title="Mark Completed"
                          disabled={app.STATUS === 'COMPLETED'}
                          className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition disabled:opacity-40"
                        >
                          <CheckCircle size={16} />
                        </button>

                        {/* CANCEL BOOKING BUTTON */}
                        <button
                          onClick={() => updateStatus(app.APPOINTMENT_ID, 'CANCELLED')}
                          title="Cancel Session"
                          disabled={app.STATUS === 'CANCELLED'}
                          className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100 transition disabled:opacity-40"
                        >
                          <XCircle size={16} />
                        </button>

                        {/* PURGE BUTTON */}
                        <button
                          onClick={() => deleteAppointment(app.APPOINTMENT_ID)}
                          title="Purge Allocation"
                          className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}