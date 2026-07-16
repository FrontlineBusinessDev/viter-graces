import { StoreContext } from "@/store/StoreContext";
import React from "react";

const commingSoon = ({ isExpanded, item }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;

  return (
    <>
      <div>
        <span className="text-lg">{item.icon}</span>
        <span
          className={`
                          text-sm whitespace-nowrap
                          transition-all duration-200
                          ${isExpanded || window.innerWidth < 640 ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
                        `}
        >
          {item.label}
        </span>
        {item?.ongoing?.filter((item) => item.includes(userRole)) ===
        userRole ? (
          <span className="bg-amber-300 px-1 text-black">Coming soon</span>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default commingSoon;
