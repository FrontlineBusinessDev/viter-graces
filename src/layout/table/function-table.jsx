import LoadImages from "@/components/LoadImages";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { isEmptyItem, isYesOrNo } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";
import { Image } from "lucide-react";
import TableStatus from "../TableStatus";
import { Link } from "react-router-dom";
import { apiVersion } from "@/config/config";
import { queryData } from "@/services/queryData";
import TableUpdateStatus from "../TableUpdateStatus";

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

export const renderCellContent = (item, rowData, path = "") => {
  const column = item.column.columnDef;

  if (column.isImage) {
    return renderImage(rowData);
  }

  if (column.updateDataColumn) {
    return <TableUpdateStatus path={path} item={column} dataArray={rowData} />;
  }

  if (column.header === "status" || column.header === "payment status") {
    return <TableStatus item={column} dataArray={rowData} />;
  }
  if (column.header === "restocked") {
    return <span>{isYesOrNo(rowData[column.accessorKey])}</span>;
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

  if (column.link) {
    const isSocial = ["messenger", "whatsapp", "other"].includes(
      column.accessorKey,
    );

    const value = rowData?.[column.accessorKey];

    const link =
      typeof column.link === "function" ? column.link(value) : column.link;

    // Add https:// for external/social links that don't have a protocol
    const externalLink =
      isSocial && link && !/^https?:\/\//i.test(link)
        ? `https://${link}`
        : link;

    return (
      <Link
        to={externalLink}
        className={`tooltip-action-table bg-transparent! underline text-primary p-0! ${
          isSocial ? "lowercase" : "capitalize"
        }`}
        target={column.header === "name" ? "" : "_blank"}
        data-tooltip="View"
        onClick={() =>
          column.header === "name"
            ? sessionStorage.setItem(
                "filter",
                JSON.stringify([
                  {
                    id: "sales_order_customer_name",
                    value: rowData?.name,
                  },
                ]),
              )
            : ""
        }
      >
        {isSocial ? value : flexRender(column.cell, item.getContext())}
      </Link>
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
