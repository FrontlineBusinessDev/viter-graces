import { ReplaceAll } from "lucide-react";

const Pills = ({ children, variant = "active" }) => {
  const base =
    "inline-flex items-center rounded-full px-3 py-0.5 text-xs uppercase text-[10px]";
  const variants = {
    // default-status || default-status-words
    active: "bg-success/20 text-success",
    inactive: "bg-gray-100 text-gray-500",
    // stock-overview
    out_of_stock: "bg-gray-100 text-gray-500",
    in_stock: "bg-success/20 text-success",
    low_stock: "bg-warning/10 text-warning",
    // payment-status
    unpaid: "bg-gray-300 text-gray-700",
    paid: "bg-success/20 text-success",
    partial: "bg-blue-300 text-blue-700",
    overdue: "bg-red-100 text-red-500",
    // stock-type-status
    stock_in_adjustments: "bg-blue-300 text-blue-700",
    purchases: "bg-violet-300 text-violet-700 ",
    stock_out__sales: "bg-gray-100 text-gray-500",
    stock_out__reject_defectiveitems: "bg-warning/10 text-warning",
    // other
    draft: "bg-gray-300 text-gray-700",
    warning: "bg-warning/10 text-warning",
    alert: "bg-alert/10 text-alert",
  };

  return (
    <span
      className={`${base} ${variants[variant?.toLowerCase()?.replaceAll(" ", "_")?.replaceAll("-", "")?.replaceAll("/", "")]} `}
    >
      {children}
    </span>
  );
};

export default Pills;
