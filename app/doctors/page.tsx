'use client';

import { useEffect, useState } from 'react';

import {
  Stethoscope,
  Phone,
  Award,
  Star,
  Users,
  Trash2,
} from 'lucide-react';

type Doctor = {
  DOCTOR_ID: number;
  NAME: string;
  SPECIALIZATION: string;
  PHONE: string;
  EMAIL: string;
  SALARY: number;
};

export default function DoctorsPage() {

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [search, setSearch] =
    useState('');



  useEffect(() => {
    fetchDoctors();
  }, []);




  const fetchDoctors = async () => {

    try {

      const res =
        await fetch('/api/doctors');

      const data =
        await res.json();

      setDoctors(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

    }
  };



  const filteredDoctors =
    doctors.filter((doc) =>

      doc.NAME
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      doc.SPECIALIZATION
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );



  return (

    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* STATS */}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">

          {/* TOTAL */}
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



          {/* SPECIALISTS */}
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
                        (d) =>
                          d.SPECIALIZATION
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



          {/* SALARY */}
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
                  Average Salary
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">

                  Rs.
                  {doctors.length > 0
                    ? Math.round(
                        doctors.reduce(
                          (acc, cur) =>
                            acc +
                            cur.SALARY,
                          0
                        ) / doctors.length
                      )
                    : 0}

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



                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {doc.NAME}
                  </h2>

                  <p className="text-cyan-600 font-medium mt-1">
                    {doc.SPECIALIZATION}
                  </p>

                </div>

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



              {/* SALARY */}
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
                    Salary
                  </p>

                  <p className="font-semibold text-slate-800">
                    Rs. {doc.SALARY}
                  </p>

                </div>

              </div>

            </div>



            {/* BUTTON */}
            <div className="mt-6">

              <button
                onClick={async () => {

                  const confirmDelete =
                    confirm(
                      'Delete doctor?'
                    );

                  if (!confirmDelete)
                    return;

                  try {

                    await fetch(
                      `/api/doctors/${doc.DOCTOR_ID}`,
                      {
                        method: 'DELETE',
                      }
                    );

                    fetchDoctors();

                  } catch (error) {

                    console.error(error);

                  }
                }}
                className="
                  w-full
                  flex items-center justify-center gap-3
                  py-3
                  rounded-2xl
                  bg-red-50
                  hover:bg-red-100
                  text-red-700
                  font-semibold
                  transition
                "
              >

                <Trash2 size={18} />

                Delete Doctor

              </button>

            </div>

          </div>

        ))}

      </div>



    </div>
  );
}