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
  Trash2,
  PieChart as PieIcon,
  BarChart3,
  Wallet,
} from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

type InventoryItem = {
  ITEM_ID: number;
  ITEM_NAME: string;
  QUANTITY: number;
  UNIT_PRICE: number;
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




  const fetchInventory =
    async () => {

    try {

      const res =
        await fetch(
          '/api/inventory'
        );

      const data =
        await res.json();

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



  const filteredItems =
    useMemo(() => {

      return items.filter(
        (item) =>

          item.ITEM_NAME
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

      );

    }, [items, search]);



  // Pie chart: stock status distribution. The API only ever returns
  // STATUS as LOW STOCK / AVAILABLE — Out of Stock is derived here from
  // QUANTITY === 0, since no such status exists in the database itself.
  const STOCK_STATUS_COLORS: Record<string, string> = {
    'IN STOCK': '#10B981',
    'LOW STOCK': '#F59E0B',
    'OUT OF STOCK': '#F43F5E',
  };

  const stockStatusChartData = useMemo(() => {
    let outOfStock = 0;
    let lowStock = 0;
    let inStock = 0;

    items.forEach((item) => {
      const qty = Number(item.QUANTITY);
      if (qty <= 0) outOfStock += 1;
      else if (item.STATUS === 'LOW STOCK') lowStock += 1;
      else inStock += 1;
    });

    return [
      { name: 'In Stock', value: inStock },
      { name: 'Low Stock', value: lowStock },
      { name: 'Out of Stock', value: outOfStock },
    ].filter((row) => row.value > 0);
  }, [items]);

  // Bar chart: top items by quantity on hand
  const topItemsByQuantity = useMemo(() => {
    return [...items]
      .sort((a, b) => Number(b.QUANTITY) - Number(a.QUANTITY))
      .slice(0, 8)
      .map((item) => ({
        name: item.ITEM_NAME,
        quantity: Number(item.QUANTITY),
      }));
  }, [items]);

  // Bar chart: total stock value per item (quantity x unit price)
  const itemValueChartData = useMemo(() => {
    return [...items]
      .map((item) => ({
        name: item.ITEM_NAME,
        value: Number(item.QUANTITY) * Number(item.UNIT_PRICE),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [items]);



  const getStatusStyle =
    (status: string) => {

      switch (status) {

        case 'LOW STOCK':
          return
          'bg-red-100 text-red-700';

        default:
          return
          'bg-emerald-100 text-emerald-700';
      }
    };



  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-50
          flex items-center justify-center
        "
      >

        <div className="text-slate-600 text-lg font-medium">
          Loading inventory...
        </div>

      </div>
    );
  }



  return (

    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

      {/* TOP */}
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

          <div
            className="
              absolute
              right-10 top-6
              h-24 w-24
              rounded-full
              bg-emerald-50
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
                Inventory Management
              </h2>

              <p className="text-slate-500 mt-2 text-base">
                Monitor hospital stock and supplies.
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
                setSearch(
                  e.target.value
                )
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



          {/* STATS */}
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



            {/* LOW STOCK */}
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

                  <h2 className="text-4xl font-bold text-red-600 mt-3">

                    {
                      items.filter(
                        (i) =>
                          i.STATUS ===
                          'LOW STOCK'
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



            {/* AVAILABLE */}
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
                    Available
                  </p>

                  <h2 className="text-4xl font-bold text-emerald-600 mt-3">

                    {
                      items.filter(
                        (i) =>
                          i.STATUS ===
                          'AVAILABLE'
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

                  <AlertTriangle
                    className="text-emerald-600"
                    size={24}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ANALYTICS CHARTS GRID */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

          {/* STOCK STATUS DISTRIBUTION — PIE CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="text-emerald-600" size={20} />
              <h3 className="text-xl font-bold text-slate-900">Stock Status</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">In stock, low stock, and out of stock split</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stockStatusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stockStatusChartData.map((entry, index) => (
                    <Cell
                      key={`stock-status-cell-${index}`}
                      fill={STOCK_STATUS_COLORS[entry.name.toUpperCase()] || '#94A3B8'}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* TOP ITEMS BY QUANTITY — BAR CHART */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-cyan-600" size={20} />
              <h3 className="text-xl font-bold text-slate-900">Top Items by Quantity</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Highest units currently on hand</p>
            {topItemsByQuantity.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-16">No inventory data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topItemsByQuantity} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} angle={-15} textAnchor="end" height={50} />
                  <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#06B6D4" radius={[8, 8, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ITEM VALUE BREAKDOWN — BAR CHART */}
          <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 lg:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="text-orange-500" size={20} />
              <h3 className="text-xl font-bold text-slate-900">Item Value Breakdown</h3>
            </div>
            <p className="text-slate-500 text-sm mb-4">Total stock value (quantity × unit price), top items</p>
            {itemValueChartData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-16">No inventory data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(220, itemValueChartData.length * 44)}>
                <BarChart
                  data={itemValueChartData}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `${Number(v).toLocaleString()}`} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94A3B8"
                    fontSize={12}
                    width={140}
                    tickLine={false}
                  />
                  <Tooltip formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Stock Value']} />
                  <Bar dataKey="value" fill="#F97316" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>
      )}

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

        {/* HEADER */}
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
              Complete inventory stock
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

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Item
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Quantity
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Unit Price
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="text-left p-5 text-sm font-semibold text-slate-600">
                  Actions
                </th>

              </tr>

            </thead>



            <tbody>

              {filteredItems.map(
                (item) => (

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



                  {/* QUANTITY */}
                  <td className="p-5">

                    <div className="font-semibold text-slate-900">
                      {item.QUANTITY}
                    </div>

                  </td>



                  {/* PRICE */}
                  <td className="p-5">

                    <div className="font-semibold text-slate-900">
                      Rs. {item.UNIT_PRICE}
                    </div>

                  </td>



                  {/* STATUS */}
                  <td className="p-5">

                    <span
                      className={`
                        px-3 py-1
                        rounded-full
                        text-xs font-semibold
                        ${getStatusStyle(
                          item.STATUS
                        )}
                      `}
                    >
                      {item.STATUS}
                    </span>

                  </td>



                  {/* ACTIONS */}
                  <td className="p-5">

                    <button
                      onClick={async () => {

                        const confirmDelete =
                          confirm(
                            'Delete inventory item?'
                          );

                        if (!confirmDelete)
                          return;

                        try {

                          await fetch(
                            `/api/inventory/${item.ITEM_ID}`,
                            {
                              method:
                                'DELETE',
                            }
                          );

                          fetchInventory();

                        } catch (error) {

                          console.error(
                            error
                          );

                        }
                      }}
                      className="
                        flex items-center gap-2
                        px-4 py-2
                        rounded-xl
                        bg-red-100
                        text-red-700
                        hover:bg-red-200
                        transition
                      "
                    >

                      <Trash2
                        size={16}
                      />

                      Delete

                    </button>

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