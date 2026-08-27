import { devNavUrl } from "@/config/config";
import Customers from "@/pages/developer/customers/Customers";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
import AccountsPayable from "@/pages/developer/finance/accounts-payable/AccountsPayable";
import AccountsReceivable from "@/pages/developer/finance/accounts-receivable/AccountsReceivable";
import CashSales from "@/pages/developer/finance/cash-sales/CashSales";
import Expenses from "@/pages/developer/finance/expenses/Expenses";
import FinanceOverview from "@/pages/developer/finance/finance-overview/FinanceOverview";
import FinanceReturns from "@/pages/developer/finance/returns/FinanceReturns";
import SalesJournal from "@/pages/developer/finance/sales-journal/SalesJournal";
import MovementHistory from "@/pages/developer/inventory/MovementHistory";
import StockOverview from "@/pages/developer/inventory/StockOverview";
import Products from "@/pages/developer/products/Products";
import ApReport from "@/pages/developer/reports/ap-report/ApReport";
import ArReport from "@/pages/developer/reports/ar-report/ArReport";
import ExpensesReport from "@/pages/developer/reports/expense-report/ExpensesReport";
import InventoryMovement from "@/pages/developer/reports/inventory-movement/InventoryMovement";
import LowStock from "@/pages/developer/reports/low-stock/LowStock";
import OverduePayments from "@/pages/developer/reports/overdue-payments/OverduePayments";
import ProfitAddLoss from "@/pages/developer/reports/profit-loss/ProfitAddLoss";
import ReturnsReports from "@/pages/developer/reports/returns-reports/ReturnsReports";
import SalesReports from "@/pages/developer/reports/sales-reports/SalesReports";
import StockLevels from "@/pages/developer/reports/stock-leves/StockLevels";
import Returns from "@/pages/developer/returns/Returns";
import SalesOrders from "@/pages/developer/sales-orders/SalesOrders";
import PurchaseOrder from "@/pages/developer/suppliers/PurchaseOrder";
import PurchaseOrderMovement from "@/pages/developer/suppliers/PurchaseOrderMovement";
import Suppliers from "@/pages/developer/suppliers/Suppliers";
import ProtectedRouteUser from "@/pages/login/ProtectedRouteUser";

export const routesProductOwner = [
  {
    path: `${devNavUrl}/product_owner/dashboard`,
    element: (
      <ProtectedRouteUser>
        <Dashboard />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/products`,
    element: (
      <ProtectedRouteUser>
        <Products />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/stock-overview`,
    element: (
      <ProtectedRouteUser>
        <StockOverview />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/movement-history`,
    element: (
      <ProtectedRouteUser>
        <MovementHistory />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/customers`,
    element: (
      <ProtectedRouteUser>
        <Customers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/suppliers`,
    element: (
      <ProtectedRouteUser>
        <Suppliers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/purchase-orders`,
    element: (
      <ProtectedRouteUser>
        <PurchaseOrder />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/sales-orders`,
    element: (
      <ProtectedRouteUser>
        <SalesOrders />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/returns`,
    element: (
      <ProtectedRouteUser>
        <Returns />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/purchase-movement-history`,
    element: (
      <ProtectedRouteUser>
        <PurchaseOrderMovement />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/finance-overview`,
    element: (
      <ProtectedRouteUser>
        <FinanceOverview />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/cash-sales`,
    element: (
      <ProtectedRouteUser>
        <CashSales />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/accounts-receivable`,
    element: (
      <ProtectedRouteUser>
        <AccountsReceivable />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/finance-returns`,
    element: (
      <ProtectedRouteUser>
        <FinanceReturns />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/expenses`,
    element: (
      <ProtectedRouteUser>
        <Expenses />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/accounts-payable`,
    element: (
      <ProtectedRouteUser>
        <AccountsPayable />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/sales-journal`,
    element: (
      <ProtectedRouteUser>
        <SalesJournal />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/sales-reports`,
    element: (
      <ProtectedRouteUser>
        <SalesReports />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/stock-levels`,
    element: (
      <ProtectedRouteUser>
        <StockLevels />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/low-stock`,
    element: (
      <ProtectedRouteUser>
        <LowStock />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/inventory-movement`,
    element: (
      <ProtectedRouteUser>
        <InventoryMovement />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/profit-&-loss`,
    element: (
      <ProtectedRouteUser>
        <ProfitAddLoss />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/AR-report`,
    element: (
      <ProtectedRouteUser>
        <ArReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/AP-report`,
    element: (
      <ProtectedRouteUser>
        <ApReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/expenses-report`,
    element: (
      <ProtectedRouteUser>
        <ExpensesReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/overdue-payments`,
    element: (
      <ProtectedRouteUser>
        <OverduePayments />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/returns-reports`,
    element: (
      <ProtectedRouteUser>
        <ReturnsReports />
      </ProtectedRouteUser>
    ),
  },
];
