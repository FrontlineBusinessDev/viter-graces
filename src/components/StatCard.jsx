import { Eye, EyeOff } from "lucide-react";
import React from "react";
import TableLoading from "./spinners/TableLoading";
import { Link } from "react-router-dom";
import { devNavUrl } from "@/config/config";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";

const StatCard = ({
  title,
  value,
  subtitle,
  extra,
  icon,
  iconBg = "bg-gray-100",
  button,
  link,
  flipContent,
  subTitleFlip,
  flipBg,
  dataTestId,
  loading = false,
}) => {
  const { store } = React.useContext(StoreContext);
  const isFlippable = !!flipContent;
  const userRole = store.credentials?.data?.role;

  const [flipped, setFlipped] = React.useState(false);

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setFlipped(!flipped);
    }
  };

  return (
    <>
      <div
        className="group perspective:[1000px] w-full "
        data-testid={dataTestId}
        onClick={handleClick}
      >
        <div
          className={`relative transition-transform duration-500 transform-3d ${
            isFlippable
              ? flipped
                ? "transform-[rotateY(180deg)]"
                : "md:group-hover:transform-[rotateY(180deg)]"
              : ""
          }`}
        >
          {/* FRONT */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm w-full hover:shadow-md transition border border-transparent hover:border-gray-300 backface-visibility:[hidden] h-[116px]">
            <div className="flex justify-between items-start ">
              <div>
                <div className="flex gap-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide dark:text-gray-300 mb-0! ">
                    {title}
                  </p>
                  {isFlippable && <Eye size={16} className="text-green-600" />}
                </div>
                <h2
                  className={`${isEmptyItem(extra, "") === "" && isEmptyItem(button, "") === "" ? "my-3! " : " "} text-2xl font-semibold text-gray-900 dark:text-light`}
                >
                  {loading ? (
                    <span className="bg-white dark:bg-gray-900 w-full h-[15px]">
                      <TableLoading count={1} cols={1} />
                    </span>
                  ) : (
                    <>{value}</>
                  )}
                </h2>
              </div>
              <div className={`${iconBg} ml-3 p-3 rounded-lg`}>{icon}</div>
            </div>

            {subtitle && (
              <div className="text-sm text-gray-400 dark:text-gray-300">
                {loading ? (
                  <div className="bg-white dark:bg-gray-900 w-full h-[15px]">
                    <TableLoading count={1} cols={1} />
                  </div>
                ) : (
                  <p className=" mb-0!">{subtitle}</p>
                )}
              </div>
            )}
            {loading ? (
              ""
            ) : (
              <>
                {extra && (
                  <p className="text-sm text-green-600 mt-1">{extra}</p>
                )}

                {button && (
                  <Link
                    to={`${devNavUrl}/${userRole}/${link}`}
                    className="text-sm text-orange-600 mt-1"
                  >
                    {button}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* BACK */}
          {isFlippable && (
            <div
              className={`absolute inset-0 ${flipBg} rounded-xl p-5 shadow-sm flex justify-between items-start w-full border border-transparent [transform:rotateY(180deg)] [backface-visibility:hidden]`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide dark:text-gray-300">
                    {title}
                  </p>
                  <EyeOff size={16} className="text-green-600" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mt-1 dark:text-light">
                  {flipContent}
                </h2>

                {subTitleFlip && (
                  <p className="text-sm text-gray-400 mt-1 dark:text-gray-300 line-clamp-3">
                    {subTitleFlip}
                  </p>
                )}
              </div>

              <div className={`${iconBg} ml-3 p-3 rounded-lg`}>{icon}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StatCard;
