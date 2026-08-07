import FinanceStats from "@/components/FinanceStats";
import SalesVsExpensesVsProfit from "@/components/SalesVsExpensesVsProfit";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion } from "@/config/config";
import HeaderNav from "@/layout/headers/HeaderNav";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { Banknote, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import React from "react";

const FinanceOverview = () => {
  const [timeframe, setTimeframe] = React.useState("weekly");
  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/finance-sales-journal/read-overview`, // endpoint
    "get", // method
    `read-profite-and-loss`, // key
    {},
  );

  const itemData = useMemo(() => {
    if (!result?.count) return [];

    return isEmptyItem(result?.data[0]?.amount[0], []);
  }, [result]);

  const itemGraph = useMemo(() => {
    if (!result?.count) return [];

    return isEmptyItem(result?.data[0]?.graph[0], []);
  }, [result]);

  const currentData = itemData[timeframe];
  return (
    <>
      <HeaderNav menu={"finance"} activeTab="finance-overview">
        {isLoading || isFetching ? (
          <>
            <TableLoading count={12} cols={4} />
            <br />
            <TableLoading count={12} cols={1} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <FinanceStats
                title="Total Revenue"
                value={`${isEmptyItem(currentData[0]?.revenue, 0)}`}
                icon={<TrendingUp className="text-green-600" size={20} />}
                iconBg="bg-green-100 dark:bg-[#082125]"
                valueColor="text-green-600"
                className="flex flex-col justify-between items-start"
              />
              <FinanceStats
                title="Total Expenses"
                value={`${isEmptyItem(currentData[0]?.expenses, 0)}`}
                icon={<TrendingDown className="text-red-600" size={20} />}
                iconBg="bg-red-100 dark:bg-[#082125]"
                valueColor="text-red-600"
                className="flex flex-col justify-between items-start"
              />
              <FinanceStats
                title="Net Profit"
                value={`${isEmptyItem(currentData[0]?.netProfit, 0)}`}
                icon={<Banknote className="text-blue-600" size={20} />}
                iconBg="bg-blue-100 dark:bg-[#082125]"
                valueColor="text-blue-600"
                className="flex flex-col justify-between items-start"
              />
              <FinanceStats
                title="Unpaid / Overdue"
                value={`${isEmptyItem(currentData[0]?.unpaid, 0)}`}
                icon={<TrendingDown className="text-orange-600" size={20} />}
                iconBg="bg-orange-100 dark:bg-[#082125]"
                valueColor="text-orange-600"
                className="flex flex-col justify-between items-start"
              />
            </div>

            <div className="mt-4">
              <SalesVsExpensesVsProfit
                SalesVsExpensesVsProfitData={itemGraph}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
              />
            </div>
          </>
        )}
      </HeaderNav>
    </>
  );
};

export default FinanceOverview;
