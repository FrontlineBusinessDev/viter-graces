import ServerError from "@/components/ServerError";
import StatCard from "@/components/StatCard";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { PhilippinePeso } from "lucide-react";

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

  return (
    <>
      {error ? (
        <ServerError />
      ) : isLoading || isFetching || result?.count === 0 ? (
        <StatCard
          title="Expenses Today"
          value="₱******"
          subtitle="Yesterday: ₱******"
          flipContent="₱0.00"
          subTitleFlip="Yesterday: ₱0.00"
          flipBg="bg-red-100 dark:bg-red-900"
          icon={<PhilippinePeso className="text-red-500" size={20} />}
          iconBg="bg-red-100 dark:bg-[#2a1019]"
          dataTestId="expenses-card"
        />
      ) : result?.count > 0 ? (
        <StatCard
          title="Expenses Today"
          value="₱******"
          subtitle="Yesterday: ₱******"
          flipContent={`₱${numberWithCommasToFixed(result?.data[0]?.total_expenses, 2)}`}
          subTitleFlip={`Yesterday: ₱${numberWithCommasToFixed(result?.data[1]?.total_expenses, 2)}`}
          flipBg="bg-red-100 dark:bg-red-900"
          icon={<PhilippinePeso className="text-red-500" size={20} />}
          iconBg="bg-red-100 dark:bg-[#2a1019]"
          dataTestId="expenses-card"
        />
      ) : (
        ""
      )}
    </>
  );
};

export default DashboardExpensesToday;
