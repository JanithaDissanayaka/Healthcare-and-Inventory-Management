'use client';

import React, { useState } from 'react';

export default function AddDoctorPage() {

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    experience: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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

      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      alert(data.message);

    } catch (error) {

      console.error(error);

      alert('Error adding doctor');

    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="bg-white rounded-xl border shadow-sm p-8 max-w-2xl">

        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Add Doctor
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <InputField
            label="Doctor Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <InputField
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />

          <InputField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <InputField
            label="Experience Years"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
          >
            Add Doctor
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
  type = "text"
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
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
      className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
    />

  </div>
);