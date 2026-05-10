'use client';

import React from 'react';

import { downloadCSV } from "@/lib/reportUtils";

export default function ReportsPage() {

  // Logic to simulate fetching data based on report type
  const handleGenerate = (reportTitle: string) => {
    // You would fetch data from your API here based on the title
    let dataToExport: any[] = [];

    if (reportTitle === "Patient Summary") {
      dataToExport = [
        { id: "P-001", name: "Sarah Mitchell", condition: "Hypertension" },
        { id: "P-002", name: "James Horowitz", condition: "Diabetes" },
      ];
    } else if (reportTitle === "Financial Summary") {
      dataToExport = [
        { invoice: "INV-001", amount: 800, status: "Paid" },
        { invoice: "INV-002", amount: 1200, status: "Pending" },
      ];
    }

    downloadCSV(dataToExport, reportTitle.toLowerCase().replace(/\s+/g, '-'));
  };

  const reports = [
    { title: "Patient Summary", desc: "Admissions, discharges, demographics...", icon: "👥" },
    { title: "Appointment Analysis", desc: "No-shows, wait times, department load...", icon: "📅" },
    { title: "Prescription Trends", desc: "Most prescribed medications...", icon: "💊" },
    { title: "Inventory Audit", desc: "Stock movements, expiry tracking...", icon: "📦" },
    { title: "Financial Summary", desc: "Revenue, outstanding payments...", icon: "💳" },
    { title: "Doctor Performance", desc: "Patient loads, ratings, outcomes...", icon: "⚕️" },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-3xl mb-4">{report.icon}</div>
            <h3 className="font-bold text-slate-900 mb-2">{report.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{report.desc}</p>
            <button 
              onClick={() => handleGenerate(report.title)}
              className="w-full py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors"
            >
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}