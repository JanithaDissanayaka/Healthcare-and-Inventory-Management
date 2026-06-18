'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Phone,
  Award,
  Star,
  Users,
  Trash2,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

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

  const SPECIALIZATION_COLORS = ['#06B6D4', '#10B981', '#F59E0B', '#6366F1', '#F43F5E', '#8B5CF6', '#84CC16', '#EC4899'];

  const specializationChartData = useMemo(() => {
    const counts = new Map<string, number>();
    doctors.forEach((d) => {
      const key = d.SPECIALIZATION || 'Unspecified';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [doctors]);

  const salaryHistogramData = useMemo(() => {
    const salaries = doctors
      .map((d) => Number(d.SALARY))
      .filter((s) => Number.isFinite(s) && s > 0);
    if (salaries.length === 0) return [];

    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    const bucketCount = 6;
    const rawBucketSize = (max - min) / bucketCount || 1;
    const bucketSize = Math.ceil(rawBucketSize / 5000) * 5000 || 5000;

    const buckets = Array.from({ length: bucketCount }, (_, i) => {
      const start = min + i * bucketSize;
      const end = start + bucketSize;
      return { start, end, count: 0 };
    });

    salaries.forEach((s) => {
      const idx = Math.min(Math.floor((s - min) / bucketSize), bucketCount - 1);
      buckets[idx].count += 1;
    });

    return buckets
      .filter((b) => b.count > 0)
      .map((b) => ({
        range: `${Math.round(b.start / 1000)}k-${Math.round(b.end / 1000)}k`,
        count: b.count,
      }));
  }, [doctors]);

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
            <div className="mt-4 h-2 rounded-full bg-cyan-100 overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: doctors.length > 0 ? '100%' : '0%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Across {specializationChartData.length} specialization{specializationChartData.length === 1 ? '' : 's'}
            </p>
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

      {/* ANALYTICS CHARTS GRID */}
      {doctors.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

          {/* DOCTORS BY SPECIALIZATION — PIE CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="text-cyan-600" size={20} />
              <h3 className="text-xl font-bold text-slate-900">By Specialization</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Doctor headcount per specialty</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={specializationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {specializationChartData.map((entry, index) => (
                    <Cell key={`spec-cell-${index}`} fill={SPECIALIZATION_COLORS[index % SPECIALIZATION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* SALARY DISTRIBUTION — HISTOGRAM */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-orange-500" size={20} />
              <h3 className="text-xl font-bold text-slate-900">Salary Distribution</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Number of doctors per salary range (Rs.)</p>
            {salaryHistogramData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-16">No salary data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={salaryHistogramData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="range" stroke="#94A3B8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                  <Tooltip formatter={(value) => [value, 'Doctors']} />
                  <Bar dataKey="count" fill="#F97316" radius={[8, 8, 0, 0]} barSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      )}

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