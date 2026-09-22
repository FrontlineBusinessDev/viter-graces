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

  const toDateString = (date) => date.toISOString().slice(0, 10);

  const valDataToday = useMemo(() => {
    if (!result?.count) return "0.00";

    const today = toDateString(new Date());
    const row = result.data.find((row) => row.expenses_date === today);
    return `${numberWithCommasToFixed(row?.total_expenses ?? 0, 2)}`;
  }, [result]);

  const valDataYesterday = useMemo(() => {
    if (!result?.count) return "0.00";

    const yesterday = toDateString(new Date(Date.now() - 86400000));
    const row = result.data.find((row) => row.expenses_date === yesterday);
    return `${numberWithCommasToFixed(row?.total_expenses ?? 0, 2)}`;
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
          icon={<PhilippinePeso className="text-red-500" size={20} />}
          iconBg="bg-red-100 dark:bg-[#2a1019]"
          dataTestId="expenses-card"
          loading={isLoading}
          defaultVisible={true}
        />
      )}
    </>
  );
};

export default DashboardExpensesToday;
