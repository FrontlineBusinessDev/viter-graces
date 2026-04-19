import Header from "@/layout/headers/Header";
import Navigation from "@/layout/navigation/Navigation";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import TitleHeader from "./TitleHeader";
import { setTabValue } from "@/store/StoreAction";
import Toast from "@/components/Toast";

const HeaderNav = ({ children, menu, submenu, activeTab = "" }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const toggleMobileNav = () => setMobileNavOpen(!mobileNavOpen);

  React.useEffect(() => {
    dispatch(setTabValue(activeTab));
  }, [menu]);
  return (
    <>
      <div className="hidden sm:block">
        <Navigation menu={menu} submenu={submenu} />
      </div>

      <Header menu={menu} toggleMobileNav={toggleMobileNav} />

      {/* Mobile */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 sm:hidden"
            onClick={() => setMobileNavOpen(false)}
          ></div>

          <div className="fixed top-0 left-0 w-64 h-full bg-dark-bg dark:bg-dark-mode z-50 shadow-lg p-4 sm:hidden transition-transform duration-300 transform">
            <Navigation
              menu={menu}
              submenu={submenu}
              mobileNavOpen={mobileNavOpen}
            />
          </div>
        </>
      )}
      <div
        className={`wrapper overflow-auto transform transition-all duration-300 ease-in-out py-5 ${
          !store.isNavFullShow ? " md:pl-14 sm:px-4  " : " md:pl-[220px] "
        } `}
      >
        {activeTab !== "" ? <TitleHeader /> : ""}
        {children}
      </div>
      {store.success && <Toast variant="success" />}
    </>
  );
};

export default HeaderNav;
