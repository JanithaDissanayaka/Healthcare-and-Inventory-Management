'use client';

import {
  useEffect,
  useState
} from 'react';

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

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {

    try {

      const res = await fetch(
        '/api/inventory'
      );

      const data = await res.json();

      setItems(data);

    } catch (error) {

      console.error(error);

    }
  };

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

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

          <div className="text-sm text-slate-500">
            Total Items
          </div>

          <div className="text-4xl font-bold mt-2">
            {items.length}
          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

          <div className="text-sm text-slate-500">
            Low Stock
          </div>

          <div className="text-4xl font-bold mt-2 text-amber-600">
            {
              items.filter(
                (i) => i.STATUS === 'Low'
              ).length
            }
          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

          <div className="text-sm text-slate-500">
            Critical Stock
          </div>

          <div className="text-4xl font-bold mt-2 text-red-600">
            {
              items.filter(
                (i) => i.STATUS === 'Critical'
              ).length
            }
          </div>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Item
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Expiry
              </th>

              <th className="p-4 text-left">
                Supplier
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {items.map((item) => (

              <tr
                key={item.ITEM_ID}
                className="hover:bg-slate-50"
              >

                <td className="p-4 font-semibold">
                  {item.ITEM_NAME}
                </td>

                <td className="p-4">
                  {item.CATEGORY}
                </td>

                <td className="p-4">
                  {item.QUANTITY} {item.UNIT}
                </td>

                <td className="p-4">
                  {item.EXPIRY_DATE?.split('T')[0]}
                </td>

                <td className="p-4">
                  {item.SUPPLIER_NAME}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.STATUS)}`}
                  >
                    {item.STATUS}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}