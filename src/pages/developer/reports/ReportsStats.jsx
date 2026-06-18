import ReportLowStockItems from "@/layout/sales-reports/ReportLowStockItems";
import ReportTotalReturns from "@/layout/sales-reports/ReportTotalReturns";
import ReportTotalSalesOrders from "@/layout/sales-reports/ReportTotalSalesOrders";

const ReportsStats = ({ searchValue = "", filterColumns }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      <ReportLowStockItems path="stock-movement/read-count-low-stock" />
      <ReportTotalReturns path="stock-movement/read-count-low-stock" />
      <ReportTotalSalesOrders
        path="report-sales-order/read-all-total-sales-amount"
        searchValue={searchValue}
        filterColumns={filterColumns}
      />
    </div>
  );
};

export default ReportsStats;
