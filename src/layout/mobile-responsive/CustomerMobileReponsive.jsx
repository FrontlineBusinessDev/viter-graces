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
                <div className="flex flex-wrap justify-between items-end">
                  <ul className="py-2 gap-2 sm:gap-5 ">
                    <li className="flex text-left! text-xs">
                      <span
                        className={`text-gray-500 mr-2 min-w-15 capitalize`}
                      >
                        address:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {isEmptyItem(rowData?.customer_address, "none")}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span
                        className={`text-gray-500 mr-2 min-w-15 capitalize`}
                      >
                        messenger:
                        <span className="wrap-break-word font-semibold ml-1">
                          {isEmptyItem(rowData?.messenger, "none")}
                        </span>
                      </span>
                      |
                      <span
                        className={`text-gray-500 mr-2 min-w-15 capitalize ml-2`}
                      >
                        whatsapp:
                        <span className="wrap-break-word font-semibold ml-1">
                          {isEmptyItem(rowData?.whatsapp, "none")}
                        </span>
                      </span>
                      |
                      <span
                        className={`text-gray-500 mr-2 min-w-15 capitalize ml-2`}
                      >
                        other social:
                        <span className="wrap-break-word font-semibold ml-1">
                          {isEmptyItem(rowData?.other, "none")}
                        </span>
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span
                        className={`text-gray-500 mr-2 min-w-15 capitalize`}
                      >
                        note:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {isEmptyItem(rowData?.customer_notes, "none")}
                      </span>
                    </li>
                  </ul>
                  <div className=" ">
                    <ActionButtonMobile
                      dataArray={rowData}
                      setData={setData}
                      setItemEdit={setItemEdit}
                      ishaveSubAdd={ishaveSubAdd}
                      path={path}
                    />
                  </div>
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
