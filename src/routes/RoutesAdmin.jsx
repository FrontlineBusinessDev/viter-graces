import { devNavUrl } from "@/config/config";
import Customers from "@/pages/developer/customers/Customers";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
import AccountsPayable from "@/pages/developer/finance/accounts-payable/AccountsPayable";
import AccountsReceivable from "@/pages/developer/finance/accounts-receivable/AccountsReceivable";
import CashSales from "@/pages/developer/finance/cash-sales/CashSales";
import Expenses from "@/pages/developer/finance/expenses/Expenses";
import FinanceOverview from "@/pages/developer/finance/finance-overview/FinanceOverview";
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
import ProductOwner from "@/pages/developer/settings/ProductOwner";
import UsersAccount from "@/pages/developer/settings/UsersAccount";
import PurchaseOrder from "@/pages/developer/suppliers/PurchaseOrder";
import PurchaseOrderMovement from "@/pages/developer/suppliers/PurchaseOrderMovement";
import Suppliers from "@/pages/developer/suppliers/Suppliers";
import ProtectedRouteUser from "@/pages/login/ProtectedRouteUser";

export const routesAdmin = [
  {
    path: `${devNavUrl}/admin/dashboard`,
    element: (
      <ProtectedRouteUser>
        <Dashboard />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/products`,
    element: (
      <ProtectedRouteUser>
        <Products />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/stock-overview`,
    element: (
      <ProtectedRouteUser>
        <StockOverview />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/movement-history`,
    element: (
      <ProtectedRouteUser>
        <MovementHistory />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/customers`,
    element: (
      <ProtectedRouteUser>
        <Customers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/sales-orders`,
    element: (
      <ProtectedRouteUser>
        <SalesOrders />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/returns`,
    element: (
      <ProtectedRouteUser>
        <Returns />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/finance-overview`,
    element: (
      <ProtectedRouteUser>
        <FinanceOverview />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/cash-sales`,
    element: (
      <ProtectedRouteUser>
        <CashSales />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/accounts-receivable`,
    element: (
      <ProtectedRouteUser>
        <AccountsReceivable />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/expenses`,
    element: (
      <ProtectedRouteUser>
        <Expenses />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/accounts-payable`,
    element: (
      <ProtectedRouteUser>
        <AccountsPayable />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/sales-journal`,
    element: (
      <ProtectedRouteUser>
        <SalesJournal />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/sales-reports`,
    element: (
      <ProtectedRouteUser>
        <SalesReports />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/stock-levels`,
    element: (
      <ProtectedRouteUser>
        <StockLevels />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/low-stock`,
    element: (
      <ProtectedRouteUser>
        <LowStock />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/inventory-movement`,
    element: (
      <ProtectedRouteUser>
        <InventoryMovement />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/profit-&-loss`,
    element: (
      <ProtectedRouteUser>
        <ProfitAddLoss />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/AR-report`,
    element: (
      <ProtectedRouteUser>
        <ArReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/AP-report`,
    element: (
      <ProtectedRouteUser>
        <ApReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/expenses-report`,
    element: (
      <ProtectedRouteUser>
        <ExpensesReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/overdue-payments`,
    element: (
      <ProtectedRouteUser>
        <OverduePayments />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/returns-reports`,
    element: (
      <ProtectedRouteUser>
        <ReturnsReports />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/users`,
    element: (
      <ProtectedRouteUser>
        <UsersAccount />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/product-owner`,
    element: (
      <ProtectedRouteUser>
        <ProductOwner />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/suppliers`,
    element: (
      <ProtectedRouteUser>
        <Suppliers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/purchase-orders`,
    element: (
      <ProtectedRouteUser>
        <PurchaseOrder />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/admin/purchase-movement-history`,
    element: (
      <ProtectedRouteUser>
        <PurchaseOrderMovement />
      </ProtectedRouteUser>
    ),
  },
];
