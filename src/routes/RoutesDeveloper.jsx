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
import SalesReports from "@/pages/developer/reports/sales-reports/SalesReports";
import StockLevels from "@/pages/developer/reports/stock-leves/StockLevels";
import Returns from "@/pages/developer/returns/Returns";
import SalesOrders from "@/pages/developer/sales-orders/SalesOrders";
import ProductOwner from "@/pages/developer/settings/ProductOwner";
import Roles from "@/pages/developer/settings/Roles";
import UsersAccount from "@/pages/developer/settings/UsersAccount";
import PurchaseOrder from "@/pages/developer/suppliers/PurchaseOrder";
import Suppliers from "@/pages/developer/suppliers/Suppliers";
import ProtectedRouteUser from "@/pages/login/ProtectedRouteUser";

export const routesDeveloper = [
  {
    path: `${devNavUrl}/developer/dashboard`,
    element: (
      <ProtectedRouteUser>
        <Dashboard />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/products`,
    element: (
      <ProtectedRouteUser>
        <Products />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/stock-overview`,
    element: (
      <ProtectedRouteUser>
        <StockOverview />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/movement-history`,
    element: (
      <ProtectedRouteUser>
        <MovementHistory />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/customers`,
    element: (
      <ProtectedRouteUser>
        <Customers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/sales-orders`,
    element: (
      <ProtectedRouteUser>
        <SalesOrders />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/returns`,
    element: (
      <ProtectedRouteUser>
        <Returns />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/finance-overview`,
    element: (
      <ProtectedRouteUser>
        <FinanceOverview />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/cash-sales`,
    element: (
      <ProtectedRouteUser>
        <CashSales />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/accounts-receivable`,
    element: (
      <ProtectedRouteUser>
        <AccountsReceivable />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/expenses`,
    element: (
      <ProtectedRouteUser>
        <Expenses />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/accounts-payable`,
    element: (
      <ProtectedRouteUser>
        <AccountsPayable />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/sales-journal`,
    element: (
      <ProtectedRouteUser>
        <SalesJournal />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/sales-reports`,
    element: (
      <ProtectedRouteUser>
        <SalesReports />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/stock-levels`,
    element: (
      <ProtectedRouteUser>
        <StockLevels />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/low-stock`,
    element: (
      <ProtectedRouteUser>
        <LowStock />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/inventory-movement`,
    element: (
      <ProtectedRouteUser>
        <InventoryMovement />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/profit-&-loss`,
    element: (
      <ProtectedRouteUser>
        <ProfitAddLoss />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/AR-report`,
    element: (
      <ProtectedRouteUser>
        <ArReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/AP-report`,
    element: (
      <ProtectedRouteUser>
        <ApReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/expenses-report`,
    element: (
      <ProtectedRouteUser>
        <ExpensesReport />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/overdue-payments`,
    element: (
      <ProtectedRouteUser>
        <OverduePayments />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/users`,
    element: (
      <ProtectedRouteUser>
        <UsersAccount />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/roles`,
    element: (
      <ProtectedRouteUser>
        <Roles />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/product-owner`,
    element: (
      <ProtectedRouteUser>
        <ProductOwner />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/suppliers`,
    element: (
      <ProtectedRouteUser>
        <Suppliers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/purchase-orders`,
    element: (
      <ProtectedRouteUser>
        <PurchaseOrder />
      </ProtectedRouteUser>
    ),
  },
];
