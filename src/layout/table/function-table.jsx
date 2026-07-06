import { AmountWithPesoSign } from "@/components/PesoSign";
import { devBaseImgUrl } from "@/config/config";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";
import { Image } from "lucide-react";
import TableStatus from "../TableStatus";

const renderImage = (rowData) => {
  if (isEmptyItem(rowData?.products_image, "") === "") {
    return (
      <div className="rounded-full">
        <Image className="h-8 w-8 mx-auto p-1" size={30} />
      </div>
    );
  }

  return (
    <div className="rounded-sm">
      <img
        src={`${devBaseImgUrl}/${rowData?.products_image}`}
        alt={`${rowData?.products_image}`}
        className="h-8 w-8 m-auto rounded-full object-cover"
      />
    </div>
  );
};

export const renderCellContent = (item, rowData) => {
  const column = item.column.columnDef;

  if (column.isImage) {
    return renderImage(rowData);
  }

  if (
    column.header === "status" ||
    column.header === "payment status" ||
    column.header === "restocked"
  ) {
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
