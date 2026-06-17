import ServerError from "@/components/ServerError";
import StatCard from "@/components/StatCard";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { PhilippinePeso } from "lucide-react";
import { useMemo } from "react";

const DashboardExpensesToday = ({ path = "", id = 0 }) => {
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
    if (!result?.count) return "0.00";

    return `${numberWithCommasToFixed(result?.data[0]?.total_expenses, 2)}`;
  }, [result]);

  const valDataYesterday = useMemo(() => {
    if (!result?.count == 1) return "0.00";

    return `${numberWithCommasToFixed(result?.data[1]?.total_expenses, 2)}`;
  }, [result]);
  return (
    <>
      {error ? (
        <ServerError />
      ) : (
        <StatCard
          title="Expenses Today"
          value="₱******"
          subtitle="Yesterday: ₱******"
          flipContent={`₱${valDataToday}`}
          subTitleFlip={`Yesterday: ₱${valDataYesterday}`}
          flipBg="bg-red-100 dark:bg-red-900"
          icon={<PhilippinePeso className="text-red-500" size={20} />}
          iconBg="bg-red-100 dark:bg-[#2a1019]"
          dataTestId="expenses-card"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default DashboardExpensesToday;
