import ServerError from "@/components/ServerError";
import StatCard from "@/components/StatCard";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { AlertTriangle, TrendingUp, Trophy } from "lucide-react";

const DashboardTopSellingProduct = ({ path = "", id = 0 }) => {
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
          title="Top Selling Product"
          value="--"
          subtitle="0 units sold"
          extra="₱0.00"
          icon={<Trophy className="text-yellow-500" size={20} />}
          iconBg="bg-yellow-100 dark:bg-[#281b17]"
          dataTestId="top-selling-card"
        />
      ) : result?.count > 0 ? (
        <StatCard
          title="Top Selling Product"
          value={result?.data[0]?.product_name}
          subtitle={`${isEmptyItem(result?.data[0]?.qty, 0)} units sold`}
          extra={`₱${numberWithCommasToFixed(result?.data[0]?.total_amount, 2)}`}
          icon={<Trophy className="text-yellow-500" size={20} />}
          iconBg="bg-yellow-100 dark:bg-[#281b17]"
          dataTestId="top-selling-card"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DashboardTopSellingProduct;
