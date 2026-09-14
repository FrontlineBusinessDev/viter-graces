import Pills from "@/components/Pills";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { ChevronDown, Mail } from "lucide-react";
import React from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import ActionButtonMobile from "../ActionButtonMobile";
import { ActionTableList } from "../ArrayValue";
import InfiniteSubTable from "../table/InfiniteSubTable";
import ActionButton from "@/components/buttons/ActionButton";

const SuppliersMobileResponsive = ({
  rows,
  setData,
  setItemEdit,
  setItemVal,
  isDefaultMobile,
  subColumnsTable = null,
  subPath = "",
  ishaveSubTableAdd = false,
}) => {
  const [openId, setOpenId] = React.useState(null);

  return (
    <>
      {isDefaultMobile === "suppliers" && (
        <div>
          {rows?.map((row) => {
            const rowData = row.original;
            const is_status =
              Number(rowData?.is_active) > 0 ? "active" : "inactive";
            const isOpen = openId === row.id;
            const contacts = getConvertStringToJSONparseData(
              rowData?.suppliers_contact_person,
            );

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm mt-2"
              >
                {/* HEADER */}
                <div className="flex gap-2 justify-between items-end ">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-left! ">
                      <div className="flex sm:gap-2 flex-wrap items-center">
                        <span
                          className={`font-semibold text-black dark:text-light text-lg capitalize`}
                        >
                          {rowData?.suppliers_name}
                        </span>

                        <span className={`font-semibold text-xs ml-1 `}>
                          (
                          {isEmptyItem(
                            rowData?.suppliers_description_value,
                            "no description",
                          )}
                          )
                        </span>
                      </div>
                      <span className={`font-semibold text-xs `}>
                        <Pills variant={is_status}>{is_status}</Pills>
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="flex items-center ">
                    <ActionButton
                      item={{
                        name: isOpen ? "Closed" : "Open",
                        icon: (
                          <ChevronDown
                            className={`size-5 lg:size-4 text-gray-600 dark:text-light transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        ),
                      }}
                      onClick={() => setOpenId(isOpen ? null : row.id)}
                    />

                    <ActionButtonMobile
                      dataArray={rowData}
                      setData={setData}
                      setItemEdit={setItemEdit}
                      path="suppliers"
                      itemVal={ActionTableList("customer")}
                    />
                  </div>
                </div>

                {/* OTHER FIELDS */}
                <ul className="pt-2 ">
                  <li className="flex gap-2">
                    <span className="text-gray-500 capitalize">contact:</span>
                    <span className="wrap-break-word font-semibold">
                      {isEmptyItem(rowData?.suppliers_phone, "none")}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-500 capitalize">address:</span>
                    <span className="wrap-break-word font-semibold">
                      {isEmptyItem(rowData?.suppliers_address, "none")}
                    </span>
                  </li>
                </ul>

                {/* VIEW DETAILS - expanded contact info + suppliers product */}
                {isOpen && (
                  <>
                    <ul className="">
                      <li className="flex gap-2">
                        <span className="text-gray-500 capitalize">Email:</span>
                        <span className="wrap-break-word font-semibold">
                          {rowData?.suppliers_email ? (
                            <a
                              href={`mailto:${rowData.suppliers_email}`}
                              className="flex items-center gap-1 hover:text-blue-600 hover:underline"
                            >
                              <Mail size={12} />
                              <span className="wrap-break-word">
                                {rowData.suppliers_email}
                              </span>
                            </a>
                          ) : (
                            <span>none</span>
                          )}
                        </span>
                      </li>
                      <li className="flex flex-wrap ">
                        <div className="flex mr-5">
                          <span className="text-blue-800 capitalize mr-2">
                            Messenger:
                          </span>
                          <span className="wrap-break-word font-semibold underline">
                            {rowData?.suppliers_messenger ? (
                              <a
                                href={
                                  /^https?:\/\//i.test(
                                    rowData.suppliers_messenger,
                                  )
                                    ? rowData.suppliers_messenger
                                    : `https://${rowData.suppliers_messenger}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-blue-600 hover:underline"
                              >
                                <FaFacebookMessenger size={12} />
                                <span className="wrap-break-word">
                                  {rowData.suppliers_messenger}
                                </span>
                              </a>
                            ) : (
                              <span>none</span>
                            )}
                          </span>
                        </div>
                        <div className="flex mr-5">
                          <span className="text-blue-800 capitalize mr-2">
                            WhatsApp:
                          </span>
                          <span className="wrap-break-word font-semibold underline">
                            {rowData?.suppliers_whatsapp ? (
                              <a
                                href={`https://wa.me/${rowData.suppliers_whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-green-600 hover:underline"
                              >
                                <IoLogoWhatsapp size={12} />
                                {rowData.suppliers_whatsapp}
                              </a>
                            ) : (
                              <span>none</span>
                            )}
                          </span>
                        </div>
                        <div className="flex mr-5">
                          <span className="text-blue-800 capitalize mr-2">
                            Other Social:
                          </span>
                          <span className="wrap-break-word font-semibold underline">
                            {isEmptyItem(rowData?.suppliers_other, "none")}
                          </span>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-gray-500 capitalize">
                          Delivery:
                        </span>
                        <span className="wrap-break-word font-semibold">
                          {isEmptyItem(rowData?.suppliers_delivery, "none")}
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-gray-500 capitalize">Notes:</span>
                        <span className="wrap-break-word font-semibold">
                          {isEmptyItem(rowData?.suppliers_notes, "none")}
                        </span>
                      </li>
                    </ul>

                    {subColumnsTable && (
                      <div className="mt-3">
                        <InfiniteSubTable
                          columns={subColumnsTable}
                          className="sm:overflow-auto max-h-[calc(93dvh-200px)] min-h-full"
                          path={subPath}
                          data={rowData}
                          setItemEdit={setItemEdit}
                          setItemVal={setItemVal}
                          ishaveSubAdd={ishaveSubTableAdd}
                          isSearch={false}
                          isDefaultMobile={subPath}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default SuppliersMobileResponsive;
