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
  const onClickNav = () => {
    dispatch(setIsSearch(false));
  };

  let navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="size-5" />,
      menu: "dashboard",
      path: `${devNavUrl}/dashboard`,
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
      path: `${devNavUrl}/products`,
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
      path: `${devNavUrl}/inventory`,
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
      path: `${devNavUrl}/customers`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "cashier", "developer"],
      title_tab: "",
    },
    {
      label: "Sales Orders",
      icon: <ShoppingCart className="size-5" />,
      menu: "sales-orders",
      path: `${devNavUrl}/sales-orders`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "cashier", "developer"],
      title_tab: "",
    },
    {
      label: "Returns",
      icon: <RotateCcw className="size-5" />,
      menu: "returns",
      path: `${devNavUrl}/returns`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "cashier", "developer"],
      title_tab: "",
    },
    {
      label: "Finance",
      icon: <DollarSign className="size-5" />,
      menu: "finance",
      path: `${devNavUrl}/finance`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "developer"],
      title_tab: "",
    },
    {
      label: "Reports",
      icon: <ChartColumn className="size-5" />,
      menu: "reports",
      path: `${devNavUrl}/reports`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "product_owner", "cashier", "developer"],
      title_tab: "",
    },
    {
      label: "Suppliers",
      icon: <Leaf className="size-5" />,
      menu: "suppliers",
      path: `${devNavUrl}/suppliers`,
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
      path: `${devNavUrl}/settings`,
      isOpenSubmenu: "",
      on_click: onClickNav,
      subList: [],
      roles: ["admin", "developer"],
      title_tab: "user",
    },
    // {
    //   label: "Settings",
    //   icon: <Settings className="size-5" />,
    //   menu: "settings",
    //   path: `${devNavUrl}/`,
    //   isOpenSubmenu: store.isSettingsOpen,
    //   on_click: handleSettingsOpen,
    //   sub_name: "Settings",
    //   subList: [
    //     {
    //       name: "Users",
    //       path: `${devNavUrl}/settings/users`,
    //       submenu: "users",
    //     },
    //     {
    //       name: "Category",
    //       path: `${devNavUrl}/settings/category`,
    //       submenu: "category",
    //     },
    //     {
    //       name: "Designation",
    //       path: `${devNavUrl}/settings/designation`,
    //       submenu: "designation",
    //     },
    //     {
    //       name: "Community",
    //       path: `${devNavUrl}/settings/community `,
    //       submenu: "community",
    //     },
    //     {
    //       name: "Notification",
    //       path: `${devNavUrl}/settings/notification`,
    //       submenu: "notification",
    //     },
    //     {
    //       name: "Receipt Template",
    //       path: `${devNavUrl}/settings/receipt-template`,
    //       submenu: "receipt-template",
    //     },
    //   ],
    // },
  ];

  return navItems;
};
