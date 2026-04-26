import React from 'react';
// Assuming you have the Topbar component

// --- Mock Data ---
const doctors = [
  { id: 1, name: "Dr. Rohan Patel", specialty: "Cardiology", exp: "14 yrs exp", appointments: 8, rating: 4.9, patients: 142, status: "Available" },
  { id: 2, name: "Dr. Lisa Chen", specialty: "Internal Medicine", exp: "9 yrs", appointments: 6, rating: 4.8, patients: 98, status: "Available" },
  { id: 3, name: "Dr. Amy Wong", specialty: "Pediatrics", exp: "11 yrs", appointments: 5, rating: 4.9, patients: 211, status: "Available" },
  { id: 4, name: "Dr. Sam Kim", specialty: "Orthopedics", exp: "16 yrs", appointments: 3, rating: 4.7, patients: 77, status: "In Surgery" },
  { id: 5, name: "Dr. Neha Singh", specialty: "Dermatology", exp: "7 yrs", appointments: 7, rating: 4.6, patients: 63, status: "Available" },
  { id: 6, name: "Dr. Ben Marcus", specialty: "Neurology", exp: "20 yrs", appointments: 0, rating: 4.9, patients: 55, status: "On Leave" },
];

// --- Sub-Components ---

const StatCard = ({ title, value }: { title: string, value: string | number }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="text-3xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-500 font-medium mt-1">{title}</div>
  </div>
);

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Available": return "bg-emerald-100 text-emerald-700";
    case "In Surgery": return "bg-amber-100 text-amber-700";
    case "On Leave": return "bg-slate-100 text-slate-500";
    default: return "bg-gray-100 text-gray-700";
  }
};

const DoctorCard = ({ doc }: { doc: typeof doctors[0] }) => {
  const initials = doc.name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{doc.name}</h3>
            <p className="text-sm text-slate-500">{doc.specialty} · {doc.exp}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(doc.status)}`}>
          {doc.status}
        </span>
      </div>

      <div className="flex gap-6 pt-2 border-t border-slate-100 text-sm text-slate-600">
        <div className="flex items-center gap-1">📅 {doc.appointments} today</div>
        <div className="flex items-center gap-1">⭐ {doc.rating}</div>
        <div className="flex items-center gap-1">👥 {doc.patients} patients</div>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function DoctorsPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Active Doctors" value="22" />
        <StatCard title="Departments" value="8" />
        <StatCard title="On Leave" value="3" />
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}