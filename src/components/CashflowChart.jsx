import useDarkMode from "@/custom-hooks/useDarkMode";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import {
  Area,
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GraphTooltip from "./GraphTooltip";

const cashflowData = {
  Weekly: [
    { label: "Mon", in: 6000, out: 2500, balance: 8000 },
    { label: "Tue", in: 14000, out: 6000, balance: 5000 },
    { label: "Wed", in: 5000, out: 7000, balance: 13000 },
    { label: "Thu", in: 4500, out: 8000, balance: 12000 },
    { label: "Fri", in: 13000, out: 5000, balance: 3000 },
    { label: "Sat", in: 12000, out: 1500, balance: 6000 },
    { label: "Sun", in: 4000, out: 7000, balance: 4500 },
  ],
  Monthly: [
    { label: "Jan", in: 14000, out: 6000, balance: 5000 },
    { label: "Feb", in: 4000, out: 7000, balance: 4500 },
    { label: "Mar", in: 4500, out: 8000, balance: 12000 },
    { label: "Apr", in: 14000, out: 6000, balance: 5000 },
    { label: "May", in: 12000, out: 1500, balance: 6000 },
    { label: "Jun", in: 4500, out: 8000, balance: 12000 },
    { label: "Jul", in: 4000, out: 7000, balance: 4500 },
    { label: "Aug", in: 14000, out: 6000, balance: 5000 },
    { label: "Sep", in: 14000, out: 6000, balance: 5000 },
    { label: "Oct", in: 14000, out: 6000, balance: 5000 },
    { label: "Nov", in: 4500, out: 8000, balance: 12000 },
    { label: "Dec", in: 12000, out: 1500, balance: 6000 },
  ],
  Yearly: [
    { label: "2020", in: 12000, out: 1500, balance: 6000 },
    { label: "2021", in: 4500, out: 8000, balance: 12000 },
    { label: "2022", in: 14000, out: 6000, balance: 5000 },
    { label: "2023", in: 4000, out: 7000, balance: 4500 },
    { label: "2024", in: 4000, out: 7000, balance: 4500 },
    { label: "2025", in: 14000, out: 6000, balance: 5000 },
  ],
};

export default function CashflowChart() {
  const [timeframe, setTimeframe] = React.useState("Weekly");
  const { darkMode } = useDarkMode();

  const currentData = cashflowData[timeframe];

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-black text-sm dark:text-light">
            Cashflow
          </h2>
          <div className="flex gap-2">
            {["Weekly", "Monthly", "Yearly"].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeframe(frame)}
                className={`px-3 py-1 rounded-lg ${
                  timeframe === frame ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {frame}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-green-600">
                <TrendingUp size={14} />
              </span>
              Money In
            </p>
            <p className="text-green-600 font-semibold">₱58,724</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-red-600">
                <TrendingDown size={14} />
              </span>
              Money Out
            </p>
            <p className="text-red-600 font-semibold">₱35,840</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-blue-600">
                <DollarSign size={14} />
              </span>
              Balance
            </p>
            <p className="text-blue-600 font-semibold">₱22,884</p>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={currentData} barCategoryGap="25%">
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v) => `₱${v / 1000}k`} />
            <Tooltip content={<GraphTooltip darkMode={darkMode} />} />

            {/* Bars */}
            <Bar
              dataKey="in"
              name="Money In"
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="out"
              name="Money Out"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Legend verticalAlign="bottom" align="center" iconType="circle" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
