import useDarkMode from "@/custom-hooks/useDarkMode";
import { LineChart, TrendingDown } from "lucide-react";
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GraphTooltip from "./GraphTooltip";

const salesData = {
  Weekly: [
    { label: "Mon", value: 2700 },
    { label: "Tue", value: 3400 },
    { label: "Wed", value: 900 },
    { label: "Thu", value: 1800 },
    { label: "Fri", value: 2900 },
    { label: "Sat", value: 2300 },
    { label: "Sun", value: 2600 },
  ],
  Monthly: [
    { label: "Jan", value: 50000 },
    { label: "Feb", value: 42000 },
    { label: "Mar", value: 61000 },
    { label: "Apr", value: 58000 },
    { label: "May", value: 72000 },
    { label: "Jun", value: 69000 },
    { label: "Jul", value: 75000 },
    { label: "Aug", value: 80000 },
    { label: "Sep", value: 77000 },
    { label: "Oct", value: 82000 },
    { label: "Nov", value: 90000 },
    { label: "Dec", value: 95000 },
  ],
  Yearly: [
    { label: "2020", value: 50000 },
    { label: "2021", value: 42000 },
    { label: "2022", value: 61000 },
    { label: "2023", value: 58000 },
    { label: "2024", value: 72000 },
    { label: "2025", value: 69000 },
  ],
};

const dashboardData = {
  sales: [
    { day: "Mon", value: 2700 },
    { day: "Tue", value: 3400 },
    { day: "Wed", value: 900 },
    { day: "Thu", value: 1800 },
    { day: "Fri", value: 2900 },
    { day: "Sat", value: 2300 },
    { day: "Sun", value: 2600 },
  ],
  overduePayments: [
    {
      name: "Carol Williams",
      order: "ORD-003",
      date: "Jan 15, 2026",
      amount: 699,
    },
    {
      name: "Juan Dela Cruz",
      order: "ORD-013",
      date: "Jan 18, 2026",
      amount: 2599,
    },
    {
      name: "Robert Samson",
      order: "ORD-018",
      date: "Feb 5, 2026",
      amount: 12599,
    },
  ],
  recentActivities: [
    {
      text: "Return RET-107750 processed for Alice Johnson",
      type: "returns",
      daysAgo: 3,
    },
    { text: "New order ORD-046703 for ₱1099.00", type: "sales", daysAgo: 3 },
    { text: "New order ORD-790400 for ₱348.00", type: "sales", daysAgo: 3 },
    { text: "New order ORD-226456 for ₱1099.00", type: "sales", daysAgo: 3 },
    {
      text: "Return RET-906687 processed for Alice Johnson",
      type: "returns",
      daysAgo: 3,
    },
    { text: "New order ORD-609406 for $1999.00", type: "sales", daysAgo: 4 },
  ],
};

export default function DashboardOverview() {
  const [timeframe, setTimeframe] = React.useState("Weekly");
  const { darkMode, toggleDarkMode } = useDarkMode();

  const currentData = salesData[timeframe];

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr_1fr] gap-6 py-6 ">
        {/* Sales Overview */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-black dark:text-light">
              Sales Overview
            </h2>
            <div className="flex gap-2">
              {["Weekly", "Monthly", "Yearly"].map((frame) => (
                <button
                  key={frame}
                  onClick={() => setTimeframe(frame)}
                  className={`px-3 py-1 rounded-lg ${
                    timeframe === frame
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={currentData}>
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="label" />

              <YAxis tickFormatter={(value) => `₱${value}`} />

              <Tooltip content={<GraphTooltip darkMode={darkMode} />} />

              <Area
                name="Sales"
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#blueGradient)"
                //   strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow relative">
          <h2 className="flex gap-2 items-center font-semibold text-sm text-red-600 mb-4">
            <TrendingDown size={16} /> Overdue Payments
          </h2>
          <ul className="space-y-3 min-h-[300px]">
            {dashboardData.overduePayments.map((payment, idx) => (
              <li key={idx} className="flex justify-between">
                <div>
                  <span className="font-medium text-xs text-black dark:text-light">
                    {payment.name} -{" "}
                    <span className="text-gray-500">{payment.order}</span>
                  </span>
                  <p className="text-gray-500 text-sm">{payment.date}</p>
                </div>
                <span className="text-red-600 font-semibold">
                  ₱{payment.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="absolute bottom-3 text-orange-500 pt-3 inline-block"
          >
            Click to view →
          </a>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <h2 className="font-semibold text-sm mb-4 text-black dark:text-light">
            Recent Activities
          </h2>
          <ul className="space-y-3">
            {dashboardData.recentActivities.map((activity, idx) => (
              <li key={idx} className="flex flex-col">
                <div className="flex items-center gap-3">
                  <p>
                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block mr-1"></span>
                    {activity.text}{" "}
                  </p>
                </div>
                <div className="flex gap-2 items-center ml-3">
                  <span
                    className={`px-1 rounded-full text-xs font-bold ${
                      activity.type === "sales"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-200"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-500 dark:text-orange-200"
                    }`}
                  >
                    {activity.type}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {activity.daysAgo} days ago
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
