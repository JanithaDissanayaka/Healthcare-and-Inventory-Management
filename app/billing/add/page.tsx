'use client';

import React, { useMemo, useState } from 'react';

import {
  Wallet,
  User,
  CalendarDays,
  FileText,
  DollarSign,
  Plus,
  Trash2,
  Save,
  CreditCard,
  Receipt,
} from 'lucide-react';

type InvoiceItem = {
  description: string;
  amount: number;
};

export default function AddBillingPage() {

  const [loading, setLoading] =
    useState(false);

  const [patient, setPatient] =
    useState('');

  const [billingDate, setBillingDate] =
    useState('');

  const [status, setStatus] =
    useState('Pending');

  const [items, setItems] =
    useState<InvoiceItem[]>([
      {
        description: '',
        amount: 0,
      },
    ]);

  // TOTAL
  const total = useMemo(() => {

    return items.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  }, [items]);

  // UPDATE ITEM
  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {

    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]:
        field === 'amount'
          ? Number(value)
          : value,
    };

    setItems(updated);
  };

  // ADD ITEM
  const addItem = () => {

    setItems([
      ...items,
      {
        description: '',
        amount: 0,
      },
    ]);
  };

  // REMOVE ITEM
  const removeItem = (index: number) => {

    if (items.length === 1) return;

    setItems(
      items.filter((_, i) => i !== index)
    );
  };

  // SUBMIT
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const payload = {
        patient,
        billingDate,
        status,
        total,
        items,
      };

      console.log(payload);

      // API CALL HERE

      alert('Invoice created successfully');

    } catch (error) {

      console.error(error);

      alert('Error creating invoice');

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
          max-w-6xl
          mx-auto
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
              <Wallet
                className="text-emerald-600"
                size={28}
              />
            </div>

            {/* TEXT */}
            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Create Invoice
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Generate billing invoices for healthcare services.
              </p>

            </div>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 lg:p-10 space-y-10"
        >

          {/* PATIENT DETAILS */}
          <section>

            <div className="flex items-center gap-3 mb-6">

              <User
                size={18}
                className="text-emerald-600"
              />

              <h3 className="text-lg font-bold text-slate-900">
                Patient Details
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* PATIENT */}
              <InputField
                label="Patient Name / ID"
                placeholder="Search patient..."
                value={patient}
                onChange={setPatient}
                icon={<User size={18} />}
              />

              {/* DATE */}
              <InputField
                label="Billing Date"
                type="date"
                value={billingDate}
                onChange={setBillingDate}
                icon={<CalendarDays size={18} />}
              />

            </div>

          </section>

          {/* INVOICE ITEMS */}
          <section>

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-3">

                <Receipt
                  size={18}
                  className="text-cyan-600"
                />

                <h3 className="text-lg font-bold text-slate-900">
                  Invoice Items
                </h3>

              </div>

              {/* ADD BUTTON */}
              <button
                type="button"
                onClick={addItem}
                className="
                  flex items-center gap-2
                  px-4 py-2
                  rounded-2xl
                  bg-emerald-50
                  hover:bg-emerald-100
                  text-emerald-700
                  font-semibold
                  transition
                "
              >
                <Plus size={18} />

                Add Item

              </button>

            </div>

            <div className="space-y-5">

              {items.map((item, index) => (

                <div
                  key={index}
                  className="
                    p-5
                    rounded-3xl
                    border border-slate-200
                    bg-slate-50
                  "
                >

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">

                    {/* DESCRIPTION */}
                    <div className="md:col-span-7">

                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Service Description
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
                          <FileText size={18} />
                        </div>

                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder="Cardiology consultation"
                          className="
                            w-full
                            pl-12 pr-4 py-4
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            outline-none
                            focus:ring-2
                            focus:ring-emerald-500
                          "
                        />

                      </div>

                    </div>

                    {/* AMOUNT */}
                    <div className="md:col-span-3">

                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Amount
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
                          <DollarSign size={18} />
                        </div>

                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            updateItem(
                              index,
                              'amount',
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          className="
                            w-full
                            pl-12 pr-4 py-4
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            outline-none
                            focus:ring-2
                            focus:ring-emerald-500
                          "
                        />

                      </div>

                    </div>

                    {/* REMOVE */}
                    <div className="md:col-span-2">

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(index)
                        }
                        className="
                          w-full
                          flex items-center justify-center gap-2
                          py-4
                          rounded-2xl
                          bg-red-50
                          hover:bg-red-100
                          text-red-600
                          font-semibold
                          transition
                        "
                      >
                        <Trash2 size={18} />

                        Remove

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </section>

          {/* SUMMARY */}
          <section
            className="
              rounded-3xl
              border border-slate-200
              bg-slate-50
              p-8
            "
          >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              {/* TOTAL */}
              <div>

                <p className="text-sm text-slate-500">
                  Total Invoice Amount
                </p>

                <h2 className="text-5xl font-bold text-emerald-600 mt-3">
                  ${total.toFixed(2)}
                </h2>

              </div>

              {/* STATUS */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Invoice Status
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
                    <CreditCard size={18} />
                  </div>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value)
                    }
                    className="
                      w-full
                      pl-12 pr-4 py-4
                      rounded-2xl
                      border border-slate-200
                      bg-white
                      outline-none
                      appearance-none
                      focus:ring-2
                      focus:ring-emerald-500
                    "
                  >

                    <option value="Draft">
                      Draft
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Paid">
                      Paid
                    </option>

                  </select>

                </div>

              </div>

            </div>

          </section>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 pt-2">

            {/* CREATE */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1
                flex items-center justify-center gap-3
                bg-emerald-600
                hover:bg-emerald-700
                text-white
                py-4
                rounded-2xl
                font-semibold
                transition
                disabled:opacity-70
              "
            >
              <Save size={20} />

              {loading
                ? 'Creating Invoice...'
                : 'Create Invoice'}

            </button>

            {/* CANCEL */}
            <button
              type="button"
              className="
                px-8
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
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* INPUT FIELD */

const InputField = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  icon,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
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
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          w-full
          pl-12 pr-4 py-4
          rounded-2xl
          border border-slate-200
          bg-white
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