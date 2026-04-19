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
      description: "7 total",
      roles: ["admin", "developer"],
      array_tab: [],
    },
    {
      title: "inventory",
      description: "7 products tracked",
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
      description: "5 customers",
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
