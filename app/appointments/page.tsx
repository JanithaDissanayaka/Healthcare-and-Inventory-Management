'use client';

import React from 'react';
// Reuse the status badge you built!

const appointments = [
  { id: 1, time: "08:30 AM", patient: "Sarah Mitchell", doctor: "Dr. Patel", type: "Follow-up", dept: "Cardiology", status: "Confirmed" },
  { id: 2, time: "09:15 AM", patient: "James Horowitz", doctor: "Dr. Chen", type: "Consultation", dept: "General", status: "Pending" },
  { id: 3, time: "09:45 AM", patient: "Roberto Alvarez", doctor: "Unassigned", type: "Emergency", dept: "Orthopedics", status: "Urgent" },
  { id: 4, time: "10:00 AM", patient: "Priya Nair", doctor: "Dr. Wong", type: "Check-up", dept: "Pediatrics", status: "Confirmed" },
  { id: 5, time: "14:00 PM", patient: "Emma Clarke", doctor: "Dr. Singh", type: "Procedure", dept: "Dermatology", status: "Confirmed" },
];

export default function AppointmentsPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">


      {/* 1. Urgent Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 flex items-center gap-3 shadow-sm">
        <span className="text-xl">⚠️</span>
        <p className="text-sm font-medium">3 appointments require urgent attention — review and assign a doctor immediately.</p>
      </div>

      {/* 2. Appointments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["TIME", "PATIENT", "DOCTOR", "TYPE", "DEPT", "STATUS", "ACTIONS"].map((head) => (
                <th key={head} className="p-4 font-semibold text-slate-600">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((app) => (
              <tr 
                key={app.id} 
                className={`transition-colors ${app.status === 'Urgent' ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}
              >
                <td className="p-4 font-medium text-slate-900">{app.time}</td>
                <td className="p-4 font-semibold text-slate-900">{app.patient}</td>
                <td className={`p-4 ${app.doctor === 'Unassigned' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                  {app.doctor}
                </td>
                <td className="p-4 text-slate-600">{app.type}</td>
                <td className="p-4 text-slate-600">{app.dept}</td>
                <td className="p-4">

                </td>
                <td className="p-4">
                  {/* Conditional Action Link */}
                  {app.doctor === 'Unassigned' ? (
                    <button className="text-emerald-600 font-bold hover:underline">Assign →</button>
                  ) : (
                    <button className="text-slate-500 hover:text-emerald-600">Manage</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}