import { devNavUrl } from "@/config/config";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
import ProtectedRouteUser from "@/pages/login/ProtectedRouteUser";

export const routesCashier = [
  {
    path: `${devNavUrl}/cashier/dashboard`,
    element: (
      <ProtectedRouteUser>
        <Dashboard />
      </ProtectedRouteUser>
    ),
  },
];
