const Pills = ({ children, variant = "active" }) => {
  const base =
    "inline-flex items-center rounded-full px-3 py-0.5 text-xs uppercase ";
  const variants = {
    active: "bg-success/20 text-success",
    inactive: "bg-gray-100 text-gray-500",
    draft: "bg-gray-300 text-gray-700",
    paid: "bg-blue-300 text-blue-700",
    warning: "bg-warning/10 text-warning",
    alert: "bg-alert/10 text-alert",
    in_stock: "bg-success/20 text-success",
    low_stock: "bg-warning/10 text-warning",
    low_stock: "bg-warning/10 text-warning",
  };

  console.log("123", children, variant);

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};

export default Pills;
