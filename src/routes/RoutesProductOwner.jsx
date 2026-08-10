import { devNavUrl } from "@/config/config";
import Customers from "@/pages/developer/customers/Customers";
import Dashboard from "@/pages/developer/dashboard/Dashboard";
import MovementHistory from "@/pages/developer/inventory/MovementHistory";
import StockOverview from "@/pages/developer/inventory/StockOverview";
import Products from "@/pages/developer/products/Products";
import Returns from "@/pages/developer/returns/Returns";
import SalesOrders from "@/pages/developer/sales-orders/SalesOrders";
import PurchaseOrder from "@/pages/developer/suppliers/PurchaseOrder";
import Suppliers from "@/pages/developer/suppliers/Suppliers";
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
  {
    path: `${devNavUrl}/product_owner/products`,
    element: (
      <ProtectedRouteUser>
        <Products />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/stock-overview`,
    element: (
      <ProtectedRouteUser>
        <StockOverview />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/movement-history`,
    element: (
      <ProtectedRouteUser>
        <MovementHistory />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/customers`,
    element: (
      <ProtectedRouteUser>
        <Customers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/suppliers`,
    element: (
      <ProtectedRouteUser>
        <Suppliers />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/purchase-orders`,
    element: (
      <ProtectedRouteUser>
        <PurchaseOrder />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/sales-orders`,
    element: (
      <ProtectedRouteUser>
        <SalesOrders />
      </ProtectedRouteUser>
    ),
  },
  {
    path: `${devNavUrl}/product_owner/returns`,
    element: (
      <ProtectedRouteUser>
        <Returns />
      </ProtectedRouteUser>
    ),
  },
];
