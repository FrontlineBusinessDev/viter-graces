import { setIsSearch } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import {
  ArrowRightLeft,
  Building2,
  FileText,
  Layers,
  Truck,
  UserCog,
  Users,
} from "lucide-react";

import React from "react";

export const titleHeaderTab = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const onClickTab = () => {
    dispatch(setIsSearch(false));
  };

  let navItems = [
    {
      title: "products",
      description: "Manage and organize your product catalog",
      roles: ["admin", "developer"],
      array_tab: [],
    },
    {
      title: "inventory",
      description: "Track and manage your stock in real time",
      roles: ["admin", "developer"],
      array_tab: [
        {
          icon: <Layers className="size-4 mr-1" />,
          title_tab: "stock-overview",
          on_click: onClickTab,
        },
        {
          icon: <ArrowRightLeft className="size-4 mr-1" />,
          title_tab: "movement-history",
          on_click: onClickTab,
        },
      ],
    },
    {
      title: "customers",
      description: "Centralized management of all customers",
      roles: ["admin", "developer"],
      array_tab: [],
    },
    {
      title: "sales-orders",
      description: "6 orders total",
      roles: ["admin", "developer"],
      array_tab: [],
    },
    {
      title: "returns",
      description: "6 orders total",
      roles: ["admin", "developer"],
      array_tab: [],
    },
    {
      title: "finance",
      description: "Manage your finance",
      roles: ["admin", "developer"],
      array_tab: [
        {
          icon: "",
          title_tab: "finance-overview",
          on_click: onClickTab,
        },
        {
          icon: "",
          title_tab: "cash-sales",
          on_click: onClickTab,
        },
        {
          icon: "",
          title_tab: "accounts-receivable",
          on_click: onClickTab,
        },
        {
          icon: "",
          title_tab: "expenses",
          on_click: onClickTab,
        },
        {
          icon: "",
          title_tab: "accounts-payable",
          on_click: onClickTab,
        },
        {
          icon: "",
          title_tab: "sales-journal",
          on_click: onClickTab,
        },
      ],
    },
    {
      title: "settings",
      description: "Manage your system configuration",
      roles: ["admin", "developer"],
      array_tab: [
        {
          icon: <Users className="size-4 mr-1" />,
          title_tab: "users",
          on_click: onClickTab,
        },
        {
          icon: <UserCog className="size-4 mr-1" />,
          title_tab: "roles",
          on_click: onClickTab,
        },
        {
          icon: <Building2 className="size-4 mr-1" />,
          title_tab: "product-owner",
          on_click: onClickTab,
        },
      ],
    },
    {
      title: "suppliers",
      description: "Supplier management & purchase orders",
      roles: ["admin", "developer"],
      array_tab: [
        {
          icon: <Truck className="size-4 mr-1" />,
          title_tab: "suppliers",
          on_click: onClickTab,
        },
        {
          icon: <FileText className="size-4 mr-1" />,
          title_tab: "purchase-orders",
          on_click: onClickTab,
        },
      ],
    },
  ];

  return navItems;
};
