'use client';

import React, { useState } from 'react';

import {
  Package,
  Boxes,
  Save,
  DollarSign,
} from 'lucide-react';

export default function AddInventoryPage() {

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      itemName: '',
      quantity: '',
      unitPrice: '',
    });



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };



  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res =
        await fetch(
          '/api/inventory',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(
              formData
            ),
          }
        );

      const data =
        await res.json();

      if (res.ok) {

        alert(data.message);

        setFormData({
          itemName: '',
          quantity: '',
          unitPrice: '',
        });

      } else {

        alert(data.error);

      }

    } catch (error) {

      console.error(error);

      alert(
        'Error adding inventory'
      );

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

            <div
              className="
                h-16 w-16
                rounded-2xl
                bg-emerald-50
                border border-emerald-100
                flex items-center justify-center
              "
            >

              <Boxes
                className="text-emerald-600"
                size={28}
              />

            </div>

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Add Inventory Item
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Add medicine and equipment stock.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ITEM NAME */}
              <InputField
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Syringe"
                icon={<Package size={18} />}
              />



              {/* QUANTITY */}
              <InputField
                label="Quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="100"
                icon={<Boxes size={18} />}
              />



              {/* UNIT PRICE */}
              <InputField
  label="Unit Price (Rs.)"
  type="number"
  name="unitPrice"
  value={formData.unitPrice}
  onChange={handleChange}
  placeholder="250.00"
  icon={<span className="font-bold">Rs</span>}
/>

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
                  ? 'Adding Inventory...'
                  : 'Add Inventory Item'}

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
