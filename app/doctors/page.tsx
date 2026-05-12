'use client';

import { useEffect, useState } from 'react';

import {
  Stethoscope,
  Phone,
  Award,
  Search,
  Plus,
  Star,
  Users,
} from 'lucide-react';

type Doctor = {
  DOCTOR_ID: number;
  NAME: string;
  SPECIALIZATION: string;
  PHONE: string;
  EXPERIENCE_YEARS: number;
};

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [search, setSearch] = useState('');

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

  const filteredDoctors = doctors.filter((doc) =>
    doc.NAME.toLowerCase().includes(search.toLowerCase()) ||
    doc.SPECIALIZATION
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* TOP SECTION */}
      <div
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          p-6 lg:p-8
          shadow-sm
          mb-8
        "
      >
        

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div
            className="
              rounded-3xl
              bg-slate-50
              border border-slate-200
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Doctors
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {doctors.length}
                </h2>
              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-cyan-100
                  flex items-center justify-center
                "
              >
                <Users
                  className="text-cyan-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          <div
            className="
              rounded-3xl
              bg-slate-50
              border border-slate-200
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Specialists
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {
                    new Set(
                      doctors.map(
                        (d) => d.SPECIALIZATION
                      )
                    ).size
                  }
                </h2>
              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-emerald-100
                  flex items-center justify-center
                "
              >
                <Award
                  className="text-emerald-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          <div
            className="
              rounded-3xl
              bg-slate-50
              border border-slate-200
              p-5
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Average Experience
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {doctors.length > 0
                    ? Math.round(
                        doctors.reduce(
                          (acc, cur) =>
                            acc +
                            cur.EXPERIENCE_YEARS,
                          0
                        ) / doctors.length
                      )
                    : 0}
                  y
                </h2>
              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-orange-100
                  flex items-center justify-center
                "
              >
                <Star
                  className="text-orange-600"
                  size={24}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCTOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.DOCTOR_ID}
            className="
              group
              bg-white
              rounded-3xl
              border border-slate-200
              p-6
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all duration-300
              overflow-hidden
              relative
            "
          >
            {/* BACKGROUND CIRCLE */}
            <div
              className="
                absolute
                -top-10 -right-10
                h-40 w-40
                rounded-full
                bg-cyan-50
              "
            ></div>

            {/* TOP */}
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* AVATAR */}
                <div
                  className="
                    h-16 w-16
                    rounded-2xl
                    bg-gradient-to-br
                    from-cyan-500
                    to-blue-500
                    flex items-center justify-center
                    text-white
                    text-xl
                    font-bold
                    shadow-lg shadow-cyan-500/20
                  "
                >
                  {doc.NAME?.charAt(0)}
                </div>

                {/* INFO */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {doc.NAME}
                  </h2>

                  <p className="text-cyan-600 font-medium mt-1">
                    {doc.SPECIALIZATION}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div
                className="
                  px-3 py-1
                  rounded-full
                  bg-emerald-100
                  text-emerald-700
                  text-xs
                  font-semibold
                "
              >
                Active
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-8 space-y-4 relative">
              {/* PHONE */}
              <div
                className="
                  flex items-center gap-3
                  p-4
                  rounded-2xl
                  bg-slate-50
                "
              >
                <div
                  className="
                    h-10 w-10
                    rounded-xl
                    bg-cyan-100
                    flex items-center justify-center
                  "
                >
                  <Phone
                    size={18}
                    className="text-cyan-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Contact Number
                  </p>

                  <p className="font-semibold text-slate-800">
                    {doc.PHONE}
                  </p>
                </div>
              </div>

              {/* EXPERIENCE */}
              <div
                className="
                  flex items-center gap-3
                  p-4
                  rounded-2xl
                  bg-slate-50
                "
              >
                <div
                  className="
                    h-10 w-10
                    rounded-xl
                    bg-orange-100
                    flex items-center justify-center
                  "
                >
                  <Award
                    size={18}
                    className="text-orange-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Experience
                  </p>

                  <p className="font-semibold text-slate-800">
                    {doc.EXPERIENCE_YEARS} Years
                  </p>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex gap-3">
              <button
                className="
                  flex-1
                  py-3
                  rounded-2xl
                  bg-cyan-500
                  hover:bg-cyan-600
                  text-white
                  font-semibold
                  transition
                "
              >
                View Profile
              </button>

              <button
                className="
                  flex-1
                  py-3
                  rounded-2xl
                  border border-slate-200
                  hover:bg-slate-50
                  text-slate-700
                  font-semibold
                  transition
                "
              >
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredDoctors.length === 0 && (
        <div
          className="
            bg-white
            rounded-3xl
            border border-slate-200
            p-16
            text-center
            mt-8
          "
        >
          <div
            className="
              h-20 w-20
              rounded-full
              bg-cyan-100
              mx-auto
              flex items-center justify-center
              mb-6
            "
          >
            <Stethoscope
              className="text-cyan-600"
              size={36}
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Doctors Found
          </h2>

          <p className="text-slate-500 mt-3">
            Try searching with another keyword.
          </p>
        </div>
      )}
    </div>
  );
}