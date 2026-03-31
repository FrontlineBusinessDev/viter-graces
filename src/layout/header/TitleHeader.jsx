import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { titleHeaderTab } from "./function-header";

const TitleHeader = () => {
  const { store, dispatch } = React.useContext(StoreContext);
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
              <div className="rounded-lg bg-gray-200 p-1 inline-block">
                <ul className="flex gap-2 items-center">
                  {item?.array_tab.map((itemTab, key) => {
                    console.log("123", store.tabValue, itemTab?.title_tab);
                    const sharedClass = `py-1 px-3 flex rounded-lg cursor-pointer ${
                      store.tabValue === itemTab?.title_tab ? "bg-light" : ""
                    }`;
                    return (
                      <li
                        key={key}
                        className={sharedClass}
                        onClick={() => itemTab?.on_click}
                      >
                        {itemTab?.icon}
                        {itemTab?.title_tab}
                      </li>
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
