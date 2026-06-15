import ServerError from "@/components/ServerError";
import StatCard from "@/components/StatCard";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { AlertTriangle, TrendingUp } from "lucide-react";

const DashboardSalesToday = ({ path = "", id = 0 }) => {
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
          title="Sales Today"
          value="₱******"
          subtitle="Yesterday: ₱******"
          flipContent="₱0.00"
          subTitleFlip="Yesterday: ₱0.00"
          flipBg="bg-green-100 dark:bg-green-900"
          icon={<TrendingUp className="text-green-600" size={20} />}
          iconBg="bg-green-100 dark:bg-[#082125]"
          dataTestId="sales-today-card"
        />
      ) : result?.count > 0 ? (
        <StatCard
          title="Sales Today"
          value="₱******"
          subtitle="Yesterday: ₱******"
          flipContent={`₱${numberWithCommasToFixed(
            result?.data[0]?.total_sales,
            2,
          )}`}
          subTitleFlip={`Yesterday: ₱${numberWithCommasToFixed(
            result?.data[1]?.total_sales,
            2,
          )}`}
          flipBg="bg-green-100 dark:bg-green-900"
          icon={<TrendingUp className="text-green-600" size={20} />}
          iconBg="bg-green-100 dark:bg-[#082125]"
          dataTestId="sales-today-card"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DashboardSalesToday;
