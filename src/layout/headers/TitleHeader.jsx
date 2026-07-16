import { devNavUrl } from "@/config/config";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { titleHeaderTab } from "./function-header";

const TitleHeader = ({}) => {
  const { store } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;
  const navigate = useNavigate();

  const location = useLocation();
  const currentTab = location.pathname.split("/")[2];

  const currentHeader = titleHeaderTab().find((item) => {
    const hasTabs = item.array_tab.length > 0;

    if (!item.roles?.includes(userRole)) return false;

    if (hasTabs) {
      return item.array_tab.some((tab) => tab.title_tab === currentTab);
    }

    return item.title === currentTab;
  });

  const currentTabData = currentHeader?.array_tab?.find(
    (tab) => tab.title_tab === currentTab,
  );

  const formatText = (text) => text.replace(/-/g, " ");

  return (
    <>
      {currentHeader && (
        <div className="mb-5">
          <h1 className="text-base text-dark-bg dark:text-light capitalize">
            {formatText(currentTabData?.title_tab || currentHeader.title)}
          </h1>

          <p>{currentTabData?.description_tab || currentHeader.description}</p>

          {currentHeader.array_tab.length > 0 && (
            <div className="rounded-lg lg:bg-gray-200 dark:bg-gray-900 p-1 inline-block">
              <ul className="lg:flex flex-wrap gap-2 items-center hidden">
                {currentHeader.array_tab.map((itemTab, key) => {
                  const isActive = store.tabValue === itemTab?.title_tab;
                  return (
                    <Link
                      to={
                        !itemTab?.ongoingDevelopment
                          ? `${devNavUrl}/${userRole}/${itemTab.title_tab}`
                          : "#"
                      }
                      key={key}
                      className={` py-1 px-3 flex rounded-lg font-medium transition-colors duration-300 capitalize
                          ${
                            !itemTab?.ongoingDevelopment
                              ? `
                  ${
                    isActive
                      ? "bg-light dark:bg-dark-mode text-black/80 dark:text-light font-bold"
                      : "text-gray-500 hover:text-black dark:hover:text-light"
                  } `
                              : "  tooltip "
                          } 
                `}
                      data-tooltip={"Coming soon"}
                    >
                      {itemTab?.icon}
                      {formatText(itemTab?.title_tab)}
                    </Link>
                  );
                })}
              </ul>
              <select
                onChange={(e) => {
                  navigate(e.target.value);
                }}
                className="lg:hidden capitalize"
              >
                <optgroup label={`Select sub menu`}>
                  <option hidden>{store.tabValue?.replaceAll("-", " ")}</option>
                  {currentHeader.array_tab.map((itemTab, key) => {
                    return (
                      !itemTab.ongoingDevelopment && (
                        <option
                          key={key}
                          value={`${devNavUrl}/${userRole}/${itemTab.title_tab}`}
                          className={`${store.tabValue === itemTab.title_tab ? "bg-blue-600 text-white " : " "} capitalize `}
                        >
                          {formatText(itemTab?.title_tab)}
                        </option>
                      )
                    );
                  })}

                  {/* {newDataList?.map((item, key) => {
                    return (
                      <option key={key} value={Number(item.id)}>
                        {item.name}
                      </option>
                    );
                  })} */}
                </optgroup>
              </select>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TitleHeader;
