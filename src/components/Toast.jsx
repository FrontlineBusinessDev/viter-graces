import {
  CheckCircle,
  CircleX,
  Info,
  MessageCircleWarning,
  X,
} from "lucide-react";
import React from "react";

const Toast = ({ variant = "info", ...props }) => {
  const variants = {
    info: {
      title: "Information",
      message: "this is info message",
      icon: <Info className="stroke-info" size={18} />,
      style: "bg-info/20",
      border: "border-l-2 border-info",
    },
    success: {
      title: "Success",
      message: "this is success message",
      icon: <CheckCircle className="stroke-success" size={16} />,
      style: "bg-success/20",
      border: "border-l-2 border-success",
    },
    warning: {
      title: "Warning",
      message: "this is warning message",
      icon: <MessageCircleWarning className="stroke-warning" size={16} />,
      style: "bg-warning/20",
      border: "border-l-2 border-warning",
    },

    alert: {
      title: "Alert",
      message: "this is error message",
      icon: <CircleX className="stroke-alert" size={16} />,
      style: "bg-alert/20",
      border: "border-l-2 border-alert",
    },
  };

  const base =
    "fixed top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 py-1.5 px-2 bg-secondary rounded-r-sm border-y border-r  border-y-line border-r-line ";

  return (
    <div className={`${base} ${variants[variant].border}`}>
      <div
        className={`size-8 rounded-full grid place-content-center ${variants[variant].style}`}
      >
        {variants[variant].icon}
      </div>
      <div className="w-60 pt-1">
        <h5 className="leading-4 font-bold text-sm mb-0.5">
          {variants[variant].title}
        </h5>
        <p className="opacity-70 mb-0 text-xs whitespace-nowrap">
          {variants[variant].message}
        </p>
      </div>
      <button {...props}>
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
