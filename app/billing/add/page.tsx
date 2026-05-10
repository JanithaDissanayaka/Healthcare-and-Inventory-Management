'use client';

import React, { useState } from 'react';


export default function AddBillingPage() {
  const [total, setTotal] = useState(0);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Create New Invoice</h2>
          <p className="text-sm text-slate-500 mt-1">Generate a bill for a patient service</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Patient Selection */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Patient Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Select Patient" placeholder="Search by name or ID..." />
              <InputField label="Billing Date" type="date" />
            </div>
          </section>

          {/* Invoice Items */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Invoice Items</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-6">
                  <InputField label="Service / Description" placeholder="e.g. Cardiology Consultation" />
                </div>
                <div className="col-span-4">
                  <InputField label="Amount" type="number" placeholder="0.00" />
                </div>
                <div className="col-span-2">
                   <button className="w-full py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                     Remove
                   </button>
                </div>
              </div>
              
              <button type="button" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                + Add another item
              </button>
            </div>
          </section>

          {/* Totals & Status */}
          <section className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total Due</span>
              <span className="text-2xl font-bold text-emerald-600">$0.00</span>
            </div>
            <div className="mt-6 flex gap-4">
              <SelectField label="Invoice Status" options={["Draft", "Pending", "Paid"]} />
            </div>
          </section>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button type="submit" className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              Create Invoice
            </button>
            <button type="button" className="px-8 text-slate-500 font-medium py-3 rounded-lg hover:bg-slate-100 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Reusable Form Components (Keep these in a separate file or at the bottom) ---

const InputField = ({ label, type = "text", placeholder = "" }: { label: string, type?: string, placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
  </div>
);

const SelectField = ({ label, options }: { label: string, options: string[] }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
      <option value="">Select...</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);