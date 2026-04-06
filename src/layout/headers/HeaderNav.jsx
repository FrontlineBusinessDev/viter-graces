import Header from "@/layout/headers/Header";
import Navigation from "@/layout/navigation/Navigation";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import TitleHeader from "./TitleHeader";
import { setTabValue } from "@/store/StoreAction";
import Toast from "@/components/Toast";
const HeaderNav = ({ children, menu, submenu, activeTab = "" }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  React.useEffect(() => {
    dispatch(setTabValue(activeTab));
  }, [menu]);
  return (
    <>
      <Navigation menu={menu} submenu={submenu} />
      <Header menu={menu} />
      <div
        className={`wrapper overflow-auto transform transition-all duration-300 ease-in-out py-5 ${
          !store.isNavFullShow ? " pl-12 " : " pl-[220px] "
        } pr-0`}
      >
        {activeTab !== "" ? <TitleHeader /> : ""}
        {children}
      </div>
      {store.success && <Toast variant="success" />}
    </>
  );
};

export default HeaderNav;
