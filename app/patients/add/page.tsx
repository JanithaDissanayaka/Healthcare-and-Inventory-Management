'use client';

import React, { useState } from 'react';

import {
  User,
  CalendarDays,
  Phone,
  MapPin,
  VenusAndMars,
  Save,
  Users,
} from 'lucide-react';

export default function NewPatientForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
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

    setLoading(true);

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

      // RESET FORM
      setFormData({
        name: '',
        dob: '',
        gender: '',
        phone: '',
        address: '',
      });
    } catch (error) {
      console.error(error);

      alert('Error adding patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-sm
          overflow-hidden
        "
      >
        {/* TOP BANNER */}
        <div
          className="
            bg-white
            border-b border-slate-200
            px-8 py-7
            relative
          "
        >
          {/* LIGHT DECORATION */}
          <div
            className="
              absolute
              right-10 top-6
              h-24 w-24
              rounded-full
              bg-emerald-50
            "
          ></div>

          <div
            className="
              absolute
              right-24 top-14
              h-14 w-14
              rounded-full
              bg-cyan-50
            "
          ></div>

          <div className="relative flex items-center gap-5">
            {/* ICON */}
            <div
              className="
                h-16 w-16
                rounded-2xl
                bg-emerald-50
                border border-emerald-100
                flex items-center justify-center
              "
            >
              <Users
                className="text-emerald-600"
                size={28}
              />
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Patient Registration
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Register new patients into the healthcare system.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6 lg:p-10">
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NAME */}
              <InputField
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Sarah Mitchell"
                icon={<User size={18} />}
              />

              {/* DOB */}
              <InputField
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder=""
                icon={<CalendarDays size={18} />}
              />

              {/* GENDER */}
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                icon={<VenusAndMars size={18} />}
                options={[
                  'Male',
                  'Female',
                  'Other',
                ]}
              />

              {/* PHONE */}
              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0771234567"
                icon={<Phone size={18} />}
              />

              {/* ADDRESS */}
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Colombo, Sri Lanka"
                  icon={<MapPin size={18} />}
                />
              </div>
            </div>

            {/* BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  flex items-center justify-center gap-3
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  transition-all duration-200
                  disabled:opacity-70
                "
              >
                <Save size={20} />

                {loading
                  ? 'Registering Patient...'
                  : 'Register Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* INPUT FIELD */

const InputField = ({
  label,
  type = 'text',
  placeholder = '',
  name,
  value,
  onChange,
  icon,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  icon: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">
      {label}
    </label>

    <div className="relative">
      <div
        className="
          absolute
          left-4 top-1/2
          -translate-y-1/2
          text-slate-400
        "
      >
        {icon}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          w-full
          pl-12 pr-4 py-4
          rounded-2xl
          border border-slate-200
          bg-slate-50
          text-slate-900
          outline-none
          transition-all
          focus:ring-2
          focus:ring-emerald-500
          focus:border-transparent
        "
      />
    </div>
  </div>
);

/* SELECT FIELD */

const SelectField = ({
  label,
  options,
  name,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: string[];
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  icon: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-3">
      {label}
    </label>

    <div className="relative">
      <div
        className="
          absolute
          left-4 top-1/2
          -translate-y-1/2
          text-slate-400
          z-10
        "
      >
        {icon}
      </div>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="
          w-full
          pl-12 pr-4 py-4
          rounded-2xl
          border border-slate-200
          bg-slate-50
          text-slate-900
          outline-none
          appearance-none
          transition-all
          focus:ring-2
          focus:ring-emerald-500
          focus:border-transparent
        "
      >
        <option value="">
          Select Gender
        </option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);