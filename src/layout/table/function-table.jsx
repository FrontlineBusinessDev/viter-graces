import { AmountWithPesoSign } from "@/components/PesoSign";
import TableStatus from "../TableStatus";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { Image } from "lucide-react";

const renderImage = (rowData) => {
  const photo = getConvertStringToJSONparseData(rowData.children_photo);

  if (!photo?.length) {
    return (
      <div className="rounded-sm">
        <Image className="mx-auto p-1" size={30} />
      </div>
    );
  }

  return (
    <div className="rounded-sm">
      <img
        src={photo[photo.length - 1]}
        alt=""
        className="min-w-12 w-12 m-auto"
      />
    </div>
  );
};

export const renderCellContent = (item, rowData) => {
  const column = item.column.columnDef;

  if (column.isImage) {
    return renderImage(rowData);
  }

  if (column.header === "status" || column.header === "payment status") {
    return <TableStatus item={column} dataArray={rowData} />;
  }

  if (column.isViewItems) {
    return (
      <button
        className="text-green-700 hover:text-green-800 hover:underline"
        onClick={() => handleView(item)}
      >
        View Items
      </button>
    );
  }

  return (
    <div className="flex items-center">
      {isEmptyItem(column.amount || column.paid_amount, false) ? (
        <AmountWithPesoSign
          classN="size-3"
          amount={rowData[column.accessorKey]}
        />
      ) : (
        <>{flexRender(column.cell, item.getContext())}</>
      )}
    </div>
  );
};
