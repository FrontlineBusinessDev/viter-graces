import Header from "@/layout/header/Header";
import Navigation from "@/layout/navigation/Navigation";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import TitleHeader from "./TitleHeader";
const HeaderNav = ({ children, menu, submenu }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      <Navigation menu={menu} submenu={submenu} />
      <Header menu={menu} />
      <div
        className={`wrapper overflow-hidden transform transition-all duration-300 ease-in-out py-5 bg-[#F6F7F9] dark:bg-[#0b111e] h-[93.5dvh] ${
          !store.isNavFullShow ? " pl-12 " : " pl-[220px] "
        } sm:pr-6 pr-0`}
      >
        {store.tabValue !== "" ? (
          <TitleHeader menu={menu} activeTab={activeTab} />
        ) : (
          ""
        )}
        {children}
      </div>
    </>
  );
};

export default HeaderNav;
