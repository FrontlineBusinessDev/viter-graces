import CashflowChart from "@/components/CashflowChart";
import DashboardOverview from "@/components/DashboardCharts";
import ProfitLossChart from "@/components/ProfitLossChart";
import StatCard from "@/components/StatCard";
import HeaderNav from "@/layout/header/HeaderNav";
import { setTabValue } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import {
  AlertTriangle,
  PhilippinePeso,
  TrendingUp,
  Trophy,
} from "lucide-react";
import React from "react";
const Dashboard = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch(setTabValue(""));
  }, []);

  return (
    <>
      <HeaderNav menu={"dashboard"}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Sales Today"
            value="₱0.00"
            subtitle="Yesterday: ₱0.00"
            icon={<TrendingUp className="text-green-600" size={20} />}
            iconBg="bg-green-100 dark:bg-[#082125]"
          />

          <StatCard
            title="Low Stock Alerts"
            value="2"
            subtitle="products below threshold"
            button="Click to view →"
            link=""
            icon={<AlertTriangle className="text-orange-500" size={20} />}
            iconBg="bg-orange-100 dark:bg-[#291518]"
          />

          <StatCard
            title="Top Selling Product"
            value="iPhone 15 Pro"
            subtitle="2 units sold"
            extra="₱2,198.00"
            icon={<Trophy className="text-yellow-500" size={20} />}
            iconBg="bg-yellow-100 dark:bg-[#281b17]"
          />

          <StatCard
            title="Expenses Today"
            value="₱0.00"
            subtitle="Yesterday: ₱0.00"
            icon={<PhilippinePeso className="text-red-500" size={20} />}
            iconBg="bg-red-100 dark:bg-[#2a1019]"
          />
        </div>

        <DashboardOverview />

        <div className="grid xl:grid-cols-2 gap-6 ">
          <CashflowChart />
          <ProfitLossChart />
        </div>
      </HeaderNav>
    </>
  );
};

export default Dashboard;
