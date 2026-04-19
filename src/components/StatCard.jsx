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
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm flex justify-between items-start w-full hover:shadow-md transition border border-transparent hover:border-gray-300">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide dark:text-gray-300">
          {title}
        </p>

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
  );
};

export default StatCard;
