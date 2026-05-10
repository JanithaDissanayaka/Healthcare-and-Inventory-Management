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

  // Load patients from API
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');

      const data = await res.json();

      setPatients(data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">
        Patients
      </h2>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">DOB</th>
              <th className="text-left p-4">Gender</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Address</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.PATIENT_ID}
                className="border-t"
              >
                <td className="p-4">
                  {patient.PATIENT_ID}
                </td>

                <td className="p-4">
                  {patient.NAME}
                </td>

                <td className="p-4">
                  {patient.DOB?.split('T')[0]}
                </td>

                <td className="p-4">
                  {patient.GENDER}
                </td>

                <td className="p-4">
                  {patient.PHONE}
                </td>

                <td className="p-4">
                  {patient.ADDRESS}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}