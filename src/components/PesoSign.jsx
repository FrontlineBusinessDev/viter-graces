import { isEmptyItem } from "@/utilities/isEmptyItem";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import { PhilippinePeso } from "lucide-react";

export const AmountsWithPesoSign = ({
  classN,
  classAmnt = "text-right text-black dark:text-light",
  amount = 0,
  decimalNumber = 2,
}) => {
  return (
    <span className={`flex items-center justify-end ${classAmnt}`}>
      <PhilippinePeso className={`${classN} mr-1`} />
      {numberWithCommasToFixed(isEmptyItem(amount, 0), Number(decimalNumber))}
    </span>
  );
};

export const Amount = ({
  classN,
  classAmnt = " ",
  amount = 0,
  decimalNumber = 2,
}) => {
  return (
    <span
      className={`flex items-center text-sm text-black dark:text-light ${classAmnt}`}
    >
      <PhilippinePeso className={`${classN} mr-1 size-3`} />
      {numberWithCommasToFixed(isEmptyItem(amount, 0), Number(decimalNumber))}
    </span>
  );
};

export const AmountWithPesoSign = ({
  classN,
  classAmnt = "text-right text-black dark:text-light",
  amount,
  decimalNumber = 2,
}) => {
  return (
    <span className={`flex items-center justify-end ${classAmnt}`}>
      <PhilippinePeso className={`${classN} mr-1`} />
      {numberWithCommasToFixed(isEmptyItem(amount, 0), Number(decimalNumber))}
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
