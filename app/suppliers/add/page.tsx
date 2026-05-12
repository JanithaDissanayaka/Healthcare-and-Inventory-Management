'use client';

import React, { useState } from 'react';

import {
  Building2,
  Mail,
  Phone,
  Tag,
  MapPin,
  FileText,
  Save,
  ShieldCheck,
} from 'lucide-react';

export default function AddSupplierPage() {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      supplierName: '',
      email: '',
      contact: '',
      category: '',
      address: '',
      notes: '',
      status: 'Active',
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

    setLoading(true);

    try {

      const res = await fetch(
        '/api/suppliers',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert(data.message);

        setFormData({
          supplierName: '',
          email: '',
          contact: '',
          category: '',
          address: '',
          notes: '',
          status: 'Active',
        });

      } else {

        alert(data.error);

      }

    } catch (error) {

      console.error(error);

      alert('Error adding supplier');

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
          hover:shadow-md
          transition
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
              <Building2
                className="text-emerald-600"
                size={28}
              />
            </div>

            {/* TEXT */}
            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Add Supplier
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Register healthcare suppliers and vendors.
              </p>

            </div>

          </div>

        </div>

        {/* FORM */}
        <div className="p-6 lg:p-10">

          <form
            onSubmit={handleSubmit}
            className="space-y-10"
          >

            {/* BASIC DETAILS */}
            <section>

              <div className="flex items-center gap-3 mb-6">

                <ShieldCheck
                  size={18}
                  className="text-emerald-600"
                />

                <h3 className="text-lg font-bold text-slate-900">
                  Supplier Information
                </h3>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* SUPPLIER NAME */}
                <InputField
                  label="Supplier Name"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  placeholder="MedPharma Ltd"
                  icon={<Building2 size={18} />}
                />

                {/* EMAIL */}
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@supplier.com"
                  icon={<Mail size={18} />}
                />

                {/* CONTACT */}
                <InputField
                  label="Phone Number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+94 77 123 4567"
                  icon={<Phone size={18} />}
                />

                {/* CATEGORY */}
                <SelectField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  icon={<Tag size={18} />}
                  options={[
                    'Pharmaceuticals',
                    'Biologics',
                    'PPE & Equipment',
                    'IV Fluids',
                    'Laboratory',
                  ]}
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

                {/* STATUS */}
                <SelectField
                  label="Supplier Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  icon={<ShieldCheck size={18} />}
                  options={[
                    'Active',
                    'Review',
                    'Inactive',
                  ]}
                />

                {/* NOTES */}
                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Notes
                  </label>

                  <div className="relative">

                    <div
                      className="
                        absolute
                        left-4 top-4
                        text-slate-400
                      "
                    >
                      <FileText size={18} />
                    </div>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Additional supplier information..."
                      className="
                        w-full
                        pl-12 pr-4 py-4
                        rounded-2xl
                        border border-slate-200
                        bg-white
                        text-slate-900
                        outline-none
                        transition-all
                        focus:ring-2
                        focus:ring-emerald-500
                        focus:border-transparent
                        h-32
                        resize-none
                      "
                    />

                  </div>

                </div>

              </div>

            </section>

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
                  ? 'Adding Supplier...'
                  : 'Add Supplier'}

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
  type = "text",
  placeholder = "",
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
          bg-white
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
          bg-white
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
          Select Option
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

  </div>
);