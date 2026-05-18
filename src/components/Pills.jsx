const Pills = ({ children, variant = "active" }) => {
  const base = "inline-flex items-center rounded-full px-3 py-0.5 text-xs ";
  const variants = {
    active: "bg-success/20 text-success",
    inactive: "bg-gray-100 text-gray-500",
    draft: "bg-gray-300 text-gray-700",
    paid: "bg-blue-300 text-blue-700",
    warning: "bg-warning/10 text-warning",
    alert: "bg-alert/10 text-alert",
    instock: "bg-success/20 text-success",
    lowstock: "bg-warning/10 text-warning",
  };

  return <div className={`${base} ${variants[variant]}`}>{children}</div>;
};

export default Pills;
