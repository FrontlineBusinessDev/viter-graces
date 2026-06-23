import { devNavUrl } from "@/config/config";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
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
];
