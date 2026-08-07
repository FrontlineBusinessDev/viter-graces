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

export default function SalesVsExpensesVsProfit({
  SalesVsExpensesVsProfitData,
  timeframe,
  setTimeframe,
}) {
  const { darkMode } = useDarkMode();

  const currentData = SalesVsExpensesVsProfitData[timeframe];

  console.log("SalesVsExpensesVsProfitData", SalesVsExpensesVsProfitData);
  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-black text-sm dark:text-light">
            Revenue vs Expenses vs Profit
          </h2>
          <div className="flex gap-2">
            {["weekly", "monthly", "yearly"].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeframe(frame)}
                className={`px-3 py-1 capitalize rounded-lg ${
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
