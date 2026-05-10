'use client';

import { useEffect, useState } from 'react';

type Doctor = {
  DOCTOR_ID: number;
  NAME: string;
  SPECIALIZATION: string;
  PHONE: string;
  EXPERIENCE_YEARS: number;
};

export default function DoctorsPage() {

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {

    try {

      const res = await fetch('/api/doctors');

      const data = await res.json();

      setDoctors(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Doctors
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {doctors.map((doc) => (

          <div
            key={doc.DOCTOR_ID}
            className="bg-white p-6 rounded-xl border shadow-sm"
          >

            <h2 className="text-xl font-bold text-slate-900">
              {doc.NAME}
            </h2>

            <p className="text-slate-600 mt-1">
              {doc.SPECIALIZATION}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-700">

              <p>
                📞 {doc.PHONE}
              </p>

              <p>
                🩺 {doc.EXPERIENCE_YEARS} years experience
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}