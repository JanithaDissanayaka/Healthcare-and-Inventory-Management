'use client';

import React from 'react';


export default function AddInventoryPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">


      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Add New Inventory Item</h2>
          <p className="text-sm text-slate-500 mt-1">Add a new medication or equipment to the system</p>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Item Information */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Item Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Item Name" placeholder="e.g. Amoxicillin 500mg" />
              <SelectField label="Category" options={["Antibiotics", "Hormones", "PPE", "IV Fluids", "Analgesics"]} />
              <InputField label="Quantity" type="number" placeholder="0" />
              <InputField label="Unit" placeholder="e.g. Box, Vial, Capsule" />
            </div>
          </section>

          {/* Supplier & Logistics */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Supplier & Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Expiry Date" type="date" />
              <InputField label="Supplier Name" placeholder="e.g. MedPharma Ltd" />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Storage Instructions</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24"
                  placeholder="Storage requirements or handling notes..."
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-100 flex gap-4">
            <button type="submit" className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              Add Item
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

// --- Reusable Form Components ---

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
      <option value="">Select category</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);