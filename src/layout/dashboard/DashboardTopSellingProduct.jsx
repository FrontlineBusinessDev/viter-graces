import ServerError from "@/components/ServerError";
import StatCard from "@/components/StatCard";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { AlertTriangle, TrendingUp, Trophy } from "lucide-react";
import { useMemo } from "react";

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
          title="Top Selling Product"
          value={result?.data[0]?.product_name}
          subtitle={`${isEmptyItem(valData?.qty, 0)} units sold`}
          extra={`₱${numberWithCommasToFixed(valData?.total_amount, 2)}`}
          icon={<Trophy className="text-yellow-500" size={20} />}
          iconBg="bg-yellow-100 dark:bg-[#281b17]"
          dataTestId="top-selling-card"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default DashboardTopSellingProduct;
