import LoadImages from "@/components/LoadImages";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";
import { Image } from "lucide-react";
import TableStatus from "../TableStatus";

const renderImage = (rowData) => {
  let photo = getConvertStringToJSONparseData(rowData?.products_image);

  if (photo?.length === 0) {
    return (
      <div className="rounded-full">
        <Image className="h-8 w-8 mx-auto p-1" size={30} />
      </div>
    );
  }

  return (
    <div className="duration-200 relative size-8 m-auto ">
      <LoadImages
        url={photo[photo?.length - 1]}
        alt={photo[photo?.length - 1]?.name}
        className="rounded-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-10 aspect-square"
        isErrorUserImage={true}
        isTableSpinner={true}
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
