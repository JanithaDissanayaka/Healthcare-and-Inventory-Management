'use client';

import React, {
  useMemo,
  useState
} from 'react';

import {
  Truck,
  Search,
  Star,
  Mail,
  Phone,
  PackageCheck,
  ShieldCheck,
  AlertTriangle,
  Pencil,
  History,
  Building2,
} from 'lucide-react';

import StatusBadge from "@/app/components/StatusBadge";

const suppliers = [
  {
    id: 1,
    name: "MedPharma Ltd",
    email: "contact@medpharma.com",
    category: "Pharmaceuticals",
    contact: "+1-800-MEDPH",
    lastOrder: "Apr 20",
    ordersYtd: 24,
    rating: 4.8,
    status: "Active"
  },
  {
    id: 2,
    name: "BioMed Supplies",
    email: "sales@biomed.co",
    category: "Biologics",
    contact: "+1-800-BIOMED",
    lastOrder: "Apr 18",
    ordersYtd: 18,
    rating: 4.6,
    status: "Active"
  },
  {
    id: 3,
    name: "SafeGear Co.",
    email: "info@safegear.io",
    category: "PPE & Equipment",
    contact: "+1-800-SAFE",
    lastOrder: "Apr 12",
    ordersYtd: 31,
    rating: 4.4,
    status: "Active"
  },
  {
    id: 4,
    name: "FluidCare Inc.",
    email: "support@fluidcare.net",
    category: "IV Fluids",
    contact: "+1-800-FLUID",
    lastOrder: "Mar 28",
    ordersYtd: 9,
    rating: 4.7,
    status: "Review"
  },
];

export default function SuppliersPage() {

  const [searchTerm, setSearchTerm] =
    useState("");

  const filteredSuppliers = useMemo(() => {

    return suppliers.filter((s) =>

      s.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      s.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    );

  }, [searchTerm]);

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
              <Truck
                className="text-emerald-600"
                size={28}
              />
            </div>

            {/* TEXT */}
            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Supplier Management
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Manage healthcare suppliers and vendor relationships.
              </p>

            </div>

          </div>

        </div>

        {/* SEARCH + STATS */}
        <div className="p-6 lg:p-8">

          {/* SEARCH */}
          <div className="relative mb-8">

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
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="
                w-full lg:w-[350px]
                pl-11 pr-4 py-4
                rounded-2xl
                border border-slate-200
                bg-white
                outline-none
                focus:ring-2
                focus:ring-emerald-500
              "
            />

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* TOTAL */}
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
                    Total Suppliers
                  </p>

                  <h2 className="text-4xl font-bold text-slate-900 mt-3">
                    {suppliers.length}
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
                  <Building2
                    className="text-emerald-600"
                    size={24}
                  />
                </div>

              </div>

            </div>

            {/* ACTIVE */}
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
                    Active Suppliers
                  </p>

                  <h2 className="text-4xl font-bold text-emerald-600 mt-3">
                    {
                      suppliers.filter(
                        (s) => s.status === 'Active'
                      ).length
                    }
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
                  <ShieldCheck
                    className="text-emerald-600"
                    size={24}
                  />
                </div>

              </div>

            </div>

            {/* REVIEW */}
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
                    Needs Review
                  </p>

                  <h2 className="text-4xl font-bold text-amber-600 mt-3">
                    {
                      suppliers.filter(
                        (s) => s.status === 'Review'
                      ).length
                    }
                  </h2>

                </div>

                <div
                  className="
                    h-14 w-14
                    rounded-2xl
                    bg-amber-100
                    flex items-center justify-center
                  "
                >
                  <AlertTriangle
                    className="text-amber-600"
                    size={24}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div
        className="
          bg-white
          rounded-3xl
          border border-slate-200
          shadow-sm
          overflow-hidden
        "
      >

        {/* TABLE HEADER */}
        <div
          className="
            flex items-center justify-between
            p-6
            border-b border-slate-200
          "
        >

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Supplier Records
            </h2>

            <p className="text-slate-500 mt-1">
              Vendor information and procurement details
            </p>

          </div>

          <div
            className="
              px-4 py-2
              rounded-2xl
              bg-emerald-100
              text-emerald-700
              text-sm
              font-semibold
            "
          >
            {filteredSuppliers.length} Suppliers
          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50">

              <tr>

                {[
                  "Supplier",
                  "Category",
                  "Contact",
                  "Orders",
                  "Rating",
                  "Last Order",
                  "Status",
                  "Actions"
                ].map((h) => (

                  <th
                    key={h}
                    className="
                      text-left
                      p-5
                      text-sm
                      font-semibold
                      text-slate-600
                    "
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {filteredSuppliers.map((s) => (

                <tr
                  key={s.id}
                  className="
                    border-t border-slate-100
                    hover:bg-slate-50
                    transition
                  "
                >

                  {/* SUPPLIER */}
                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          h-12 w-12
                          rounded-2xl
                          bg-emerald-100
                          flex items-center justify-center
                          text-emerald-700
                          font-bold
                        "
                      >
                        {s.name.charAt(0)}
                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {s.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">

                          <Mail size={14} />

                          {s.email}

                        </div>

                      </div>

                    </div>

                  </td>

                  {/* CATEGORY */}
                  <td className="p-5 text-slate-700">
                    {s.category}
                  </td>

                  {/* CONTACT */}
                  <td className="p-5">

                    <div className="flex items-center gap-2 text-slate-700">

                      <Phone
                        size={15}
                        className="text-slate-400"
                      />

                      {s.contact}

                    </div>

                  </td>

                  {/* ORDERS */}
                  <td className="p-5">

                    <div className="flex items-center gap-2">

                      <PackageCheck
                        size={16}
                        className="text-slate-400"
                      />

                      <span className="font-semibold text-slate-900">
                        {s.ordersYtd}
                      </span>

                    </div>

                  </td>

                  {/* RATING */}
                  <td className="p-5">

                    <div className="flex items-center gap-1 font-semibold text-slate-900">

                      <Star
                        size={16}
                        className="text-amber-500 fill-amber-500"
                      />

                      {s.rating}

                    </div>

                  </td>

                  {/* LAST ORDER */}
                  <td className="p-5 text-slate-700">
                    {s.lastOrder}
                  </td>

                  {/* STATUS */}
                  <td className="p-5">
                    <StatusBadge status={s.status} />
                  </td>

                  {/* ACTIONS */}
                  <td className="p-5">

                    <div className="flex items-center gap-3">

                      <button
                        className="
                          flex items-center gap-2
                          px-4 py-2
                          rounded-xl
                          bg-emerald-50
                          hover:bg-emerald-100
                          text-emerald-700
                          text-sm
                          font-semibold
                          transition
                        "
                      >
                        <Pencil size={15} />

                        Edit
                      </button>

                      <button
                        className="
                          flex items-center gap-2
                          px-4 py-2
                          rounded-xl
                          bg-slate-100
                          hover:bg-slate-200
                          text-slate-700
                          text-sm
                          font-semibold
                          transition
                        "
                      >
                        <History size={15} />

                        History
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}