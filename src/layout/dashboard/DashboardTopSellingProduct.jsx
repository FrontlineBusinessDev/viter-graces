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

  console.log("123", valData);

  return (
    <>
      {error ? (
        <ServerError />
      ) : (
        <StatCard
          title="Top Selling Product"
          value={isEmptyItem(valData?.product_name, "--")}
          subtitle={`${isEmptyItem(valData?.qty, 0)} units sold`}
          extra={`₱******`}
          subTitleFlip={`${isEmptyItem(valData?.qty, 0)} units sold`}
          flipContent={isEmptyItem(valData?.product_name, "--")}
          flipExtra={`₱${numberWithCommasToFixed(valData?.total_amount, 2)}`}
          flipBg="bg-green-100 dark:bg-green-900"
          icon={<Trophy className="text-yellow-500" size={20} />}
          iconBg="bg-green-100 dark:bg-[#082125]"
          dataTestId="sales-today-card"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default DashboardTopSellingProduct;
