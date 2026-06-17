import CashflowChart from "@/components/CashflowChart";
import ProfitLossChart from "@/components/ProfitLossChart";
import StatCard from "@/components/StatCard";
import DashboardExpensesToday from "@/layout/dashboard/DashboardExpensesToday";
import DashboardLowStockAlert from "@/layout/dashboard/DashboardLowStockAlert";
import DashboardOverduePayments from "@/layout/dashboard/DashboardOverduePayments";
import DashboardRecentActivities from "@/layout/dashboard/DashboardRecentActivities";
import DashboardSalesOverview from "@/layout/dashboard/DashboardSalesOverview";
import DashboardSalesToday from "@/layout/dashboard/DashboardSalesToday";
import DashboardTopSellingProduct from "@/layout/dashboard/DashboardTopSellingProduct";
import HeaderNav from "@/layout/headers/HeaderNav";
import { setTabValue } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { PhilippinePeso } from "lucide-react";
import React from "react";
const Dashboard = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch(setTabValue(""));
  }, []);

  return (
    <>
      <div data-testid="dashboard-page">
        <HeaderNav menu={"dashboard"}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardSalesToday path="sales-order/read-sales-today" />
            <DashboardLowStockAlert path="stock-movement/read-count-low-stock" />
            <DashboardTopSellingProduct path="sales-order/read-top-selling-product" />
            <DashboardExpensesToday path="purchase-order/read-expenses-today" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr_1fr] gap-6 py-6 ">
            <DashboardSalesOverview />
            <DashboardOverduePayments />
            <DashboardRecentActivities />
          </div>

          <div className="grid xl:grid-cols-2 gap-6 ">
            <CashflowChart />
            <ProfitLossChart />
          </div>
        </HeaderNav>
      </div>
    </>
  );
};

export default Dashboard;
