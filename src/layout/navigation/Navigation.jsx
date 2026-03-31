import { setIsNavFullShow, setTabValue } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { ChevronRight, LucideLogOut } from "lucide-react";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import LogoLg from "../../assets/svg/LogoLg";
import LogoSm from "../../assets/svg/LogoSm";
import { getNavList } from "./function-nav";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { devNavUrl } from "@/config/config";

const Navigation = ({ menu, submenu }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  // const userRole = store.credentials?.data?.role_code;
  const userRole = "developer";
  const link = "portal";
  const navWrapperRef = useRef(null);
  const hoverTimeout = useRef(null);
  const [hoverText, setHoverText] = React.useState("");
  const [hoverPos, setHoverPos] = React.useState(0);
  const [showHover, setShowHover] = React.useState(false);
  const [hoverItem, setHoverItem] = React.useState(null);
  const [submenuMaxHeight, setSubmenuMaxHeight] = React.useState(300);

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoverItem(null);
    }, 200);
  };

  const handleMouseEnter = (e, item) => {
    clearTimeout(hoverTimeout.current);
    setHoverItem(item);
    setHoverText(` ${item.label}`);
    setShowHover(true);
    dispatch(setTabValue(item?.title_tab));

    const rect = e.currentTarget.getBoundingClientRect();
    const navRect = navWrapperRef.current.getBoundingClientRect();

    const top = rect.top - navRect.top;
    const availableSpace = window.innerHeight - rect.top - 20; // subtract for margin

    setHoverPos(top);
    setSubmenuMaxHeight(availableSpace);
  };

  const handleHoverBoxEnter = () => {
    clearTimeout(hoverTimeout.current);
  };

  const handleHoverBoxLeave = () => {
    setHoverItem(null);
  };

  const isExpanded = store.isNavFullShow;

  const toggleNav = () => {
    dispatch(setIsNavFullShow(!isExpanded));
  };

  return (
    <>
      <aside
        className={`
        fixed top-0 left-0 h-dvh z-999 bg-dark-bg dark:bg-[#090e1a]
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-60" : "w-[70px]"}
      `}
      >
        <div
          className="flex flex-col h-full overflow-hidden"
          ref={navWrapperRef}
        >
          <div className="py-4 border-b flex justify-center items-center">
            {isExpanded ? <LogoLg /> : <LogoSm />}
          </div>

          {/* NAV  */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin px-2 mt-3 ">
            {getNavList()
              .filter((item) => item.roles?.includes(userRole))
              .map((item, index) => {
                const sharedClass = `${
                  isExpanded
                    ? "gap-2 w-full flex items-center p-2 justify-start tooltip-navigation"
                    : "relative group flex items-center justify-center"
                }  h-7 mb-2 mx-auto py-5 px-3 ${
                  menu === item.menu
                    ? "rounded-lg bg-primary text-secondary"
                    : "text-white hover:bg-primary hover:text-secondary rounded-lg"
                }`;
                return (
                  <div key={index} className="mb-2">
                    <Link
                      to={`${isEmptyItem(item?.path, `${devNavUrl}`)}`}
                      onMouseEnter={(e) => handleMouseEnter(e, item)}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={(e) => handleMouseEnter(e, item)}
                      className={sharedClass}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span
                        className={`
              text-sm whitespace-nowrap
              transition-all duration-200
              ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
            `}
                      >
                        {item.label}
                      </span>
                    </Link>

                    {/* SUBMENU */}
                    {isExpanded &&
                      item.subList?.length > 0 &&
                      submenu !== "" && (
                        <div className="ml-8 mt-1">
                          {item.subList.map((sub, i) => (
                            <Link
                              key={i}
                              to={`${link}/${sub.path}`}
                              className={`
                  block text-xs py-1 px-2 rounded-md
                  transition-all duration-150
                  ${
                    submenu === sub.submenu
                      ? "text-accent-light border-l-2 border-white"
                      : "text-white hover:bg-primary/40"
                  }
                `}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}
          </nav>

          {/* FOOTER */}
          <div className="p-3 border-t border-gray-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white">
                A
              </div>

              {isExpanded && (
                <div className="flex">
                  <div className="flex flex-col">
                    <span className="text-light text-sm">Richard Santos</span>
                    <span className="text-xs uppercase">Admin</span>
                  </div>
                  <div className=" rounded-lg hover:bg-primary p-2 h-9 ml-4">
                    <button href="" className="">
                      <LucideLogOut className="text-light" size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!isExpanded && (
              <button className="p-2 hover:bg-primary rounded-md">
                <LucideLogOut className="text-light" size={18} />
              </button>
            )}

            <button
              onClick={toggleNav}
              className={`flex items-center gap-2 py-2 pl-1 w-full hover:rounded-lg hover:bg-primary hover:text-secondary`}
            >
              <ChevronRight
                className={` hover:text-secondary ${isExpanded && "rotate-180"}`}
                size={14}
              />
              <span className={`${!isExpanded && "hidden"} text-light`}>
                Collapse
              </span>
            </button>
          </div>
        </div>
      </aside>

      {hoverItem && !hoverItem.subList?.length && (
        <div
          className={`absolute left-18 transition-all duration-300 my-0.5 whitespace-nowrap bg-primary text-white text-xs px-2 py-1 rounded shadow-md z-50 ${
            showHover
              ? "group-hover:opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          style={{ top: hoverPos }}
        >
          {hoverText}
        </div>
      )}

      {/* HOVER */}
      {hoverItem &&
        hoverItem?.subList?.length > 0 &&
        hoverItem?.menu !== "system-info" && (
          <div
            className={`absolute left-16 z-99999 transition-all duration-500 ${
              showHover
                ? "group-hover:opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            style={{ top: hoverPos }}
            onMouseEnter={handleHoverBoxEnter}
            onMouseLeave={handleHoverBoxLeave}
          >
            <div className="absolute left-[-15px] top-2 w-0 h-0 border-8 border-transparent border-r-primary"></div>

            <ul
              className="bg-primary rounded shadow-lg w-44 py-3 text-xs overflow-y-auto  scrollbar-thin"
              style={{ maxHeight: `${submenuMaxHeight}px` }}
            >
              <li className="px-4 pb-2 text-[11px] text-white font-bold tracking-wider uppercase">
                {hoverItem.sub_name}
              </li>
              {hoverItem.subList.map((subItem, subIndex) => (
                <li key={subIndex} className="">
                  <Link
                    className={`block px-4 hover:bg-secondary-green/30 ${
                      submenu === subItem.submenu
                        ? " text-accent-light"
                        : " text-white"
                    }  `}
                    to={`${link}/${subItem.path}`}
                  >
                    <p className="border-l-2 border-transparent py-1">
                      {subItem.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
    </>
  );
};

export default Navigation;
