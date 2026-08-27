import { devNavUrl } from "@/config/config";
import CashSales from "@/pages/developer/finance/cash-sales/CashSales";
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
];
