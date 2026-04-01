import Header from "@/layout/header/Header";
import Navigation from "@/layout/navigation/Navigation";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import TitleHeader from "./TitleHeader";

const HeaderNav = ({ children, menu, submenu }) => {
  const { store } = React.useContext(StoreContext);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const toggleMobileNav = () => setMobileNavOpen(!mobileNavOpen);

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
        className={`wrapper transform transition-all duration-300 ease-in-out py-5 bg-[#F6F7F9] dark:bg-dark-mode ${
          !store.isNavFullShow ? "md:pl-12 " : "md:pl-[220px] "
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
