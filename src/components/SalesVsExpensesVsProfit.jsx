import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import {
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GraphTooltip from "./GraphTooltip";
import useDarkMode from "@/custom-hooks/useDarkMode";

const SalesVsExpensesVsProfitData = {
  Weekly: [
    { label: "Mon", profit: 2000, expenses: 8000, revenue: -7000 },
    { label: "Tue", profit: 6500, expenses: 9000, revenue: 15000 },
    { label: "Wed", profit: 21000, expenses: 0, revenue: 5000 },
    { label: "Thu", profit: 6500, expenses: 1000, revenue: 7000 },
    { label: "Fri", profit: -1000, expenses: -2000, revenue: -7000 },
    { label: "Sat", profit: 7000, expenses: 8000, revenue: 8000 },
    { label: "Sun", profit: 14000, expenses: 1000, revenue: -7000 },
  ],
  Monthly: [
    { label: "Jan", profit: 14000, expenses: 1000, revenue: -7000 },
    { label: "Feb", profit: 7000, expenses: 8000, revenue: 8000 },
    { label: "Mar", profit: -1000, expenses: -2000, revenue: -7000 },
    { label: "Apr", profit: 6500, expenses: 1000, revenue: 7000 },
    { label: "May", profit: 21000, expenses: 0, revenue: 5000 },
    { label: "Jun", profit: 6000, expenses: 9000, revenue: 15000 },
    { label: "Jul", profit: 6500, expenses: 9000, revenue: 15000 },
    { label: "Aug", profit: 2000, expenses: 8000, revenue: -7000 },
    { label: "Sep", profit: 6500, expenses: 1000, revenue: 7000 },
    { label: "Oct", profit: 14000, expenses: 1000, revenue: -7000 },
    { label: "Nov", profit: 6000, expenses: 9000, revenue: 15000 },
    { label: "Dec", profit: 6000, expenses: 1000, revenue: 7000 },
  ],
  Yearly: [
    { label: "2020", profit: 6000, expenses: 1000, revenue: 7000 },
    { label: "2021", profit: 14000, expenses: 1000, revenue: -7000 },
    { label: "2022", profit: 21000, expenses: 0, revenue: 5000 },
    { label: "2023", profit: 7000, expenses: 8000, revenue: 8000 },
    { label: "2024", profit: 6000, expenses: 9000, revenue: 15000 },
    { label: "2025", profit: 6000, expenses: 1000, revenue: 7000 },
  ],
};

export default function SalesVsExpensesVsProfit() {
  const [timeframe, setTimeframe] = React.useState("Weekly");
  const { darkMode } = useDarkMode();

  const currentData = SalesVsExpensesVsProfitData[timeframe];

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-black text-sm dark:text-light">
            Sales vs Expenses vs Profit
          </h2>
          <div className="flex gap-2">
            {["Weekly", "Monthly", "Yearly"].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeframe(frame)}
                className={`px-3 py-1 rounded-lg ${
                  timeframe === frame
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {frame}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={currentData}>
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v) => `₱${v / 1000}k`} />
            <Tooltip content={<GraphTooltip darkMode={darkMode} />} />

            {/* Lines */}
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#22C55E"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
            />
            <Legend verticalAlign="bottom" align="center" iconType="square" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
