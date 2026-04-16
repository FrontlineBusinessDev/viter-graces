import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { titleHeaderTab } from "./function-header";
import { Link, useLocation } from "react-router-dom";
import { devNavUrl } from "@/config/config";
import { isEmptyItem } from "@/utilities/isEmptyItem";

const TitleHeader = ({}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  // const userRole = store.credentials?.data?.role_code;
  const userRole = "developer";

  const location = useLocation();
  const currentTab = location.pathname.split("/")[3];

  const currentHeader = titleHeaderTab().find(
    (item) =>
      item.roles?.includes(userRole) &&
      item.array_tab.some((tab) => tab.title_tab === currentTab),
  );

  return (
    <>
      {currentHeader && (
        <div className="mb-5">
          <h1 className="text-base text-dark-bg dark:text-light capitalize">
            {currentHeader.title}
          </h1>

          <p>{currentHeader.description}</p>

          <div className="rounded-lg bg-gray-200 dark:bg-gray-900 p-1 inline-block">
            <ul className="flex gap-2 items-center">
              {currentHeader.array_tab.map((itemTab, key) => {
                const isActive = store.tabValue === itemTab?.title_tab;

                return (
                  <Link
                    to={`${devNavUrl}/${userRole}/${itemTab.title_tab}`}
                    key={key}
                    className={`
                  py-1 px-3 flex rounded-lg font-medium
                  transition-colors duration-300 capitalize
                  ${
                    isActive
                      ? "bg-light dark:bg-dark-mode text-black/80 dark:text-light font-bold"
                      : "text-gray-500 hover:text-black"
                  }
                `}
                  >
                    {itemTab?.icon}
                    {itemTab?.title_tab}
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default TitleHeader;
