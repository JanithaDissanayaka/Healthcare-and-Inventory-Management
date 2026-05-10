'use client';

import React, { useState } from 'react';
import StatusBadge from "@/app/components/StatusBadge";

const suppliers = [
  { id: 1, name: "MedPharma Ltd", email: "contact@medpharma.com", category: "Pharmaceuticals", contact: "+1-800-MEDPH", lastOrder: "Apr 20", ordersYtd: 24, rating: 4.8, status: "Active" },
  { id: 2, name: "BioMed Supplies", email: "sales@biomed.co", category: "Biologics", contact: "+1-800-BIOMED", lastOrder: "Apr 18", ordersYtd: 18, rating: 4.6, status: "Active" },
  { id: 3, name: "SafeGear Co.", email: "info@safegear.io", category: "PPE & Equipment", contact: "+1-800-SAFE", lastOrder: "Apr 12", ordersYtd: 31, rating: 4.4, status: "Active" },
  { id: 4, name: "FluidCare Inc.", email: "support@fluidcare.net", category: "IV Fluids", contact: "+1-800-FLUID", lastOrder: "Mar 28", ordersYtd: 9, rating: 4.7, status: "Review" },
];

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Summary Section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registered Suppliers</h2>
          <p className="text-sm text-slate-500">Manage vendor relationships and order history</p>
        </div>
        <input 
          type="text" 
          placeholder="Search suppliers..." 
          className="px-4 py-2 border border-slate-300 rounded-lg w-64 focus:ring-2 focus:ring-emerald-500 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["SUPPLIER", "CATEGORY", "CONTACT", "ORDERS YTD", "RATING", "STATUS", "ACTIONS"].map(h => (
                <th key={h} className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSuppliers.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-slate-900">{s.name}</div>
                  <div className="text-slate-400 text-xs">{s.email}</div>
                </td>
                <td className="p-4 text-slate-600">{s.category}</td>
                <td className="p-4 font-mono text-slate-600">{s.contact}</td>
                <td className="p-4 text-slate-600">{s.ordersYtd}</td>
                <td className="p-4 font-bold text-slate-900">★ {s.rating}</td>
                <td className="p-4"><StatusBadge status={s.status} /></td>
                <td className="p-4 flex gap-2">
                  <button className="text-emerald-600 hover:text-emerald-800 font-medium">Edit</button>
                  <button className="text-red-600 hover:text-red-800 font-medium">History</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}