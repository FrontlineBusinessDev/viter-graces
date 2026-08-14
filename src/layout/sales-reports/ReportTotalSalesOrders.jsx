import FinanceStats from "@/components/FinanceStats";
import ServerError from "@/components/ServerError";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { ChartNoAxesColumn, PhilippinePeso, TrendingUp } from "lucide-react";
import React, { useMemo } from "react";

const ReportTotalSalesOrders = ({ path = "", filterColumns = [] }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const userId = ProductOwnerId(store);
  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    path !== "" ? `${apiVersion}/${path}` : null, // endpoint
    "post", // method
    `${path}`, // key
    { userId: userId, searchValue: "", columnFilters: filterColumns },
    { userId: userId, searchValue: "", columnFilters: filterColumns },
  );

  const valDataQty = useMemo(() => {
    if (!result?.count) return "0";

    return isEmptyItem(result?.data?.[0]?.total_qty, "0");
  }, [result]);

  const valDataTotalSales = useMemo(() => {
    if (!result?.count) return "0";

    return isEmptyItem(result?.data?.[0]?.total_sales, "0");
  }, [result]);

  const valDataNetRevenue = useMemo(() => {
    if (!result?.count) return "0";

    return isEmptyItem(result?.data?.[0]?.net_revenue, "0");
  }, [result]);

  console.log("valDataQty", valDataTotalSales);

  return (
    <>
      {error ? (
        <ServerError />
      ) : (
        <>
          <FinanceStats
            title="Total Orders qty"
            value={valDataQty}
            icon={<ChartNoAxesColumn className="text-blue-600" size={20} />}
            iconBg="bg-blue-100 dark:bg-[#082125]"
            valueColor="text-blue-600"
            className="flex gap-3 items-start h-22!"
            loading={isLoading}
          />
          <FinanceStats
            title="Total Sales"
            value={valDataTotalSales}
            amount={true}
            icon={<TrendingUp className="text-blue-600" size={20} />}
            iconBg="bg-blue-100 dark:bg-[#082125]"
            valueColor="text-blue-600"
            className="flex gap-3 items-start h-22!"
            loading={isLoading}
          />
          <FinanceStats
            title="Net Revenue"
            value={valDataNetRevenue}
            amount={true}
            icon={<PhilippinePeso className="text-green-600" size={20} />}
            iconBg="bg-green-100 dark:bg-[#082125]"
            valueColor="text-green-600"
            className="flex gap-3 items-start h-22!"
            loading={isLoading}
          />
        </>
      )}
    </>
  );
};

export default ReportTotalSalesOrders;
