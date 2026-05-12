import { isEmptyItem } from "@/utilities/isEmptyItem";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { PhilippinePeso } from "lucide-react";

export const AmountWithPesoSign = ({
  classN,
  classAmnt = "text-right text-black dark:text-light",
  amount,
}) => {
  return (
    <span className={`flex items-center justify-end ${classAmnt}`}>
      <PhilippinePeso className={`${classN} mr-1`} />
      {numberWithCommasToFixed(isEmptyItem(amount, "0"), 2)}
    </span>
  );
};

export const PesoSign = () => {
  return (
    <PhilippinePeso
      className={`text-right size-3 text-black dark:text-light mr-1`}
    />
  );
};
