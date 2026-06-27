'use client';

import React, { useState } from 'react';
import { 
  FileDown, 
  Users, 
  CalendarCheck, 
  Pill, 
  Boxes, 
  CreditCard, 
  Stethoscope, 
  RefreshCw 
} from 'lucide-react';
import { downloadCSV } from "@/lib/reportUtils";

const REPORTS = [
  { title: "Patient Summary", desc: "Admissions, discharges, and patient demographics.", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Appointment Analysis", desc: "No-shows, wait times, and department loads.", icon: CalendarCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
  { title: "Prescription Trends", desc: "Detailed tracking of common medications.", icon: Pill, color: "text-fuchsia-600", bg: "bg-fuchsia-50" },
  { title: "Inventory Audit", desc: "Full stock movements and expiry tracking.", icon: Boxes, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "Financial Summary", desc: "Aggregated revenue and outstanding debts.", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50" },
  { title: "Doctor Performance", desc: "Patient loads, ratings, and clinical outcomes.", icon: Stethoscope, color: "text-cyan-600", bg: "bg-cyan-50" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (reportTitle: string) => {
    setGenerating(reportTitle);
    
    // Simulate API delay for professional UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let dataToExport: any[] = [];
    if (reportTitle === "Patient Summary") {
      dataToExport = [{ id: "P-001", name: "Sarah Mitchell", condition: "Hypertension" }];
    } else if (reportTitle === "Financial Summary") {
      dataToExport = [{ invoice: "INV-001", amount: 800, status: "Paid" }];
    }

    downloadCSV(dataToExport, reportTitle.toLowerCase().replace(/\s+/g, '-'));
    setGenerating(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="mb-10">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Clinical Reports</h1>
        <p className="text-slate-500 font-medium mt-2">Export administrative datasets for auditing and analysis.</p>
      </div>

      {/* REPORTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          const isGenerating = generating === report.title;

          return (
            <div 
              key={report.title} 
              className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all group"
            >
              <div className={`h-14 w-14 ${report.bg} ${report.color} rounded-2xl flex items-center justify-center mb-6`}>
                <Icon size={28} />
              </div>
              <h3 className="font-black text-slate-900 text-lg mb-2">{report.title}</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">{report.desc}</p>
              
              <button 
                onClick={() => handleGenerate(report.title)}
                disabled={!!generating}
                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isGenerating 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <><RefreshCw size={18} className="animate-spin" /> Compiling CSV...</>
                ) : (
                  <><FileDown size={18} /> Generate Export</>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}