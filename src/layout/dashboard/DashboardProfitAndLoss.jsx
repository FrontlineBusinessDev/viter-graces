import GraphTooltip from "@/components/GraphTooltip";
import { AmountWithPesoSign } from "@/components/PesoSign";
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

  const profitAndLossDataAmount = useMemo(() => {
    if (!dataResult?.count) return [];
    if (!dataResult?.data[0]["data"]) return [];

    return dataResult?.data[0]["data"]?.filter((item) =>
      item.label.includes(timeframePL),
    );
  }, [dataResult]);

  const currentData = profitAndLossData[timeframePL];

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
            {profitAndLossDataAmount?.map((itemData) => (
              <>
                <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded">
                  <p className="xs:flex items-center gap-2 text-sm text-gray-600 dark:text-light">
                    <span className="text-blue-600 dark:text-blue-200">
                      <DollarSign size={14} />
                    </span>
                    Net
                  </p>
                  <p className="text-green-600 font-semibold">
                    <AmountWithPesoSign
                      classN={"size-3"}
                      amount={itemData?.net}
                    />
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-700 p-3 rounded">
                  <p className="xs:flex items-center gap-2 text-sm text-gray-600 dark:text-light">
                    <span className="text-green-600 dark:text-green-200">
                      <TrendingUp size={14} />
                    </span>
                    Income
                  </p>
                  <p className="text-red-600 font-semibold">
                    <AmountWithPesoSign
                      classN={"size-3"}
                      amount={itemData?.income}
                    />
                  </p>
                </div>
                <div className="bg-red-100 dark:bg-red-700 p-3 rounded">
                  <p className="xs:flex items-center gap-2 text-sm text-gray-600 dark:text-light">
                    <span className="text-red-600 dark:text-red-200">
                      <TrendingDown size={14} />
                    </span>
                    Expenses
                  </p>
                  <p className="text-blue-600 font-semibold">
                    <AmountWithPesoSign
                      classN={"size-3"}
                      amount={itemData?.expenses}
                    />
                  </p>
                </div>
              </>
            ))}
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
