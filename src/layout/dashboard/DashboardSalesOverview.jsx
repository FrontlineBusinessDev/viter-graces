import GraphTooltip from "@/components/GraphTooltip";
import useDarkMode from "@/custom-hooks/useDarkMode";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const DashboardSalesOverview = () => {
  const [timeframe, setTimeframe] = React.useState("Weekly");
  const { darkMode, toggleDarkMode } = useDarkMode();

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

  const currentData = salesData[timeframe];

  return (
    <>
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
    </>
  );
};

export default DashboardSalesOverview;
