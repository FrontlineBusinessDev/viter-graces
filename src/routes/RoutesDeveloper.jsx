import { devNavUrl } from "@/config/config";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
import Products from "@/pages/developer/products/Products";
import Roles from "@/pages/developer/settings/Roles";
import UsersAccount from "@/pages/developer/settings/UsersAccount";

export const routesDeveloper = [
  {
    path: `${devNavUrl}/dashboard`,
    element: <Dashboard />,
  },
  {
    path: `${devNavUrl}/products`,
    element: <Products />,
  },
  {
    path: `${devNavUrl}/users`,
    element: <UsersAccount />,
  },
  {
    path: `${devNavUrl}/roles`,
    element: <Roles />,
  },
];
