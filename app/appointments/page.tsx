'use client';

import { useEffect, useState } from 'react';

import {
  Trash2,
  CheckCircle,
} from 'lucide-react';

type Appointment = {
  APPOINTMENT_ID: number;
  PATIENT_NAME: string;
  DOCTOR_NAME: string;
  APPOINTMENT_DATE: string;
  STATUS: string;
};

export default function AppointmentsPage() {

  const [appointments,
    setAppointments] =
    useState<Appointment[]>([]);



  useEffect(() => {
    fetchAppointments();
  }, []);




  const fetchAppointments =
    async () => {

    try {

      const res =
        await fetch(
          '/api/appointments'
        );

      const data =
        await res.json();

      setAppointments(
        data.appointments || []
      );

    } catch (error) {

      console.error(error);

    }
  };



  const updateStatus =
    async (
      id: number,
      status: string
    ) => {

    try {

      await fetch(
        `/api/appointments/${id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      fetchAppointments();

    } catch (error) {

      console.error(error);

    }
  };



  const deleteAppointment =
    async (id: number) => {

    const confirmDelete =
      confirm(
        'Delete appointment?'
      );

    if (!confirmDelete) return;

    try {

      await fetch(
        `/api/appointments/${id}`,
        {
          method: 'DELETE',
        }
      );

      fetchAppointments();

    } catch (error) {

      console.error(error);

    }
  };



  const getStatusStyle =
    (status: string) => {

    switch (
      status?.toUpperCase()
    ) {

      case 'PENDING':
        return
        'bg-yellow-100 text-yellow-700';

      case 'COMPLETED':
        return
        'bg-emerald-100 text-emerald-700';

      case 'CANCELLED':
        return
        'bg-red-100 text-red-700';

      default:
        return
        'bg-slate-100 text-slate-700';
    }
  };



  return (

    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900">
          Appointments
        </h1>

      </div>



      <div
        className="
          bg-white
          rounded-2xl
          border border-slate-200
          shadow-sm
          overflow-hidden
        "
      >

        <table className="w-full text-sm">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4">
                ID
              </th>

              <th className="p-4">
                Patient
              </th>

              <th className="p-4">
                Doctor
              </th>

              <th className="p-4">
                Date
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Actions
              </th>

            </tr>

          </thead>



          <tbody>

            {appointments.map(
              (app) => (

              <tr
                key={
                  app.APPOINTMENT_ID
                }
                className="
                  border-t
                "
              >

                <td className="p-4">
                  #
                  {
                    app.APPOINTMENT_ID
                  }
                </td>

                <td className="p-4">
                  {
                    app.PATIENT_NAME
                  }
                </td>

                <td className="p-4">
                  {
                    app.DOCTOR_NAME
                  }
                </td>

                <td className="p-4">
                  {
                    app
                    .APPOINTMENT_DATE
                    ?.split('T')[0]
                  }
                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3 py-1
                      rounded-full
                      text-xs font-semibold
                      ${getStatusStyle(
                        app.STATUS
                      )}
                    `}
                  >

                    {app.STATUS}

                  </span>

                </td>



                <td className="p-4">

                  <div className="flex gap-3">

                    {/* COMPLETE */}
                    <button
                      onClick={() =>
                        updateStatus(
                          app.APPOINTMENT_ID,
                          'COMPLETED'
                        )
                      }
                      className="
                        px-3 py-2
                        rounded-xl
                        bg-emerald-100
                        text-emerald-700
                      "
                    >

                      <CheckCircle
                        size={16}
                      />

                    </button>



                    {/* CANCEL */}
                    <button
                      onClick={() =>
                        updateStatus(
                          app.APPOINTMENT_ID,
                          'CANCELLED'
                        )
                      }
                      className="
                        px-3 py-2
                        rounded-xl
                        bg-yellow-100
                        text-yellow-700
                      "
                    >

                      Cancel

                    </button>



                    {/* DELETE */}
                    <button
                      onClick={() =>
                        deleteAppointment(
                          app.APPOINTMENT_ID
                        )
                      }
                      className="
                        px-3 py-2
                        rounded-xl
                        bg-red-100
                        text-red-700
                      "
                    >

                      <Trash2
                        size={16}
                      />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}