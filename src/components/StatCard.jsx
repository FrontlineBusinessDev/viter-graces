import { Eye, EyeOff } from "lucide-react";
import React from "react";

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
}) => {
  const isFlippable = !!flipContent;

  return (
    <>
      <div className="group [perspective:1000px] w-full ">
        <div
          className={`relative transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlippable ? "group-hover:[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* FRONT */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm flex justify-between items-start w-full hover:shadow-md transition border border-transparent hover:border-gray-300 [backface-visibility:hidden] h-[155px]">
            <div>
              <div className="flex gap-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide dark:text-gray-300">
                  {title}
                </p>
                {isFlippable && <Eye size={16} className="text-green-600" />}
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mt-1 dark:text-light">
                {value}
              </h2>

              {subtitle && (
                <p className="text-sm text-gray-400 mt-1 dark:text-gray-300">
                  {subtitle}
                </p>
              )}

              {extra && <p className="text-sm text-green-600 mt-1">{extra}</p>}

              {button && (
                <a href={link} className="text-sm text-orange-600 mt-1">
                  {button}
                </a>
              )}
            </div>

            <div className={`${iconBg} p-3 rounded-lg`}>{icon}</div>
          </div>

          {/* BACK */}
          {isFlippable && (
            <div
              className={`absolute inset-0 ${flipBg} rounded-xl p-5 shadow-sm flex justify-between items-start w-full border border-transparent [transform:rotateY(180deg)] [backface-visibility:hidden]`}
            >
              <div>
                <div className="flex gap-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide dark:text-gray-300">
                    {title}
                  </p>
                  <EyeOff size={16} className="text-green-600" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mt-1 dark:text-light">
                  {flipContent}
                </h2>

                {subTitleFlip && (
                  <p className="text-sm text-gray-400 mt-1 dark:text-gray-300">
                    {subTitleFlip}
                  </p>
                )}
              </div>

              <div className={`${iconBg}/50 p-3 rounded-lg`}>{icon}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StatCard;
