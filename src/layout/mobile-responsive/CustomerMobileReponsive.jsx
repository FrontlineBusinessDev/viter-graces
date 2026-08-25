import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { Image } from "lucide-react";
import ActionButtonMobile from "../ActionButtonMobile";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { Link } from "react-router-dom";
import { devNavUrl } from "@/config/config";
import { StoreContext } from "@/store/StoreContext";
import React from "react";

const CustomerMobileReponsive = ({
  rows,
  setData,
  setItemEdit,
  lastRowRef,
  isDefaultMobile,
  ishaveSubAdd = false,
  path = "",
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;
  return (
    <>
      {isDefaultMobile === "customer" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;
            const is_status =
              Number(rowData?.is_active) > 0 ? "active" : "inactive";

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm mt-2"
              >
                {/* HEADER */}
                <div className="xs:flex flex-wrap gap-2 justify-between items-start border-b border-gray-200 pb-2 ">
                  <div className="text-left!">
                    <Link
                      to={`${devNavUrl}/${userRole}/sales-orders`}
                      className="tooltip-action-table text-lg bg-transparent! underline text-primary capitalize p-0! "
                      data-tooltip={"View"}
                      onClick={() =>
                        sessionStorage.setItem(
                          "filter",
                          JSON.stringify([
                            {
                              id: "sales_order_customer_name",
                              value: rowData?.customer_name,
                            },
                          ]),
                        )
                      }
                    >
                      {rowData?.customer_name}
                    </Link>
                    <p className="m-0! wrap-break-word font-semibold">
                      {rowData?.customer_email}
                    </p>
                    <p className="m-0! wrap-break-word font-semibold ">
                      {rowData?.customer_phone}
                    </p>
                  </div>

                  {/* STATUS */}
                  <Pills variant={is_status}>{is_status}</Pills>
                </div>

                {/* OTHER FIELDS */}

                <ul className="py-2 ">
                  <li className="flex gap-2">
                    <span className={`text-gray-500 min-w-15 capitalize`}>
                      address:
                    </span>
                    <span className="wrap-break-word font-semibold">
                      {isEmptyItem(rowData?.customer_address, "none")}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className={`text-gray-500 capitalize`}>
                      messenger:
                    </span>
                    <a
                      href={rowData?.messenger}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`wrap-break-word font-semibold ml-1 ${rowData?.messenger ? "hover:underline text-primary" : "pointer-events-none"}`}
                    >
                      {isEmptyItem(rowData?.messenger, "none")}
                    </a>
                  </li>
                  <li className="flex gap-2">
                    <span className={`text-gray-500  capitalize `}>
                      whatsapp:
                    </span>
                    <span className="wrap-break-word font-semibold ml-1">
                      {isEmptyItem(rowData?.whatsapp, "none")}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className={`text-gray-500  capitalize `}>
                      Other Social:
                    </span>
                    <a
                      href={rowData?.other}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`wrap-break-word font-semibold ml-1 ${rowData?.other ? "hover:underline text-primary" : "pointer-events-none"}`}
                    >
                      {isEmptyItem(rowData?.other, "none")}
                    </a>
                  </li>
                  <li className="flex gap-2">
                    <span className={`text-gray-500  capitalize`}>note:</span>
                    <span className="wrap-break-word font-semibold">
                      {isEmptyItem(rowData?.customer_notes, "none")}
                    </span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 ">
                  <ActionButtonMobile
                    dataArray={rowData}
                    setData={setData}
                    setItemEdit={setItemEdit}
                    ishaveSubAdd={ishaveSubAdd}
                    path={path}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CustomerMobileReponsive;
