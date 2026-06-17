import ServerError from "@/components/ServerError";
import StatCard from "@/components/StatCard";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

const DashboardLowStockAlert = ({ path = "", id = 0 }) => {
  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    path !== "" ? `${apiVersion}/${path}` : null, // endpoint
    "post", // method
    `${path}`, // key
    { id: id },
  );

  const valData = useMemo(() => {
    if (!result?.count) return [];
    return result?.data[0];
  }, [result]);
  return (
    <>
      {error ? (
        <ServerError />
      ) : (
        <StatCard
          title="Low Stock Alerts"
          value={isEmptyItem(valData?.data_count, "")}
          subtitle="products below threshold"
          button="Click to view →"
          link="low-stock"
          icon={<AlertTriangle className="text-orange-500" size={20} />}
          iconBg="bg-orange-100 dark:bg-[#291518]"
          dataTestId="low-stock-card"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default DashboardLowStockAlert;
