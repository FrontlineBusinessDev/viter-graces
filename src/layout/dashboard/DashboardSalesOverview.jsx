import GraphTooltip from "@/components/GraphTooltip";
import useDarkMode from "@/custom-hooks/useDarkMode";
import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import WarningNoteForComingSoon from "../WarningNoteForComingSoon";
import { StoreContext } from "@/store/StoreContext";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
const DashboardSalesOverview = () => {
  const { store } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;
  const [timeframe, setTimeframe] = React.useState("weekly");
  const { darkMode, toggleDarkMode } = useDarkMode();

  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/sales-order/sales-overview-graph-value`, // endpoint
    "post", // method
  );

  const salesData = useMemo(() => {
    if (!result?.count) return [];
    return result?.data[0];
  }, [result]);

  const currentData = salesData[timeframe];

  return (
    <>
      <div className="relative group">
        <div
          className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow group"
          data-testid="sales-overview"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-black dark:text-light">
              Sales Overview
            </h2>
            <div className="flex gap-2">
              {["weekly", "monthly", "yearly"].map((frame) => (
                <button
                  key={frame}
                  onClick={() => setTimeframe(frame)}
                  data-testid={`timeframe-${frame.toLowerCase()}`}
                  className={`capitalize px-3 py-1 rounded-lg ${
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
                // strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default DashboardSalesOverview;
