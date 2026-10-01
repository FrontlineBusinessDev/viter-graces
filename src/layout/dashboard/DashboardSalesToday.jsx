import ServerError from "@/components/ServerError";
import StatCard from "@/components/StatCard";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

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

  const valDataToday = useMemo(() => {
    return `${numberWithCommasToFixed(
      Number(result?.data?.[0]?.total_sales_today ?? 0),
      2,
    )}`;
  }, [result]);

  const valDataYesterday = useMemo(() => {
    return `${numberWithCommasToFixed(
      Number(result?.data?.[0]?.total_sales_yesterday ?? 0),
      2,
    )}`;
  }, [result]);
  return (
    <>
      {error ? (
        <ServerError />
      ) : (
        <StatCard
          title="Sales Today"
          value="₱******"
          subtitle="Yesterday: ₱******"
          flipContent={`₱${valDataToday}`}
          subTitleFlip={`Yesterday: ₱${valDataYesterday}`}
          flipBg="bg-green-100 dark:bg-green-900"
          icon={<TrendingUp className="text-green-600" size={20} />}
          iconBg="bg-green-100 dark:bg-[#082125]"
          dataTestId="sales-today-card"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default DashboardSalesToday;
