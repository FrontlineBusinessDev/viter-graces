import GraphTooltip from "@/components/GraphTooltip";
import { AmountWithPesoSign, PesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import useDarkMode from "@/custom-hooks/useDarkMode";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  PhilippinePeso,
} from "lucide-react";
import React, { useMemo } from "react";
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardCashflowChart = () => {
  const { store } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;
  const [timeframeCF, setTimeframeCF] = React.useState("weekly");
  const { darkMode } = useDarkMode();

  const {
    isLoading,
    isFetching,
    error,
    data: dataResult,
  } = useQueryData(
    `${apiVersion}/dashboard/read-cashflow`, // endpoint
    "get", // method
    "dashboard/read-cashflow",
    {},
  );

  const cashflowData = useMemo(() => {
    if (!dataResult?.count) return [];
    return dataResult?.data[0];
  }, [dataResult]);

  const cashflowDataAmount = useMemo(() => {
    if (!dataResult?.count) return [];
    if (!dataResult?.data[0]["data"]) return [];

    return dataResult?.data[0]["data"]?.filter((item) =>
      item.label.includes(timeframeCF),
    );
  }, [dataResult]);

  const currentData = cashflowData[timeframeCF];

  return (
    <>
      <div className="relative group">
        <div
          className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow"
          data-testid="cashflow-chart"
        >
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold text-black text-sm dark:text-light">
              Cashflow
            </h2>
            <div className="flex gap-2">
              {["weekly", "monthly", "yearly"].map((frame) => (
                <button
                  key={frame}
                  onClick={() => setTimeframeCF(frame)}
                  data-testid={`timeframeCF-${frame.toLowerCase()}`}
                  className={`px-3 py-1 rounded-lg capitalize ${
                    timeframeCF === frame
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
            {cashflowDataAmount?.map((itemData) => (
              <>
                <div className="bg-green-100 dark:bg-green-700 p-3 rounded-lg">
                  <p className="xs:flex items-center gap-2 text-sm text-gray-600 dark:text-light">
                    <span className="text-green-600 dark:text-green-200">
                      <TrendingUp size={14} />
                    </span>
                    Money In
                  </p>
                  <p className="text-green-600 font-semibold">
                    <AmountWithPesoSign
                      classN={"size-3"}
                      amount={itemData?.in}
                    />
                  </p>
                </div>
                <div className="bg-red-100 dark:bg-red-700 p-3 rounded-lg">
                  <p className="xs:flex items-center gap-2 text-sm text-gray-600 dark:text-light">
                    <span className="text-red-600 dark:text-red-200">
                      <TrendingDown size={14} />
                    </span>
                    Money Out
                  </p>
                  <p className="text-red-600 font-semibold">
                    <AmountWithPesoSign
                      classN={"size-3"}
                      amount={itemData?.out}
                    />
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-700 p-3 rounded-lg">
                  <p className="xs:flex items-center gap-2 text-sm text-gray-600 dark:text-light">
                    <span className="text-blue-600 dark:text-blue-200">
                      <PhilippinePeso size={14} />
                    </span>
                    Balance
                  </p>
                  <p className="text-blue-600 font-semibold">
                    <AmountWithPesoSign
                      classN={"size-3"}
                      amount={itemData?.balance}
                    />
                  </p>
                </div>
              </>
            ))}
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={currentData} barCategoryGap="25%">
              <defs>
                <linearGradient
                  id="balanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
      </div>
    </>
  );
};

export default DashboardCashflowChart;
