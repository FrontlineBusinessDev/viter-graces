import GraphTooltip from "@/components/GraphTooltip";
import MiniStatCard from "@/components/MiniStatCard";
import { apiVersion } from "@/config/config";
import useDarkMode from "@/custom-hooks/useDarkMode";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React, { useMemo } from "react";
import {
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardProfitAndLoss = () => {
  const { store } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;
  const [timeframePL, setTimeframePL] = React.useState("weekly");
  const { darkMode } = useDarkMode();

  const {
    isLoading,
    isFetching,
    error,
    data: dataResult,
  } = useQueryData(
    `${apiVersion}/dashboard/read-profit-loss-dashboard`, // endpoint
    "get", // method
    "dashboard/read-profit-loss-dashboard",
    {},
  );

  const profitAndLossData = useMemo(() => {
    if (!dataResult?.count) return [];
    return dataResult?.data[0];
  }, [dataResult]);

  const currentData = profitAndLossData[timeframePL];

  const summary = useMemo(() => {
    return (currentData || []).reduce(
      (acc, row) => ({
        income: acc.income + Number(row.income || 0),
        expenses: acc.expenses + Number(row.expenses || 0),
        net: acc.net + Number(row.net || 0),
      }),
      { income: 0, expenses: 0, net: 0 },
    );
  }, [currentData]);

  return (
    <>
      <div className="relative group">
        <div
          className="bg-white  dark:bg-gray-900 rounded-xl p-4 shadow"
          data-testid="profit-loss-chart"
        >
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-black text-sm dark:text-light">
              Profit & Loss
            </h2>
            <div className="flex gap-2">
              {["weekly", "monthly", "yearly"].map((frame) => (
                <button
                  key={frame}
                  onClick={() => setTimeframePL(frame)}
                  data-testid={`timeframePL-${frame.toLowerCase()}`}
                  className={`capitalize px-3 py-1 rounded-lg ${
                    timeframePL === frame
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <MiniStatCard
              icon={<DollarSign size={14} />}
              iconColor="text-blue-600 dark:text-blue-400"
              label="Net"
              amount={summary.net}
            />
            <MiniStatCard
              icon={<TrendingUp size={14} />}
              iconColor="text-green-600 dark:text-green-400"
              label="Income"
              amount={summary.income}
            />
            <MiniStatCard
              icon={<TrendingDown size={14} />}
              iconColor="text-red-600 dark:text-red-400"
              label="Expenses"
              amount={summary.expenses}
            />
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
      </div>
    </>
  );
};

export default DashboardProfitAndLoss;
