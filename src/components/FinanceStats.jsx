import { AmountWithPesoSign } from "./PesoSign";
import TableLoading from "./spinners/TableLoading";

const FinanceStats = ({
  title,
  value,
  amount = false,
  valueColor,
  className,
  icon,
  iconBg = "bg-gray-100",
  loading = false,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 shadow-xs w-full h-[140px] ${className}`}
    >
      <div className={`${iconBg} p-2 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 capitalize tracking-wide dark:text-gray-300">
          {title}
        </p>
        <h2
          className={`text-lg font-semibold ${valueColor} mt-1 dark:text-light`}
        >
          {loading ? (
            <span className="bg-white dark:bg-gray-900 w-full h-[15px]">
              <TableLoading count={1} cols={1} />
            </span>
          ) : !amount ? (
            value
          ) : (
            <AmountWithPesoSign classAmnt="" classN="size-4" amount={value} />
          )}
        </h2>
      </div>
    </div>
  );
};

export default FinanceStats;
