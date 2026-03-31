import { setIsSearch, setTabValue } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";

import React from "react";

export const titleHeaderTab = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const onClickTab = (val) => {
    dispatch(setIsSearch(false));
    dispatch(setTabValue(val));
  };

  let navItems = [
    {
      title: "settings",
      description: "Manage your system configuration",
      roles: "developer",
      array_tab: [
        {
          icon: <Users className="size-4 mr-1" />,
          title_tab: "user",
          on_click: onClickTab("user"),
        },
        {
          icon: <UserCog className="size-4 mr-1" />,
          title_tab: "roles",
          on_click: onClickTab("roles"),
        },
        {
          icon: <Building2 className="size-4 mr-1" />,
          title_tab: "product owner",
          on_click: onClickTab("product owner"),
        },
      ],
    },
  ];

  return navItems;
};
