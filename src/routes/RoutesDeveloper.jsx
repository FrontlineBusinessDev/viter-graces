import { devNavUrl } from "@/config/config";
import Customers from "@/pages/developer/customers/Customers";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
import FinanceOverview from "@/pages/developer/finance/finance-overview/FinanceOverview";
import MovementHistory from "@/pages/developer/inventory/MovementHistory";
import {
  default as Inventory,
  default as StockOverview,
} from "@/pages/developer/inventory/StockOverview";
import Products from "@/pages/developer/products/Products";
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
      // <ProtectedRouteUser>
      <Products />
      // </ProtectedRouteUser>
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
      // <ProtectedRouteUser>
      <Returns />
      // </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/developer/finance-overview`,
    element: (
      // <ProtectedRouteUser>
      <FinanceOverview />
      // </ProtectedRouteUser>
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
