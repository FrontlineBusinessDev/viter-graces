import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import StatCard from "@/components/StatCard";
import StatCardLoader from "@/components/StatCardLoader";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { AlertTriangle } from "lucide-react";

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
  return (
    <>
      {error ? (
        <ServerError />
      ) : isLoading || isFetching || result?.count === 0 ? (
        <StatCard
          title="Low Stock Alerts"
          value="0"
          subtitle="products below threshold"
          button="Click to view →"
          link="low-stock"
          icon={<AlertTriangle className="text-orange-500" size={20} />}
          iconBg="bg-orange-100 dark:bg-[#291518]"
          dataTestId="low-stock-card"
          loading={isLoading || isFetching}
        />
      ) : result?.count > 0 ? (
        <StatCard
          title="Low Stock Alerts"
          value={isEmptyItem(result?.data[0]?.data_count, "")}
          subtitle="products below threshold"
          button="Click to view →"
          link="low-stock"
          icon={<AlertTriangle className="text-orange-500" size={20} />}
          iconBg="bg-orange-100 dark:bg-[#291518]"
          dataTestId="low-stock-card"
          loading={isLoading || isFetching}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DashboardLowStockAlert;
