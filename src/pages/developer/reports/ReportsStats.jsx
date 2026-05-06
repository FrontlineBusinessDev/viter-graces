import FinanceStats from "@/components/FinanceStats";
import {
  Banknote,
  ChartNoAxesColumn,
  ChartNoAxesColumnIncreasing,
  DollarSign,
  PhilippinePeso,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import React from "react";

const ReportsStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      <FinanceStats
        title="Total Orders"
        value="13"
        icon={<ChartNoAxesColumn className="text-blue-600" size={20} />}
        iconBg="bg-blue-100 dark:bg-[#082125]"
        valueColor="text-blue-600"
        className="flex gap-3 items-start h-22!"
      />
      <FinanceStats
        title="Low Stock Items"
        value="2"
        icon={<TriangleAlert className="text-orange-600" size={20} />}
        iconBg="bg-orange-100 dark:bg-[#082125]"
        valueColor="text-orange-600"
        className="flex gap-3 items-start h-22!"
      />
      <FinanceStats
        title="Total Returns"
        value="2"
        icon={<RotateCcw className="text-purple-600" size={20} />}
        iconBg="bg-purple-100 dark:bg-[#082125]"
        valueColor="text-purple-600"
        className="flex gap-3 items-start h-22!"
      />
      <FinanceStats
        title="Net Revenue"
        value="₱6,798.00"
        icon={<PhilippinePeso className="text-green-600" size={20} />}
        iconBg="bg-green-100 dark:bg-[#082125]"
        valueColor="text-green-600"
        className="flex gap-3 items-start h-22!"
      />
      <FinanceStats
        title="Total Sales"
        value="₱20,000.00"
        icon={
          <ChartNoAxesColumnIncreasing className="text-blue-600" size={20} />
        }
        iconBg="bg-blue-100 dark:bg-[#082125]"
        valueColor="text-blue-600"
        className="flex gap-3 items-start h-22!"
      />
    </div>
  );
};

export default ReportsStats;
