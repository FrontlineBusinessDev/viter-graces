import { Dot } from "lucide-react";
import React from "react";

const Pills = ({ children, variant = "active" }) => {
  const base =
    "inline-flex items-center rounded-full border px-1 py-0.5 text-xs pr-3 ";
  const variants = {
    active: "bg-success/10 border-success/50 text-success",
    inactive: "bg-gray-100 border-gray-200 text-gray-300",
    warning: "bg-warning/10 border-warning/50 text-warning",
    alert: "bg-alert/10 border-alert/50 text-alert",
  };

  return (
    <div className={`${base} ${variants[variant]}`}>
      <Dot size={18} /> {children}
    </div>
  );
};

export default Pills;
