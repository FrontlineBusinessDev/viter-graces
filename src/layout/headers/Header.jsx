import { StoreContext } from "@/store/StoreContext";
import {
  Bell,
  Moon,
  Package,
  PhilippinePeso,
  Plus,
  RotateCcw,
  ShoppingCart,
  Sun,
  Users,
  X,
} from "lucide-react";
import React from "react";

const Header = ({ menu }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [darkMode, setDarkMode] = React.useState(false);
  const [openQuick, setOpenQuick] = React.useState(false);
  let menuRef = React.useRef(null);

  //  default = light
  React.useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleQuickOpen = () => {
    setOpenQuick(true);
  };
  const handleQuickClose = () => {
    setOpenQuick(false);
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenQuick(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={` overflow-x-hidden ${
          !store.isNavFullShow ? "ml-10 pl-12 " : " pl-[260px] "
        } transition-all ease-in duration-200  sm:pr-6 pr-0 bg-light py-2 shadow-xs border-b border-gray-300 dark:border-gray-600 dark:bg-gray-900 sticky top-0 z-50`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-black text-sm dark:text-light capitalize">
            {menu}
          </h2>
          <div className="flex items-center gap-3">
            <button className="btn--green" onClick={handleQuickOpen}>
              <Plus size={16} /> Quick Add
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 hover:bg-primary hover:text-light rounded"
            >
              {darkMode ? (
                <Sun className="text-light" size={16} />
              ) : (
                <Moon size={16} />
              )}
            </button>
            <button>
              <Bell size={16} className="dark:text-light" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`dropdown ${openQuick ? "active" : "inactive"}  p-2 min-w-[191px] overflow-hidden rounded-xl fixed right-23 border border-gray-200 bg-light dark:bg-gray-900 z-999 transition-all ease-in-out duration-200 transform -translate-x-1 block shadow-2xl`}
        ref={menuRef}
      >
        <div className="flex justify-between items-center border-b border-gray-300 pb-1.5">
          <span className="text-xs">QUICK ADD</span>
          <button onClick={handleQuickClose}>
            <X size={14} className="dark:text-light" />
          </button>
        </div>
        <div>
          <ul className="[&>li]:text-black [&>li]:text-xs [&>li]:font-inter-regular [&>li]:py-2 dark:[&>li]:text-light">
            <li>
              <a href="" className="flex items-center gap-2">
                <span className="bg-blue-300/20 rounded-full w-8 h-8 ">
                  <ShoppingCart className=" text-blue-500 pt-2 place-self-center" />
                </span>
                New Order
              </a>
            </li>
            <li>
              <a href="" className="flex items-center gap-2">
                <span className="bg-violet-300/20 rounded-full w-8 h-8 ">
                  <Package className=" text-violet-500 pt-2 place-self-center" />
                </span>
                Add Product
              </a>
            </li>
            <li>
              <a href="" className="flex items-center gap-2">
                <span className="bg-green-300/20 rounded-full w-8 h-8 ">
                  <Users className=" text-green-500 pt-2 place-self-center" />
                </span>
                Add Customer
              </a>
            </li>
            <li>
              <a href="" className="flex items-center gap-2">
                <span className="bg-orange-300/20 rounded-full w-8 h-8 ">
                  <RotateCcw className=" text-orange-500 pt-2 place-self-center" />
                </span>
                Process Return
              </a>
            </li>
            <li>
              <a href="" className="flex items-center gap-2">
                <span className="bg-red-300/20 rounded-full w-8 h-8 ">
                  <PhilippinePeso className=" text-red-500 pt-2 place-self-center" />
                </span>
                Add Expenses
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
