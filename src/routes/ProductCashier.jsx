import { devNavUrl } from "@/config/config";
import AccountsReceivable from "@/pages/developer/finance/accounts-receivable/AccountsReceivable";
import CashSales from "@/pages/developer/finance/cash-sales/CashSales";
import FinanceReturns from "@/pages/developer/finance/returns/FinanceReturns";
import SalesOrders from "@/pages/developer/sales-orders/SalesOrders";
import ProtectedRouteUser from "@/pages/login/ProtectedRouteUser";

export const routesCashier = [
  {
    path: `${devNavUrl}/cashier/sales-orders`,
    element: (
      <ProtectedRouteUser>
        <SalesOrders />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/cashier/cash-sales`,
    element: (
      <ProtectedRouteUser>
        <CashSales />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/cashier/accounts-receivable`,
    element: (
      <ProtectedRouteUser>
        <AccountsReceivable />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/cashier/finance-returns`,
    element: (
      <ProtectedRouteUser>
        <FinanceReturns />
      </ProtectedRouteUser>
    ),
  },
];
