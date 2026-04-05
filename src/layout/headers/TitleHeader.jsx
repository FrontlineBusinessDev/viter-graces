import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { titleHeaderTab } from "./function-header";
import { Link } from "react-router-dom";
import { devNavUrl } from "@/config/config";
import { isEmptyItem } from "@/utilities/isEmptyItem";

const TitleHeader = ({}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  // const userRole = store.credentials?.data?.role_code;
  const userRole = "developer";

  return (
    <>
      {titleHeaderTab()
        .filter((item) => item.roles?.includes(userRole))
        .map((item, index) => {
          return (
            <div key={index} className="mb-5">
              <h1 className="text-base capitalize">{item?.title}</h1>
              <p>{item.title}</p>
              <div className="rounded-lg bg-gray-200 p-1 inline-block ">
                <ul className="flex gap-2 items-center">
                  {item?.array_tab.map((itemTab, key) => {
                    const sharedClass = `py-1 px-3 flex rounded-lg cursor-pointer rounded-md font-medium transition-colors duration-200 capitalize ${
                      store.tabValue === itemTab?.title_tab
                        ? "bg-light text-black/80 font-bold "
                        : ""
                    }`;
                    return (
                      <Link
                        to={`${devNavUrl}/${userRole}/${isEmptyItem(itemTab?.title_tab, ``)}`}
                        key={key}
                        className={sharedClass}
                      >
                        {itemTab?.icon}
                        {itemTab?.title_tab}
                      </Link>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default TitleHeader;
