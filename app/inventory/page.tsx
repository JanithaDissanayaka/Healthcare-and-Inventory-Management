'use client';

import {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Package,
  AlertTriangle,
  ShieldAlert,
  Search,
  Boxes,
  CalendarDays,
  Truck,
} from 'lucide-react';

type InventoryItem = {
  ITEM_ID: number;
  ITEM_NAME: string;
  CATEGORY: string;
  QUANTITY: number;
  UNIT: string;
  EXPIRY_DATE: string;
  SUPPLIER_NAME: string;
  STATUS: string;
};

export default function InventoryPage() {

  const [items, setItems] =
    useState<InventoryItem[]>([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {

    try {

      const res = await fetch(
        '/api/inventory'
      );

      const data = await res.json();

      setItems(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const filteredItems = useMemo(() => {

    return items.filter((item) =>

      item.ITEM_NAME
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.CATEGORY
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.SUPPLIER_NAME
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );

  }, [items, search]);

  const getStatusStyle = (
    status: string
  ) => {

    switch (status) {

      case 'Critical':
        return 'bg-red-100 text-red-700';

      case 'Low':
        return 'bg-amber-100 text-amber-700';

      default:
        return 'bg-emerald-100 text-emerald-700';
    }
  };

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-lg font-medium">
          Loading inventory...
        </div>
      </div>
    );

  }

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
              <Boxes
                className="text-emerald-600"
                size={28}
              />
            </div>

            {/* TEXT */}
            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Inventory Management
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Monitor hospital medicine and equipment stock.
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
              placeholder="Search inventory..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
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
                    Total Items
                  </p>

                  <h2 className="text-4xl font-bold text-slate-900 mt-3">
                    {items.length}
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
                  <Package
                    className="text-emerald-600"
                    size={24}
                  />
                </div>

              </div>

            </div>

            {/* LOW */}
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
                    Low Stock
                  </p>

                  <h2 className="text-4xl font-bold text-amber-600 mt-3">
                    {
                      items.filter(
                        (i) => i.STATUS === 'Low'
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

            {/* CRITICAL */}
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
                    Critical Stock
                  </p>

                  <h2 className="text-4xl font-bold text-red-600 mt-3">
                    {
                      items.filter(
                        (i) => i.STATUS === 'Critical'
                      ).length
                    }
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
                  <ShieldAlert
                    className="text-red-600"
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
              Inventory Records
            </h2>

            <p className="text-slate-500 mt-1">
              Complete medicine and equipment stock
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
            {filteredItems.length} Items
          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Item
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Category
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Quantity
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Expiry Date
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Supplier
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredItems.length > 0 ? (

                filteredItems.map((item) => (

                  <tr
                    key={item.ITEM_ID}
                    className="
                      border-t border-slate-100
                      hover:bg-slate-50
                      transition
                    "
                  >

                    {/* ITEM */}
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
                          {item.ITEM_NAME?.charAt(0)}
                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900">
                            {item.ITEM_NAME}
                          </h3>

                          <p className="text-sm text-slate-500">
                            ID #{item.ITEM_ID}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CATEGORY */}
                    <td className="p-5 text-slate-700">
                      {item.CATEGORY}
                    </td>

                    {/* QUANTITY */}
                    <td className="p-5">

                      <div className="font-semibold text-slate-900">
                        {item.QUANTITY} {item.UNIT}
                      </div>

                    </td>

                    {/* EXPIRY */}
                    <td className="p-5">

                      <div className="flex items-center gap-2 text-slate-700">

                        <CalendarDays
                          size={16}
                          className="text-slate-400"
                        />

                        {item.EXPIRY_DATE?.split('T')[0]}

                      </div>

                    </td>

                    {/* SUPPLIER */}
                    <td className="p-5">

                      <div className="flex items-center gap-2 text-slate-700">

                        <Truck
                          size={16}
                          className="text-slate-400"
                        />

                        {item.SUPPLIER_NAME}

                      </div>

                    </td>

                    {/* STATUS */}
                    <td className="p-5">

                      <span
                        className={`
                          px-3 py-1
                          rounded-full
                          text-xs font-semibold
                          ${getStatusStyle(item.STATUS)}
                        `}
                      >
                        {item.STATUS}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center p-16"
                  >

                    <div
                      className="
                        h-20 w-20
                        rounded-full
                        bg-slate-100
                        flex items-center justify-center
                        mx-auto mb-5
                      "
                    >
                      <Boxes
                        className="text-slate-400"
                        size={36}
                      />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      No Inventory Found
                    </h3>

                    <p className="text-slate-500 mt-2">
                      No inventory records available.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}