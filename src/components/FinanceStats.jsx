import { TrendingUp } from "lucide-react";
import React from "react";

const FinanceStats = ({
  title,
  value,
  valueColor,
  className,
  icon,
  iconBg = "bg-gray-100",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 shadow-xs w-full h-[140px] ${className}`}
    >
      <div className={`${iconBg} p-2 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide dark:text-gray-300">
          {title}
        </p>
        <h2
          className={`text-lg font-semibold ${valueColor} mt-1 dark:text-light`}
        >
          {value}
        </h2>
      </div>
    </div>
  );
};

export default FinanceStats;
