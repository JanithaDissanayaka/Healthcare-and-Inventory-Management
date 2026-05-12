'use client';

import React, { useState } from 'react';

export default function AddInventoryPage() {

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: '',
    unit: '',
    expiryDate: '',
    supplierName: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const res = await fetch(
        '/api/inventory',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert(data.message);

      } else {

        alert(data.error);

      }

    } catch (error) {

      console.error(error);

      alert('Error adding inventory');

    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">
            Add Inventory Item
          </h2>

          <p className="text-slate-500 mt-1">
            Add medicine or equipment
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* Details */}
          <section>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Item Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Amoxicillin 500mg"
              />

              <SelectField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  "Antibiotics",
                  "Hormones",
                  "PPE",
                  "IV Fluids",
                  "Analgesics"
                ]}
              />

              <InputField
                label="Quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
              />

              <InputField
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Box"
              />

            </div>

          </section>

          {/* Logistics */}
          <section>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Supplier & Logistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputField
                label="Expiry Date"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder=""
              />

              <InputField
                label="Supplier Name"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                placeholder="MedPharma Ltd"
              />

              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-28"
                  placeholder="Storage instructions..."
                />

              </div>

            </div>

          </section>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold"
          >
            Add Inventory Item
          </button>

        </form>

      </div>

    </div>
  );
}


const InputField = ({
  label,
  type = "text",
  placeholder = "",
  name,
  value,
  onChange
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) => (

  <div>

    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
    />

  </div>
);


const SelectField = ({
  label,
  options,
  name,
  value,
  onChange
}: {
  label: string;
  options: string[];
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}) => (

  <div>

    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
    >

      <option value="">
        Select Category
      </option>

      {options.map((opt) => (

        <option
          key={opt}
          value={opt}
        >
          {opt}
        </option>

      ))}

    </select>

  </div>
);