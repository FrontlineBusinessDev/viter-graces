import { isEmptyItem } from "@/utilities/isEmptyItem";

const TableDefaultStatusDot = ({ dataArray }) => {
  return (
    <>
      {Number(isEmptyItem(dataArray?.is_active, 1)) ? (
        <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
      ) : (
        <span className="h-2.5 w-2.5 rounded-full bg-gray-500 shrink-0" />
      )}
    </>
  );
};

export default TableDefaultStatusDot;
