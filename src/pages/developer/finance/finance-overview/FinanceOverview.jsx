import FinanceStats from "@/components/FinanceStats";
import SalesVsExpensesVsProfit from "@/components/SalesVsExpensesVsProfit";
import HeaderNav from "@/layout/headers/HeaderNav";
import {
  Banknote,
  TrendingDown,
  TrendingUp
} from "lucide-react";

const FinanceOverview = () => {
  return (
    <>
      <HeaderNav menu={"finance"} activeTab="finance-overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <FinanceStats
            title="Total Revenue"
            value="₱6,722.00"
            icon={<TrendingUp className="text-green-600" size={20} />}
            iconBg="bg-green-100 dark:bg-[#082125]"
            valueColor="text-green-600"
            className="flex flex-col justify-between items-start"
          />
          <FinanceStats
            title="Total Expenses"
            value="₱11,630.00"
            icon={<TrendingDown className="text-red-600" size={20} />}
            iconBg="bg-red-100 dark:bg-[#082125]"
            valueColor="text-red-600"
            className="flex flex-col justify-between items-start"
          />
          <FinanceStats
            title="Net Profit"
            value="₱-4,908.00"
            icon={<Banknote className="text-red-600" size={20} />}
            iconBg="bg-red-100 dark:bg-[#082125]"
            valueColor="text-red-600"
            className="flex flex-col justify-between items-start"
          />
          <FinanceStats
            title="Unpaid / Overdue"
            value="₱1,798.00"
            icon={<TrendingDown className="text-orange-600" size={20} />}
            iconBg="bg-orange-100 dark:bg-[#082125]"
            valueColor="text-orange-600"
            className="flex flex-col justify-between items-start"
          />
          {/* <FinanceStats
            title="Total"
            value="₱20,000.00"
            icon={<PhilippinePeso className="text-yellow-600" size={20} />}
            iconBg="bg-yellow-100 dark:bg-[#082125]"
            valueColor="text-yellow-600"
            className="flex flex-col justify-between items-start"
          /> */}
        </div>

        <div className="mt-4">
          <SalesVsExpensesVsProfit />
        </div>
      </HeaderNav>
    </>
  );
};

export default FinanceOverview;
