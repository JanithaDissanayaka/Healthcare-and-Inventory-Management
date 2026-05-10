'use client';

import React, { useState } from 'react';

export default function NewPatientForm() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/patients', {
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
      alert('Error adding patient');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Add New Patient
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Fill in patient details
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name */}
        <InputField
          label="Patient Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Sarah Mitchell"
        />

        {/* DOB */}
        <InputField
          label="Date of Birth"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          placeholder="e.g. 1990-01-01"
        />

        {/* Gender */}
        <SelectField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={['Male', 'Female', 'Other']}
        />

        {/* Phone */}
        <InputField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0771234567"
        />

        {/* Address */}
        <InputField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Colombo"
        />

        {/* Buttons */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
          >
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
}


// INPUT COMPONENT
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
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
    />
  </div>
);


// SELECT COMPONENT
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
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
    >
      <option value="">Select</option>

      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);