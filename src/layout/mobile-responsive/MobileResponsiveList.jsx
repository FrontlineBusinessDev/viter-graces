import APReportMobileResponsive from "./APReportMobileResponsive";
import CustomerMobileReponsive from "./CustomerMobileReponsive";
import ExpensesReportMobileResponsive from "./ExpensesReportMobileResponsive";
import FinanceAPMobileResponsive from "./FinanceAPMobileResponsive";
import FinanceARMobileResponsive from "./FinanceARMobileResponsive";
import FinanceCashSalesMobileResponsive from "./FinanceCashSalesMobileResponsive";
import FinanceExpensestMobileResponsive from "./FinanceExpensestMobileResponsive";
import InfiniteDefaultTableMobileCard from "./InfiniteDefaultTableMobileCard";
import MovementMobileResponsive from "./MovementMobileResponsive";
import ProductOwnerMobileReponsive from "./ProductOwnerMobileReponsive";
import ProductsMobileResponsive from "./ProductsMobileResponsive";
import PurchaseMovementMobileReponsive from "./PurchaseMovementMobileReponsive";
import PurchaseOrderMobileReponsive from "./PurchaseOrderMobileReponsive";
import ReportAccountReceivableMobileResponsive from "./ReportAccountReceivableMobileResponsive";
import ReportOverdueMobileResponsive from "./ReportOverdueMobileResponsive";
import ReturnsMobileReponsive from "./ReturnsMobileReponsive";
import RoleMobileReponsive from "./RoleMobileReponsive";
import SalesOrderMobileResponsive from "./SalesOrderMobileResponsive";
import SalesReportMobileResponsive from "./SalesReportMobileResponsive";
import StockOverviewMobileResponsive from "./StockOverviewMobileResponsive";
import SupplierMobileReponsive from "./SupplierMobileReponsive";
import UsersMobileReponsive from "./UsersMobileReponsive";

const MobileResponsiveList = ({
  rows,
  lastRowRef,
  setData = "",
  setItemEdit,
  setItemVal,
  isDefaultMobile = "",
  ishaveSubAdd = false,
}) => {
  return (
    <>
      {/* PRODUCT RESPONSIVE */}
      <ProductsMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        lastRowRef={lastRowRef}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* CUSTOMER RESPONSIVE */}
      <CustomerMobileReponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* STOCK OVERVIEW RESPONSIVE */}
      <StockOverviewMobileResponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* MOVEMENT HISTORY RESPONSIVE */}
      <MovementMobileResponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* MOVEMENT HISTORY RESPONSIVE */}
      <SalesReportMobileResponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* SALES ORDER RESPONSIVE */}
      <SalesOrderMobileResponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* SALES ORDER RESPONSIVE */}
      <ReturnsMobileReponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* SUPPLIER RESPONSIVE */}
      <SupplierMobileReponsive
        rows={rows}
        setItemEdit={setItemEdit}
        setItemVal={setItemVal}
        setData={setData}
        isDefaultMobile={isDefaultMobile}
      />
      {/* PURCHASE ORDER RESPONSIVE */}
      <PurchaseOrderMobileReponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        lastRowRef={lastRowRef}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* PURCHASE ORDER RESPONSIVE */}
      <PurchaseMovementMobileReponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        lastRowRef={lastRowRef}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* USERS RESPONSIVE */}
      <UsersMobileReponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* PRODUCT OWNER RESPONSIVE */}
      <ProductOwnerMobileReponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <ExpensesReportMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <FinanceCashSalesMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <ReportAccountReceivableMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <APReportMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <FinanceExpensestMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <FinanceARMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <FinanceAPMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* REPORT OVERDUE RESPONSIVE */}
      <ReportOverdueMobileResponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* ROLE RESPONSIVE */}
      <RoleMobileReponsive
        rows={rows}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
      {/* DEFAULT RESPONSIVE */}
      <InfiniteDefaultTableMobileCard
        rows={rows}
        lastRowRef={lastRowRef}
        setData={setData}
        setItemEdit={setItemEdit}
        isDefaultMobile={isDefaultMobile}
        ishaveSubAdd={ishaveSubAdd}
      />
    </>
  );
};

export default MobileResponsiveList;
