import { devNavUrl } from "@/config/config";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
import Products from "@/pages/developer/products/Products";
import Roles from "@/pages/developer/settings/Roles";
import UsersAccount from "@/pages/developer/settings/UsersAccount";
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
];
