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
  flipExtra = "",
  icon,
  iconBg = "bg-gray-100",
  button,
  link,
  flipContent,
  subTitleFlip,
  flipBg,
  dataTestId,
  loading = false,
  defaultVisible = false,
}) => {
  const { store } = React.useContext(StoreContext);
  const isFlippable = !!flipContent;
  const hasColorFlip = isFlippable && !!flipBg;
  const userRole = store.credentials?.data?.role;

  const [flipped, setFlipped] = React.useState(defaultVisible);

  const handleClick = () => {
    const isTouchDevice = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;
    if (window.innerWidth < 768 || isTouchDevice) {
      setFlipped(!flipped);
    }
  };

  const toggleVisibility = (e) => {
    e.stopPropagation();
    setFlipped(!flipped);
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
            hasColorFlip
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
                  {isFlippable &&
                    (hasColorFlip ? (
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        aria-label="Show amount"
                        className="cursor-pointer"
                      >
                        <EyeOff size={16} className="text-gray-400" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={flipped ? "Hide amount" : "Show amount"}
                        className="cursor-pointer"
                      >
                        {flipped ? (
                          <Eye size={16} className="text-green-600" />
                        ) : (
                          <EyeOff size={16} className="text-gray-400" />
                        )}
                      </button>
                    ))}
                </div>
                <h2
                  className={`${isEmptyItem(extra, "") === "" && isEmptyItem(button, "") === "" ? "my-3! " : " "} text-2xl font-semibold text-gray-900 dark:text-light`}
                >
                  {loading ? (
                    <span className="bg-white dark:bg-gray-900 w-full h-[15px]">
                      <TableLoading count={1} cols={1} />
                    </span>
                  ) : (
                    <>{!hasColorFlip && flipped ? flipContent : value}</>
                  )}
                </h2>
              </div>
              <div className={`${iconBg} ml-3 p-3 rounded-lg`}>{icon}</div>
            </div>

            {(subtitle || (!hasColorFlip && subTitleFlip)) && (
              <div className="text-sm text-gray-400 dark:text-gray-300">
                {loading ? (
                  <div className="bg-white dark:bg-gray-900 w-full h-[15px]">
                    <TableLoading count={1} cols={1} />
                  </div>
                ) : (
                  <p className=" mb-0!">
                    {!hasColorFlip && flipped ? subTitleFlip : subtitle}
                  </p>
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
                {store.credentials?.data?.role === "developer" ? (
                  <>
                    {button && (
                      <Link
                        to={`${devNavUrl}/${userRole}/${link}`}
                        className="text-sm text-orange-600 mt-1"
                      >
                        {button}
                      </Link>
                    )}
                  </>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
          {/* BACK */}

          {hasColorFlip && (
            <div
              className={`absolute inset-0 ${flipBg} rounded-xl p-3 shadow-sm w-full border border-transparent [transform:rotateY(180deg)] [backface-visibility:hidden]`}
            >
              <div className="flex justify-between items-start ">
                <div className="w-full">
                  <div className="flex gap-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide dark:text-gray-300 mb-0! ">
                      {title}
                    </p>
                    {isFlippable && (
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        aria-label="Hide amount"
                        className="cursor-pointer"
                      >
                        <Eye size={16} className="text-green-600" />
                      </button>
                    )}
                  </div>
                  <h2
                    className={`${isEmptyItem(extra, "") === "" && isEmptyItem(button, "") === "" ? "my-3! " : " "} text-2xl font-semibold text-gray-900 dark:text-light`}
                  >
                    {loading ? (
                      <span className="bg-white dark:bg-gray-900 w-full h-[15px]">
                        <TableLoading count={1} cols={1} />
                      </span>
                    ) : (
                      <>{flipContent}</>
                    )}
                  </h2>
                </div>
                <div className={`${iconBg} ml-3 p-3 rounded-lg`}>{icon}</div>
              </div>

              {subTitleFlip && (
                <div className="text-sm text-gray-400 dark:text-gray-300">
                  {loading ? (
                    <div className="bg-white dark:bg-gray-900 w-full h-[15px]">
                      <TableLoading count={1} cols={1} />
                    </div>
                  ) : (
                    <p className=" mb-0!">{subTitleFlip}</p>
                  )}
                </div>
              )}
              {loading ? (
                ""
              ) : (
                <>
                  {flipExtra && (
                    <p className="text-sm text-green-600 mt-1">{flipExtra}</p>
                  )}

                  {store.credentials?.data?.role === "developer" ? (
                    <>
                      {button && (
                        <Link
                          to={`${devNavUrl}/${userRole}/${link}`}
                          className="text-sm text-orange-600 mt-1"
                        >
                          {button}
                        </Link>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StatCard;
