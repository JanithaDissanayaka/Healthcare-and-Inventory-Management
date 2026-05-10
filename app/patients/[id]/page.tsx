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

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {

    const { id } = await params;

    try {

      const res = await fetch(`/api/patients/${id}`);

      const data = await res.json();

      setPatient(data);

    } catch (error) {

      console.error(error);

    }
  };

  if (!patient) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="bg-white rounded-xl shadow border p-8">

        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Patient Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-slate-500">
              Patient ID
            </p>

            <p className="text-lg font-semibold text-slate-900">
              {patient.PATIENT_ID}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Name
            </p>

            <p className="text-lg font-semibold text-slate-900">
              {patient.NAME}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Date of Birth
            </p>

            <p className="text-lg font-semibold text-slate-900">
              {patient.DOB?.split('T')[0]}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Gender
            </p>

            <p className="text-lg font-semibold text-slate-900">
              {patient.GENDER}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Phone
            </p>

            <p className="text-lg font-semibold text-slate-900">
              {patient.PHONE}
            </p>
          </div>


          <div>
            <p className="text-sm text-slate-500">
              Address
            </p>

            <p className="text-lg font-semibold text-slate-900">
              {patient.ADDRESS}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}