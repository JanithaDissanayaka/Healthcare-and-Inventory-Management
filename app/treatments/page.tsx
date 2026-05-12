'use client';

import React, { useState } from 'react';

export default function AddTreatmentPage() {

  const [formData, setFormData] = useState({
    appointmentId: '',
    treatmentType: '',
    description: '',
    cost: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
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
        '/api/treatments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      alert(data.message);

    } catch (error) {

      console.error(error);

      alert('Error adding treatment');
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Add Treatment
        </h1>

        <p className="text-slate-500 mb-8">
          Create treatment record
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <InputField
            label="Appointment ID"
            name="appointmentId"
            value={formData.appointmentId}
            onChange={handleChange}
            placeholder="Enter appointment ID"
          />

          <InputField
            label="Treatment Type"
            name="treatmentType"
            value={formData.treatmentType}
            onChange={handleChange}
            placeholder="e.g. Root Canal"
          />

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Treatment details..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32"
            />

          </div>

          <InputField
            label="Cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="5000"
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold"
          >
            Add Treatment
          </button>

        </form>

      </div>

    </div>
  );
}


const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder: string;
}) => (

  <div>

    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
    </label>

    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
    />

  </div>
);