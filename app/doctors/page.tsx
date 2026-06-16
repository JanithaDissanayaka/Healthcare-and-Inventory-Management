'use client';

import { useEffect, useState } from 'react';
import {
  Phone,
  Award,
  Star,
  Users,
  Trash2,
} from 'lucide-react';

type Doctor = {
  ID: number;
  NAME: string;
  SPECIALIZATION: string;
  PHONE: string;
  EMAIL: string;
  SALARY: number;
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

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.NAME?.toLowerCase().includes(search.toLowerCase()) ||
      doc.SPECIALIZATION?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* STATS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
          {/* TOTAL */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Doctors</p>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {doctors.length}
                </h2>
              </div>

              <div className="h-14 w-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                <Users className="text-cyan-600" size={24} />
              </div>
            </div>
          </div>

          {/* SPECIALISTS */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Specializations</p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {
                    new Set(
                      doctors.map((d) => d.SPECIALIZATION)
                    ).size
                  }
                </h2>
              </div>

              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Award className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          {/* AVERAGE SALARY */}
          <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Average Salary
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  Rs.
                  {doctors.length
                    ? Math.round(
                        doctors.reduce(
                          (acc, cur) => acc + Number(cur.SALARY),
                          0
                        ) / doctors.length
                      ).toLocaleString()
                    : 0}
                </h2>
              </div>

              <div className="h-14 w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Star className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DOCTORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.ID}
            className="
              group
              bg-white
              rounded-3xl
              border border-slate-200
              p-6
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all
              duration-300
              overflow-hidden
              relative
            "
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-50"></div>

            {/* HEADER */}
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="
                    h-16 w-16
                    rounded-2xl
                    bg-gradient-to-br
                    from-cyan-500
                    to-blue-500
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xl
                    font-bold
                    shadow-lg
                    shadow-cyan-500/20
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
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                <div className="h-10 w-10 rounded-xl bg-cyan-100 flex items-center justify-center">
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

              {/* EMAIL */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  @
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="font-semibold text-slate-800 break-all">
                    {doc.EMAIL}
                  </p>
                </div>
              </div>

              {/* SALARY */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50">
                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
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
                    Rs. {Number(doc.SALARY).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* DELETE BUTTON */}
            <div className="mt-6">
              <button
                onClick={async () => {
                  const confirmDelete = confirm(
                    'Delete doctor?'
                  );

                  if (!confirmDelete) return;

                  try {
                    const res = await fetch(
                      `/api/doctors/${doc.ID}`,
                      {
                        method: 'DELETE',
                      }
                    );

                    if (!res.ok) {
                      throw new Error('Delete failed');
                    }

                    fetchDoctors();
                  } catch (error) {
                    console.error(error);
                    alert('Failed to delete doctor');
                  }
                }}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-3
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