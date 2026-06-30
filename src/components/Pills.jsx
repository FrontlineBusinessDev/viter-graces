import { variantsStatus } from "@/layout/ArrayValue";
import { ReplaceAll } from "lucide-react";

const Pills = ({ children, variant = "active" }) => {
  const base =
    "inline-flex items-center rounded-full px-3 py-0.5 text-xs uppercase text-[10px]";

  return (
    <span className={`${base} ${variantsStatus(variant)} `}>{children}</span>
  );
};

export default Pills;
