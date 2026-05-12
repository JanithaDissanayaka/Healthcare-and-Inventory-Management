'use client';

import React, { useState } from 'react';

import {
  User,
  Stethoscope,
  Phone,
  Award,
  Mail,
  MapPin,
  Save,
  BriefcaseMedical,
} from 'lucide-react';

export default function AddDoctorPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    email: '',
    address: '',
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

    setLoading(true);

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

      setFormData({
        name: '',
        specialization: '',
        phone: '',
        email: '',
        address: '',
        experience: '',
      });
    } catch (error) {
      console.error(error);

      alert('Error adding doctor');
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
        {/* TOP SECTION */}
        <div
          className="
            bg-white
            border-b border-slate-200
            px-8 py-7
            relative
          "
        >
          {/* DECORATION */}
          <div
            className="
              absolute
              right-10 top-6
              h-24 w-24
              rounded-full
              bg-cyan-50
            "
          ></div>

          <div
            className="
              absolute
              right-24 top-14
              h-14 w-14
              rounded-full
              bg-emerald-50
            "
          ></div>

          <div className="relative flex items-center gap-5">
            {/* ICON */}
            <div
              className="
                h-16 w-16
                rounded-2xl
                bg-cyan-50
                border border-cyan-100
                flex items-center justify-center
              "
            >
              <BriefcaseMedical
                className="text-cyan-600"
                size={28}
              />
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Doctor Registration
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Register new doctors into the healthcare system.
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
              <InputField
                label="Doctor Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={<User size={18} />}
                placeholder="Dr. John Doe"
              />

              <InputField
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                icon={<Stethoscope size={18} />}
                placeholder="Cardiology"
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<Phone size={18} />}
                placeholder="+94 77 123 4567"
              />

              <InputField
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail size={18} />}
                placeholder="doctor@email.com"
                type="email"
              />

              <InputField
                label="Experience Years"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                icon={<Award size={18} />}
                placeholder="10"
                type="number"
              />

              <InputField
                label="Clinic Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                icon={<MapPin size={18} />}
                placeholder="Colombo, Sri Lanka"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="
                  flex-1
                  flex items-center justify-center gap-3
                  bg-cyan-600
                  hover:bg-cyan-700
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
                  ? 'Adding Doctor...'
                  : 'Add Doctor'}
              </button>

              {/* RESET */}
              <button
                type="reset"
                onClick={() =>
                  setFormData({
                    name: '',
                    specialization: '',
                    phone: '',
                    email: '',
                    address: '',
                    experience: '',
                  })
                }
                className="
                  flex-1
                  py-4
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  hover:bg-slate-50
                  text-slate-700
                  font-semibold
                  transition
                "
              >
                Reset Form
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
  name,
  value,
  onChange,
  icon,
  placeholder,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
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
          focus:ring-cyan-500
          focus:border-transparent
        "
      />
    </div>
  </div>
);