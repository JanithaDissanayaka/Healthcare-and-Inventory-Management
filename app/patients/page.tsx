'use client';

import { useState } from 'react';



// 1. Mock Data (In a real app, this would come from an API/Database)
const allPatients = [
  { id: "#P-00124", name: "Sarah Mitchell", email: "sarah.m@email.com", age: 34, condition: "Hypertension", doctor: "Dr. Patel", lastVisit: "Today", status: "Active" },
  { id: "#P-00118", name: "James Horowitz", email: "james.h@email.com", age: 52, condition: "Diabetes Type 2", doctor: "Dr. Chen", lastVisit: "Yesterday", status: "Active" },
  { id: "#P-00112", name: "Priya Nair", email: "priya.n@email.com", age: 8, condition: "Asthma", doctor: "Dr. Wong", lastVisit: "Apr 22", status: "Follow-up" },
  { id: "#P-00107", name: "Roberto Alvarez", email: "r.alvarez@email.com", age: 61, condition: "Fracture (Left Hip)", doctor: "Dr. Kim", lastVisit: "Apr 20", status: "Critical" },
  { id: "#P-00098", name: "Emma Clarke", email: "emma.c@email.com", age: 27, condition: "Eczema", doctor: "Dr. Singh", lastVisit: "Apr 18", status: "Active" },
  { id: "#P-00091", name: "Kevin Thompson", email: "k.thompson@email.com", age: 45, condition: "Migraine", doctor: "Dr. Patel", lastVisit: "Apr 15", status: "Discharged" },
];

const filters = ["All", "Active", "Follow-up", "Critical", "Discharged"];

export default function PatientsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  // 2. Logic to filter data based on selected tab
  const filteredPatients = activeFilter === "All" 
    ? allPatients 
    : allPatients.filter((p) => p.status === activeFilter);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">


      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Patients</h2>
        
        {/* 3. Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                ${activeFilter === filter 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 4. Pass the filtered data to your Table component */}
        
      </div>
    </div>
  );
}