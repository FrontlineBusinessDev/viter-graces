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

const profitLossData = {
  Weekly: [
    { label: "Mon", income: 2000, expenses: 8000, net: -7000 },
    { label: "Tue", income: 6000, expenses: 9000, net: 15000 },
    { label: "Wed", income: 21000, expenses: 0, net: 5000 },
    { label: "Thu", income: 6000, expenses: 1000, net: 7000 },
    { label: "Fri", income: -1000, expenses: -2000, net: -7000 },
    { label: "Sat", income: 7000, expenses: 8000, net: 8000 },
    { label: "Sun", income: 14000, expenses: 1000, net: -7000 },
  ],
  Monthly: [
    { label: "Jan", income: 14000, expenses: 1000, net: -7000 },
    { label: "Feb", income: 7000, expenses: 8000, net: 8000 },
    { label: "Mar", income: -1000, expenses: -2000, net: -7000 },
    { label: "Apr", income: 6000, expenses: 1000, net: 7000 },
    { label: "May", income: 21000, expenses: 0, net: 5000 },
    { label: "Jun", income: 6000, expenses: 9000, net: 15000 },
    { label: "Jul", income: 6000, expenses: 9000, net: 15000 },
    { label: "Aug", income: 2000, expenses: 8000, net: -7000 },
    { label: "Sep", income: 6000, expenses: 1000, net: 7000 },
    { label: "Oct", income: 14000, expenses: 1000, net: -7000 },
    { label: "Nov", income: 6000, expenses: 9000, net: 15000 },
    { label: "Dec", income: 6000, expenses: 1000, net: 7000 },
  ],
  Yearly: [
    { label: "2020", income: 6000, expenses: 1000, net: 7000 },
    { label: "2021", income: 14000, expenses: 1000, net: -7000 },
    { label: "2022", income: 21000, expenses: 0, net: 5000 },
    { label: "2023", income: 7000, expenses: 8000, net: 8000 },
    { label: "2024", income: 6000, expenses: 9000, net: 15000 },
    { label: "2025", income: 6000, expenses: 1000, net: 7000 },
  ],
};

export default function ProfitLossChart() {
  const [timeframe, setTimeframe] = React.useState("Weekly");
  const { darkMode } = useDarkMode();

  const currentData = profitLossData[timeframe];

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-black text-sm dark:text-light">
            Profit & Loss
          </h2>
          <div className="flex gap-2">
            {["Weekly", "Monthly", "Yearly"].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeframe(frame)}
                className={`px-3 py-1 rounded-lg ${
                  timeframe === frame ? "bg-primary text-white" : "bg-gray-200"
                }`}
              >
                {frame}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-blue-600">
                <DollarSign size={14} />
              </span>
              Net
            </p>
            <p className="text-blue-600 font-semibold">₱85,097</p>
          </div>
          <div className="bg-green-100 p-3 rounded">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-600">
                <TrendingUp size={14} />
              </span>
              Income
            </p>
            <p className="text-green-600 font-semibold">₱145,301</p>
          </div>
          <div className="bg-red-100 p-3 rounded">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-red-600">
                <TrendingDown size={14} />
              </span>
              Expenses
            </p>
            <p className="text-red-600 font-semibold">₱60,204</p>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={currentData}>
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v) => `₱${v / 1000}k`} />
            <Tooltip content={<GraphTooltip darkMode={darkMode} />} />

            {/* Dashed Lines */}
            <Line
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#22C55E"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="#2563EB"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Legend verticalAlign="bottom" align="center" iconType="square" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
