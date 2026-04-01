import { Dot } from "lucide-react";
import React from "react";

const Pills = ({ children, variant = "active" }) => {
  const base = "inline-flex items-center rounded-full px-3 py-0.5 text-xs ";
  const variants = {
    active: "bg-success/20 text-success",
    inactive: "bg-gray-100 text-gray-300",
    warning: "bg-warning/10 text-warning",
    alert: "bg-alert/10 text-alert",
  };

  return <div className={`${base} ${variants[variant]}`}>{children}</div>;
};

export default Pills;
