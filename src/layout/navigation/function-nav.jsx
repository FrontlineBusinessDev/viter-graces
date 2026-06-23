import { devNavUrl } from "@/config/config";
import { setIsSearch } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import {
  ChartColumn,
  DollarSign,
  LayoutDashboard,
  Leaf,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import React from "react";

export const getNavList = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;
  const onClickNav = () => {
    dispatch(setIsSearch(false));
  };

  let navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="size-5" />,
      menu: "dashboard",
      path: `${devNavUrl}/${userRole}/dashboard`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "developer"],
      title_tab: "",
    },
    {
      label: "Products",
      icon: <Package className="size-5" />,
      menu: "products",
      path: `${devNavUrl}/${userRole}/products`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "cashier", "developer"],
      title_tab: "",
    },
    {
      label: "Inventory",
      icon: <Warehouse className="size-5" />,
      menu: "inventory",
      path: `${devNavUrl}/${userRole}/stock-overview`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "developer"],
      title_tab: "",
    },
    {
      label: "Customers",
      icon: <Users className="size-5" />,
      menu: "customers",
      path: `${devNavUrl}/${userRole}/customers`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "cashier", "developer"],
      title_tab: "",
    },
    // {
    //   label: "Sales Orders",
    //   icon: <ShoppingCart className="size-5" />,
    //   menu: "sales orders",
    //   path: `${devNavUrl}/${userRole}/sales-orders`,
    //   isOpenSubmenu: "",
    //   on_click: onClickNav,
    //   subList: [],
    //   roles: ["admin", "product_owner", "cashier", "developer"],
    //   title_tab: "",
    // },
    // {
    //   label: "Returns",
    //   icon: <RotateCcw className="size-5" />,
    //   menu: "returns",
    //   path: `${devNavUrl}/${userRole}/returns`,
    //   isOpenSubmenu: "",
    //   on_click: onClickNav,
    //   subList: [],
    //   roles: ["admin", "product_owner", "cashier", "developer"],
    //   title_tab: "",
    // },
    // {
    //   label: "Finance",
    //   icon: <DollarSign className="size-5" />,
    //   menu: "finance",
    //   path: `${devNavUrl}/${userRole}/finance-overview`,
    //   isOpenSubmenu: "",
    //   on_click: onClickNav,
    //   subList: [],
    //   roles: ["admin", "product_owner", "developer"],
    //   title_tab: "",
    // },
    // {
    //   label: "Reports",
    //   icon: <ChartColumn className="size-5" />,
    //   menu: "reports",
    //   path: `${devNavUrl}/${userRole}/sales-reports`,
    //   isOpenSubmenu: "",
    //   on_click: onClickNav,
    //   subList: [],
    //   roles: ["admin", "product_owner", "cashier", "developer"],
    //   title_tab: "",
    // },
    {
      label: "Suppliers",
      icon: <Leaf className="size-5" />,
      menu: "suppliers",
      path: `${devNavUrl}/${userRole}/suppliers`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "cashier", "developer"],
      title_tab: "",
    },
    {
      label: "Settings",
      icon: <Settings className="size-5" />,
      menu: "settings",
      path: `${devNavUrl}/${userRole}/users`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "developer"],
      title_tab: "user",
    },
  ];

  return navItems;
};
