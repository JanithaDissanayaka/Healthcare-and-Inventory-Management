'use client';

import { useEffect, useState } from 'react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
  PHONE: string;
};

type Doctor = {
  DOCTOR_ID: number;
  NAME: string;
  SPECIALIZATION: string;
};

type DashboardData = {
  totalPatients: number;
  totalDoctors: number;
  latestPatients: Patient[];
  latestDoctors: Doctor[];
};

const StatCard = ({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: number;
  icon: string;
  gradient: string;
}) => (

  <div
    className={`rounded-2xl p-6 text-white shadow-lg ${gradient}
    hover:scale-[1.02] transition-transform duration-300`}
  >

    <div className="flex justify-between items-center">

      <div>

        <p className="text-sm opacity-80">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-2">
          {value}
        </h2>

      </div>

      <div className="text-5xl opacity-30">
        {icon}
      </div>

    </div>

  </div>
);

export default function DashboardPage() {

  const [data, setData] =
    useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const res = await fetch('/api/dashboard');

      const dashboardData = await res.json();

      setData(dashboardData);

    } catch (error) {

      console.error(error);

    }
  };

  if (!data) {

    return (
      <div className="p-8">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-100 min-h-screen">

      {/* Welcome */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-900">
          Healthcare Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back 👋
        </p>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Patients"
          value={data.totalPatients}
          icon="👥"
          gradient="bg-gradient-to-r from-emerald-500 to-emerald-700"
        />

        <StatCard
          title="Doctors"
          value={data.totalDoctors}
          icon="🩺"
          gradient="bg-gradient-to-r from-blue-500 to-blue-700"
        />

        <StatCard
          title="Appointments"
          value={24}
          icon="📅"
          gradient="bg-gradient-to-r from-purple-500 to-purple-700"
        />

        <StatCard
          title="Revenue"
          value={84000}
          icon="💰"
          gradient="bg-gradient-to-r from-orange-500 to-orange-700"
        />

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Latest Patients */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Latest Patients
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Recently registered patients
              </p>

            </div>

            <button className="text-emerald-600 font-medium hover:text-emerald-700">
              View All →
            </button>

          </div>

          <div className="space-y-4">

            {data.latestPatients.map((patient) => (

              <div
                key={patient.PATIENT_ID}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
              >

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                    {patient.NAME.charAt(0)}
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {patient.NAME}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {patient.PHONE}
                    </p>

                  </div>

                </div>

                <div className="text-emerald-600">
                  →
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Doctors */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Doctors
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Available specialists
              </p>

            </div>

            <button className="text-blue-600 font-medium hover:text-blue-700">
              View All →
            </button>

          </div>

          <div className="space-y-4">

            {data.latestDoctors.map((doctor) => (

              <div
                key={doctor.DOCTOR_ID}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300"
              >

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {doctor.NAME.charAt(0)}
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {doctor.NAME}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {doctor.SPECIALIZATION}
                    </p>

                  </div>

                </div>

                <div className="text-blue-600">
                  →
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}