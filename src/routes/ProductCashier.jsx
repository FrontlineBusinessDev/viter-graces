import { devNavUrl } from "@/config/config";
import SalesOrders from "@/pages/developer/sales-orders/SalesOrders";
import ProtectedRouteUser from "@/pages/login/ProtectedRouteUser";

export const routesCashier = [
  {
    path: `${devNavUrl}/cashier/sales`,
    element: (
      <ProtectedRouteUser>
        <SalesOrders />
      </ProtectedRouteUser>
    ),
  },
];
