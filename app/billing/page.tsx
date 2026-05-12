'use client';

import {
  CreditCard,
  DollarSign,
  FileText,
  Send,
  CheckCircle2,
  Receipt,
  Wallet,
  AlertTriangle,
  Search,
} from 'lucide-react';

import StatusBadge from "@/app/components/StatusBadge";

const recentInvoices = [
  {
    id: "#INV-0420",
    patient: "J. Horowitz",
    amount: "$640",
    status: "Paid"
  },
  {
    id: "#INV-0419",
    patient: "P. Nair",
    amount: "$280",
    status: "Paid"
  },
  {
    id: "#INV-0418",
    patient: "R. Alvarez",
    amount: "$3,200",
    status: "Pending"
  },
  {
    id: "#INV-0417",
    patient: "E. Clarke",
    amount: "$195",
    status: "Paid"
  },
  {
    id: "#INV-0416",
    patient: "K. Thompson",
    amount: "$520",
    status: "Overdue"
  },
];

export default function BillingPage() {

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* TOP SECTION */}
      <div
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-sm
          overflow-hidden
          mb-8
        "
      >

        {/* HEADER */}
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
                Billing & Payments
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Manage hospital invoices, patient billing, and payments.
              </p>

            </div>

          </div>

        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 lg:p-8">

          {/* TOTAL INVOICES */}
          <div
            className="
              rounded-3xl
              border border-slate-200
              bg-slate-50
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Invoices
                </p>

                <h2 className="text-4xl font-bold text-slate-900 mt-3">
                  245
                </h2>

              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-emerald-100
                  flex items-center justify-center
                "
              >
                <Receipt
                  className="text-emerald-600"
                  size={24}
                />
              </div>

            </div>

          </div>

          {/* PAID */}
          <div
            className="
              rounded-3xl
              border border-slate-200
              bg-slate-50
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Paid Invoices
                </p>

                <h2 className="text-4xl font-bold text-emerald-600 mt-3">
                  198
                </h2>

              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-emerald-100
                  flex items-center justify-center
                "
              >
                <CheckCircle2
                  className="text-emerald-600"
                  size={24}
                />
              </div>

            </div>

          </div>

          {/* OVERDUE */}
          <div
            className="
              rounded-3xl
              border border-slate-200
              bg-slate-50
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Overdue
                </p>

                <h2 className="text-4xl font-bold text-red-600 mt-3">
                  12
                </h2>

              </div>

              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-red-100
                  flex items-center justify-center
                "
              >
                <AlertTriangle
                  className="text-red-600"
                  size={24}
                />
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div
          className="
            xl:col-span-2
            bg-white
            rounded-3xl
            border border-slate-200
            shadow-sm
            overflow-hidden
          "
        >

          {/* HEADER */}
          <div
            className="
              p-8
              border-b border-slate-200
              flex items-center justify-between
            "
          >

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Invoice Details
              </h2>

              <p className="text-slate-500 mt-1">
                Billing summary and payment processing
              </p>

            </div>

            <StatusBadge status="Pending" />

          </div>

          {/* BODY */}
          <div className="p-8">

            {/* INVOICE INFO */}
            <div
              className="
                rounded-3xl
                border border-slate-200
                bg-slate-50
                p-6
                mb-8
              "
            >

              <div className="flex items-center justify-between flex-wrap gap-6">

                <div>

                  <p className="text-sm text-slate-500">
                    Invoice ID
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 mt-2">
                    #INV-2025-0421
                  </h3>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Patient
                  </p>

                  <h3 className="text-lg font-semibold text-slate-900 mt-2">
                    Sarah Mitchell · #P-00124
                  </h3>

                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Due Amount
                  </p>

                  <h3 className="text-2xl font-bold text-emerald-600 mt-2">
                    $814.50
                  </h3>

                </div>

              </div>

            </div>

            {/* LINE ITEMS */}
            <div className="space-y-4 mb-8">

              {[
                {
                  label: "Consultation fee",
                  val: "$120.00"
                },
                {
                  label: "Cardiology procedure",
                  val: "$850.00"
                },
                {
                  label: "Medication (Amlodipine)",
                  val: "$34.50"
                },
                {
                  label: "Lab tests (lipid panel)",
                  val: "$210.00"
                },
                {
                  label: "Insurance deductible",
                  val: "-$400.00",
                  isNegative: true
                },
              ].map((item, i) => (

                <div
                  key={i}
                  className="
                    flex items-center justify-between
                    p-5
                    rounded-2xl
                    border border-slate-100
                    hover:bg-slate-50
                    transition
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        h-11 w-11
                        rounded-xl
                        bg-emerald-100
                        flex items-center justify-center
                      "
                    >
                      <FileText
                        className="text-emerald-600"
                        size={18}
                      />
                    </div>

                    <span className="text-slate-700 font-medium">
                      {item.label}
                    </span>

                  </div>

                  <span
                    className={`
                      font-bold text-lg
                      ${
                        item.isNegative
                          ? 'text-emerald-600'
                          : 'text-slate-900'
                      }
                    `}
                  >
                    {item.val}
                  </span>

                </div>

              ))}

            </div>

            {/* TOTAL */}
            <div
              className="
                flex items-center justify-between
                p-6
                rounded-3xl
                bg-slate-900
                text-white
                mb-8
              "
            >

              <div>

                <p className="text-slate-300 text-sm">
                  Total Due
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  $814.50
                </h2>

              </div>

              <DollarSign size={42} />

            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* MARK PAID */}
              <button
                className="
                  flex items-center justify-center gap-3
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                "
              >
                <CheckCircle2 size={20} />

                Mark as Paid

              </button>

              {/* SEND */}
              <button
                className="
                  flex items-center justify-center gap-3
                  bg-white
                  border border-slate-200
                  hover:bg-slate-50
                  text-slate-700
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                "
              >
                <Send size={20} />

                Send Invoice

              </button>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            bg-white
            rounded-3xl
            border border-slate-200
            shadow-sm
            overflow-hidden
          "
        >

          {/* HEADER */}
          <div
            className="
              p-6
              border-b border-slate-200
            "
          >

            <h3 className="text-2xl font-bold text-slate-900">
              Recent Invoices
            </h3>

            <p className="text-slate-500 mt-1">
              Latest billing records
            </p>

            {/* SEARCH */}
            <div className="relative mt-5">

              <Search
                size={18}
                className="
                  absolute
                  left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                placeholder="Search invoice..."
                className="
                  w-full
                  pl-11 pr-4 py-3
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

          {/* LIST */}
          <div className="p-4 space-y-3">

            {recentInvoices.map((inv) => (

              <div
                key={inv.id}
                className="
                  p-4
                  rounded-2xl
                  border border-slate-100
                  hover:bg-slate-50
                  transition
                  cursor-pointer
                "
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="font-bold text-slate-900">
                      {inv.id}
                    </div>

                    <div className="text-sm text-slate-500 mt-1">
                      {inv.patient}
                    </div>

                    <div className="mt-3">
                      <StatusBadge status={inv.status} />
                    </div>

                  </div>

                  <div className="text-right">

                    <div className="text-lg font-bold text-slate-900">
                      {inv.amount}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Invoice
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}