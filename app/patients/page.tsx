'use client';

import { useEffect, useState } from 'react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
  DOB: string;
  GENDER: string;
  PHONE: string;
  ADDRESS: string;
};

export default function PatientsPage() {

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Load patients
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {

    try {

      const res = await fetch('/api/patients');

      const data = await res.json();

      console.log(data);

      // Ensure array
      setPatients(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error(error);

      setPatients([]);

    } finally {

      setLoading(false);

    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8">
        Loading patients...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Patients
      </h2>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          {/* Head */}
          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4 text-slate-700">
                ID
              </th>

              <th className="text-left p-4 text-slate-700">
                Name
              </th>

              <th className="text-left p-4 text-slate-700">
                DOB
              </th>

              <th className="text-left p-4 text-slate-700">
                Gender
              </th>

              <th className="text-left p-4 text-slate-700">
                Phone
              </th>

              <th className="text-left p-4 text-slate-700">
                Address
              </th>

            </tr>

          </thead>

          {/* Body */}
          <tbody>

            {patients.length > 0 ? (

              patients.map((patient) => (

                <tr
                  key={patient.PATIENT_ID}
                  className="border-t hover:bg-slate-50 cursor-pointer transition"
                  onClick={() => {
                    window.location.href = `/patients/${patient.PATIENT_ID}`;
                  }}
                >

                  <td className="p-4 text-slate-900">
                    {patient.PATIENT_ID}
                  </td>

                  <td className="p-4 text-slate-900 font-medium">
                    {patient.NAME}
                  </td>

                  <td className="p-4 text-slate-700">
                    {patient.DOB?.split('T')[0]}
                  </td>

                  <td className="p-4 text-slate-700">
                    {patient.GENDER}
                  </td>

                  <td className="p-4 text-slate-700">
                    {patient.PHONE}
                  </td>

                  <td className="p-4 text-slate-700">
                    {patient.ADDRESS}
                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={6}
                  className="text-center p-8 text-slate-500"
                >
                  No patients found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}