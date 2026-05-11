import AddButton from "@/components/buttons/AddButton";
import SearchBar from "@/components/SearchBar";
import ActionButtonTable from "@/layout/ActionButtonTable";
import { DefaultActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import ModalCustomer from "./ModalCustomer";
import ViewDetails from "./ViewDetails";
import { AtSign, MapPin, Phone } from "lucide-react";

const Customers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [openRow, setOpenRow] = React.useState(null);
  const [dataItem, setData] = React.useState(null);
  const search = React.useRef(null);
  const [onSearch, setOnSearch] = React.useState(false);
  const [isView, setView] = React.useState(false);

  // ACTIONS ADD
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

  const handleView = (item) => {
    setView(true);
    setItemEdit(item);
  };

  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
    },
    {
      accessorKey: "name",
      header: "name",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "email",
      header: "email",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "phone",
      header: "phone",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "address",
      header: "address",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList("customer"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  const actionColumn = columns.find((col) => col.accessorKey === "action");

  const data = [
    {
      id: 1,
      name: "Gustin Meyer",
      phone: "+63 925-165-5362",
      email: "gutkowski@hotmail.com",
      address: "Vintar 9611 Northern Samar",
      facebook: "https://www.facebook.com/frontline.business",
      whatsapp: "https://www.facebook.com/frontline.business",
      other: "https://www.facebook.com/frontline.business",
      order_no: "ORD-0165",
      date: "03/07/2026",
      paid: "100.00",
      method: "Check",
      total: "2100.00",
      payment_status: "Paid",
    },
  ];

  return (
    <>
      <HeaderNav menu={"customers"} activeTab="customers">
        <div className="sm:flex justify-between flex-row-reverse mb-3 gap-4 ">
          <div className="flex justify-end sm:mb-0! mb-3 ">
            <AddButton value={"Customer"} onClick={handleAdd} />
          </div>
          <div className={`w-full lg:max-w-1/4 `}>
            <SearchBar
              search={search}
              dispatch={dispatch}
              setOnSearch={setOnSearch}
              onSearch={onSearch}
              label={"Search..."}
            />
          </div>
        </div>
        <div className="py-4">
          <div className="space-y-3">
            {data.map((item) => {
              const isOpen = openRow === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-300 bg-white shadow-sm dark:border-[#0b111e] dark:bg-[#0b111e] "
                >
                  <div className="px-4 py-4 lg:px-5">
                    <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[40px_1.5fr_1fr_1fr_1.3fr_140px_80px] lg:items-center">
                      <div className="hidden lg:block text-gray-500 text-sm dark:text-light">
                        {item.id}
                      </div>

                      <div className="flex items-start justify-between gap-3 lg:contents">
                        <button
                          type="button"
                          onClick={() => setOpenRow(isOpen ? null : item.id)}
                          className="flex flex-1 items-center gap-2 text-left"
                        >
                          <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800 dark:text-light">
                                {item.name}
                              </span>

                              <svg
                                className={`h-4 w-4 text-gray-600 dark:text-light font-bold transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                              </svg>
                            </div>

                            <p className="text-xs text-gray-500 lg:hidden dark:text-light">
                              {item.email}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-3 justify-end lg:hidden">
                          <a href={`${item.facebook}`} target="_black">
                            <FaFacebookMessenger className="text-blue-500 size-4" />
                          </a>
                          <a href={`${item.whatsapp}`} target="_black">
                            <IoLogoWhatsapp className="text-green-500 size-4.5" />
                          </a>
                          <a href={`tel:${item.other}`}>
                            <AiFillMessage className="text-green-500 size-4.5" />
                          </a>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 dark:text-light flex items-center gap-1">
                        <span className="text-xs text-gray-400 lg:hidden">
                          <Phone size={14} />
                        </span>
                        <span>{item.phone}</span>
                      </div>

                      <div className="text-sm text-gray-700 wrap-break-word dark:text-light flex items-center gap-1">
                        <span className="text-xs text-gray-400 lg:hidden">
                          <MapPin size={14} />
                        </span>
                        <span>{item.address}</span>
                      </div>

                      <div className="hidden lg:flex items-center gap-3 justify-end">
                        <a href={`${item.facebook}`} target="_black">
                          <FaFacebookMessenger className="text-blue-500 size-4" />
                        </a>
                        <a href={`${item.whatsapp}`} target="_black">
                          <IoLogoWhatsapp className="text-green-500 size-4.5" />
                        </a>
                        <a href={`tel:${item.other}`}>
                          <AiFillMessage className="text-green-500 size-4.5" />
                        </a>
                      </div>

                      <div className=" flex justify-end lg:items-center text-gray-700 dark:text-light">
                        <ActionButtonTable
                          item={actionColumn}
                          dataArray={item}
                          setData={setData}
                          setItemEdit={setItemEdit}
                        />
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-400 px-4 lg:px-5 pb-4 pt-3  ">
                      <div className=" bg-white dark:bg-[#0b111e] overflow-x-hidden dark:border-gray-700 max-h-[300px] ">
                        {/* desktop header */}
                        <div className="hidden sticky top-0 lg:grid lg:grid-cols-7 lg:items-center border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 dark:bg-[#0b111e]">
                          <div>#</div>
                          <div>Order Number</div>
                          <div>Date</div>
                          <div>Items</div>
                          <div>Paid</div>
                          <div>Method</div>
                          <div>Total</div>
                        </div>

                        {/* row */}
                        <ul className="py-4 px-0 lg:py-4 lg:px-4 border-b lg:border-b-0">
                          {/* mobile */}
                          <li className="lg:hidden rounded-2xl border border-gray-200 bg-gray-50/80 dark:bg-[#101827] dark:border-gray-700 p-4 space-y-3 text-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-light">
                                  {item.order_no}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.date}
                                </p>
                              </div>

                              <p className="font-semibold text-gray-900 dark:text-light">
                                ₱ {item.total}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                              <span>{item.method}</span>
                              <span>₱ {item.paid}</span>
                            </div>

                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                              <button
                                className="text-green-700 hover:text-green-800 hover:underline"
                                onClick={() => handleView(item)}
                              >
                                View Items
                              </button>
                            </div>
                          </li>

                          {/* desktop */}
                          <li className="hidden lg:grid lg:grid-cols-7 gap-0 text-sm">
                            <div>1</div>

                            <div>{item.order_no}</div>

                            <div>{item.date}</div>

                            <div>
                              <button
                                className="text-green-700 hover:text-green-800 hover:underline"
                                onClick={() => handleView(item)}
                              >
                                View Items
                              </button>
                            </div>

                            <div>₱ {item.paid}</div>

                            <div>{item.method}</div>

                            <div className="font-semibold">₱ {item.total}</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </HeaderNav>
      {store.isAdd && <ModalCustomer itemEdit={itemEdit} />}
      {isView && <ViewDetails itemEdit={itemEdit} setView={setView} />}
    </>
  );
};

export default Customers;
