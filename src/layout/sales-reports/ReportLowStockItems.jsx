import FinanceStats from "@/components/FinanceStats";
import ServerError from "@/components/ServerError";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import React from "react";

const ReportLowStockItems = ({ path = "", filterColumns = [] }) => {
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

  const lowStockCount = useMemo(() => {
    if (!result?.count) return "0";

    return isEmptyItem(result?.data?.[0]?.data_count, "0");
  }, [result]);

  return (
    <>
      {error ? (
        <ServerError />
      ) : (
        <FinanceStats
          title="Low Stock Items"
          value={lowStockCount}
          icon={<TriangleAlert className="text-orange-600" size={20} />}
          iconBg="bg-orange-100 dark:bg-[#082125]"
          valueColor="text-orange-600"
          className="flex gap-3 items-start h-22!"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default ReportLowStockItems;
