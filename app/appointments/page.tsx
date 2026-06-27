'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Trash2,
  CheckCircle,
  XCircle,
  CalendarDays,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  CalendarCheck,
  Stethoscope,
  User
} from 'lucide-react';

type Appointment = {
  APPOINTMENT_ID: number;
  PATIENT_NAME: string;
  DOCTOR_NAME: string;
  APPOINTMENT_DATE: string;
  STATUS: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
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
    const confirmDelete = confirm('CRITICAL: Are you sure you want to permanently delete this appointment record?');
    if (!confirmDelete) return;

    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch (error) {
      console.error("Failed deleting appointment:", error);
    }
  };

  // --- DATA PROCESSING & FILTERING ---
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      const matchesSearch = 
        app.PATIENT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
        app.DOCTOR_NAME?.toLowerCase().includes(search.toLowerCase()) ||
        app.APPOINTMENT_ID.toString().includes(search);
      
      const matchesStatus = statusFilter === 'All' || app.STATUS?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  // Metrics Calculations
  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter(a => a.STATUS?.toUpperCase() === 'PENDING').length,
      completed: appointments.filter(a => a.STATUS?.toUpperCase() === 'COMPLETED').length,
    };
  }, [appointments]);

  // Dynamic Avatar Generator
  const getAvatarLetter = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Loading Schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">

      {/* ANALYTICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Bookings</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.total}</h2>
            <p className="text-xs font-bold text-slate-500 mt-2">All Time Records</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center"><CalendarDays size={28} /></div>
        </div>

        {/* Pending / Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Queue</p>
            <h2 className="text-3xl font-black text-amber-600 mt-1">{stats.pending}</h2>
            <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-2"><Clock size={14} /> Pending Sessions</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><CalendarCheck size={28} /></div>
        </div>

        {/* Completed Operations */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between transition-shadow hover:shadow-md">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Completed</p>
            <h2 className="text-3xl font-black text-emerald-600 mt-1">{stats.completed}</h2>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2"><CheckCircle2 size={14} /> Successful Visits</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle size={28} /></div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-4 lg:p-6 shadow-sm mb-8 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient Name, Doctor, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white outline-none text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 pr-2 shrink-0">Filter Status:</span>
          {['All', 'Pending', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                statusFilter === status 
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header Row */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10 relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <CalendarDays size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Schedule Ledger</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredAppointments.length} Appointments Found</p>
            </div>
          </div>
        </div>

        {/* The Table */}
        {filteredAppointments.length === 0 ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Appointments Match</h3>
            <p className="text-slate-500 mt-1 text-sm font-medium">Try adjusting your filters or book a new session.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-24">ID</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Patient</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Practitioner</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAppointments.map((app) => {
                  const isPending = app.STATUS?.toUpperCase() === 'PENDING';
                  const isCompleted = app.STATUS?.toUpperCase() === 'COMPLETED';
                  const isCancelled = app.STATUS?.toUpperCase() === 'CANCELLED';

                  return (
                    <tr key={app.APPOINTMENT_ID} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* ID */}
                      <td className="p-5 font-bold text-slate-400">
                        <span className="bg-slate-100 px-2 py-1 rounded-md text-xs">#{app.APPOINTMENT_ID}</span>
                      </td>

                      {/* PATIENT */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {getAvatarLetter(app.PATIENT_NAME)}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {app.PATIENT_NAME}
                          </span>
                        </div>
                      </td>

                      {/* DOCTOR */}
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-slate-600 font-semibold">
                          <Stethoscope size={14} className="text-cyan-600" />
                          Dr. {app.DOCTOR_NAME}
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="p-5 font-semibold text-slate-700">
                        {app.APPOINTMENT_DATE ? app.APPOINTMENT_DATE.split('T')[0] : 'N/A'}
                      </td>

                      {/* STATUS BADGE */}
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          isPending ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100' :
                          isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100' :
                          'bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100'
                        }`}>
                          {isPending && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                          {app.STATUS}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-5">
                        <div className="flex gap-2 justify-end">
                          
                          {/* Complete Action */}
                          <button
                            onClick={() => updateStatus(app.APPOINTMENT_ID, 'COMPLETED')}
                            title="Mark as Completed"
                            disabled={isCompleted}
                            className={`p-2 rounded-xl border transition-all ${
                              isCompleted 
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                                : 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm active:scale-95'
                            }`}
                          >
                            <CheckCircle size={18} />
                          </button>

                          {/* Cancel Action */}
                          <button
                            onClick={() => updateStatus(app.APPOINTMENT_ID, 'CANCELLED')}
                            title="Cancel Appointment"
                            disabled={isCancelled || isCompleted}
                            className={`p-2 rounded-xl border transition-all ${
                              (isCancelled || isCompleted)
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed' 
                                : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300 shadow-sm active:scale-95'
                            }`}
                          >
                            <XCircle size={18} />
                          </button>

                          {/* Delete/Purge Action */}
                          <button
                            onClick={() => deleteAppointment(app.APPOINTMENT_ID)}
                            title="Purge Record Permanently"
                            className="p-2 rounded-xl bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 shadow-sm transition-all active:scale-95 ml-2"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}