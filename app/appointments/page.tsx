'use client';

import { useEffect, useState } from 'react';

type Appointment = {
  APPOINTMENT_ID: number;
  PATIENT_NAME: string;
  DOCTOR_NAME: string;
  CLINIC_ID: number;
  APPOINTMENT_DATE: string;
  APPOINTMENT_TIME: string;
  STATUS: string;
};

export default function AppointmentsPage() {

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {

    try {

      const res = await fetch(
        '/api/appointments'
      );

      const data = await res.json();

      setAppointments(data);

    } catch (error) {

      console.error(error);

    }
  };

  // STATUS COLORS
  const getStatusStyle = (
    status: string
  ) => {

    switch (status) {

      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';

      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';

      case 'Cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Appointments
        </h1>

        <p className="text-slate-500 mt-1">
          Manage patient appointments
        </p>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

          <p className="text-slate-500 text-sm">
            Total Appointments
          </p>

          <h2 className="text-4xl font-bold mt-2 text-slate-900">
            {appointments.length}
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

          <p className="text-slate-500 text-sm">
            Scheduled
          </p>

          <h2 className="text-4xl font-bold mt-2 text-blue-600">
            {
              appointments.filter(
                (a) => a.STATUS === 'Scheduled'
              ).length
            }
          </h2>

        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">

          <p className="text-slate-500 text-sm">
            Completed
          </p>

          <h2 className="text-4xl font-bold mt-2 text-emerald-600">
            {
              appointments.filter(
                (a) => a.STATUS === 'Completed'
              ).length
            }
          </h2>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4 font-semibold text-slate-600">
                ID
              </th>

              <th className="text-left p-4 font-semibold text-slate-600">
                Patient
              </th>

              <th className="text-left p-4 font-semibold text-slate-600">
                Doctor
              </th>

              <th className="text-left p-4 font-semibold text-slate-600">
                Clinic
              </th>

              <th className="text-left p-4 font-semibold text-slate-600">
                Date
              </th>

              <th className="text-left p-4 font-semibold text-slate-600">
                Time
              </th>

              <th className="text-left p-4 font-semibold text-slate-600">
                Status
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {appointments.map((app) => (

              <tr
                key={app.APPOINTMENT_ID}
                className="hover:bg-slate-50 transition-colors"
              >

                <td className="p-4 font-semibold text-slate-900">
                  #{app.APPOINTMENT_ID}
                </td>

                <td className="p-4">

                  <div className="font-semibold text-slate-900">
                    {app.PATIENT_NAME}
                  </div>

                </td>

                <td className="p-4 text-slate-700">
                  {app.DOCTOR_NAME}
                </td>

                <td className="p-4 text-slate-700">
                  {app.CLINIC_ID}
                </td>

                <td className="p-4 text-slate-700">
                  {app.APPOINTMENT_DATE?.split('T')[0]}
                </td>

                <td className="p-4 text-slate-700">
                  {app.APPOINTMENT_TIME}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(app.STATUS)}`}
                  >
                    {app.STATUS}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}