'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Trash2,
  CheckCircle,
  XCircle,
  CalendarDays,
  Plus
} from 'lucide-react';
import StatusBadge from "@/app/components/StatusBadge";

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
    const confirmDelete = confirm('Are you sure you want to delete this appointment channel permanently?');
    if (!confirmDelete) return;

    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    } catch (error) {
      console.error("Failed deleting appointment:", error);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen">
      

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