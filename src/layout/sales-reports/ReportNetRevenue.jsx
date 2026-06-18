import FinanceStats from "@/components/FinanceStats";
import ServerError from "@/components/ServerError";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { PhilippinePeso } from "lucide-react";
import { useMemo } from "react";

const ReportNetRevenue = ({
  path = "",
  id = 0,
  searchValue = "",
  filterColumns = [],
}) => {
  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    path !== "" ? `${apiVersion}/${path}` : null, // endpoint
    "post", // method
    `${path}`, // key
    { id: id, searchValue: "", columnFilters: filterColumns },
  );

  const lowStockCount = useMemo(() => {
    if (!result?.count) return "0";

    return isEmptyItem(result?.data?.[0]?.data_count, "0");
  }, [result]);

  return (
    <>
      {error ? (
        <ServerError />
      ) : (
        <FinanceStats
          title="Net Revenue"
          value={`₱${lowStockCount}`}
          icon={<PhilippinePeso className="text-green-600" size={20} />}
          iconBg="bg-green-100 dark:bg-[#082125]"
          valueColor="text-green-600"
          className="flex gap-3 items-start h-22!"
          loading={isLoading}
        />
      )}
    </>
  );
};

export default ReportNetRevenue;
