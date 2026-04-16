import { setIsSearch } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { Building2, FileText, Truck, UserCog, Users } from "lucide-react";

import React from "react";

export const titleHeaderTab = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const onClickTab = () => {
    dispatch(setIsSearch(false));
  };

  let navItems = [
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
          title_tab: "purchase orders",
          on_click: onClickTab,
        },
      ],
    },
  ];

  return navItems;
};
