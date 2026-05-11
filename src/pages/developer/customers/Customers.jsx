import AddButton from "@/components/buttons/AddButton";
import SearchBar from "@/components/SearchBar";
import ActionButtonTable from "@/layout/ActionButtonTable";
import { DefaultActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React, { useCallback, useMemo, useRef } from "react";
import { AiFillMessage } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import ModalCustomer from "./ModalCustomer";
import ViewDetails from "./ViewDetails";
import { AtSign, MapPin, Phone } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { apiVersion } from "@/config/config";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NoData from "@/components/NoData";
import TableLoading from "@/components/spinners/TableLoading";
import ServerError from "@/components/ServerError";
import TableDefaultStatusDot from "@/layout/TableDefaultStatusDot";

const Customers = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [openRow, setOpenRow] = React.useState(null);
  const [dataItem, setData] = React.useState(null);
  const search = React.useRef(null);
  const [onSearch, setOnSearch] = React.useState(false);
  const [isView, setView] = React.useState(false);
  const observer = useRef();
  let counter = 1;
  let counterSubTab = 1;

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
      accessorKey: "customer_name",
      header: "name",
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_email",
      header: "second_column",
      icon: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_phone",
      header: "phone",
      icon: <Phone size={14} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer_address",
      header: "address",
      icon: <MapPin size={14} />,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList("customer"),
      header: "Action",
      icon: "",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  const actionColumn = columns.find((col) => col.accessorKey === "action");

  // React Query infinite fetch
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["customer"],
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        null,
        `${apiVersion}/customer/page/${pageParam}`,
        false,
        { columnFilters: [], searchValue: search.current?.value || "", id: "" },
        "post",
      ),

    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total) {
        return lastPage.page + lastPage.count;
      }
      return undefined;
    },

    staleTime: 1000 * 60 * 5, // 5 mins → no refetch when revisiting
    gcTime: 1000 * 60 * 30, // keep cache for 30 mins
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    // enabled: !isStatic,
  });

  // // Flatten pages into single array
  const tableData = useMemo(
    () => data?.pages?.flatMap((page) => page.data || []) ?? [],
    [data],
  );

  // // Infinite scroll trigger
  const lastRowRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  // Table instance
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table?.getRowModel()?.rows;

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
            {(status === "pending" || rows?.length === 0) && (
              <div colSpan="100%" className="p-10">
                {status === "pending" ? (
                  <TableLoading count={20} cols={3} />
                ) : (
                  <NoData />
                )}
              </div>
            )}
            {error && (
              <div colSpan="100%" className="p-10">
                <ServerError />
              </div>
            )}

            {rows?.map((item, index) => {
              const isLastRow = index === rows?.length - 1;
              const isOpen = openRow === item.id;
              console.log("item", item);
              return (
                <div
                  key={index}
                  ref={isLastRow ? lastRowRef : null}
                  className="rounded-2xl border border-gray-300 bg-white shadow-sm dark:border-[#0b111e] dark:bg-[#0b111e] "
                >
                  <div className="px-4 py-4 lg:px-5">
                    <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[40px_1.5fr_1fr_1fr_1.3fr_140px] lg:items-center">
                      <div className="hidden lg:block text-gray-500 text-sm dark:text-light">
                        {counter++}
                      </div>

                      <div className="flex items-start justify-between gap-3 lg:contents">
                        <div
                          onClick={() => setOpenRow(isOpen ? null : item.id)}
                          className="flex flex-1 items-center gap-2 text-left"
                        >
                          <TableDefaultStatusDot
                            dataArray={rows[index]?.original}
                          />
                          {item.getVisibleCells().map((aitem, akey) => {
                            console.log(
                              "aitem?.column?.columnDef?.header",
                              aitem?.column?.columnDef?.header,
                            );
                            return (
                              <React.Fragment key={akey}>
                                <div className="min-w-0">
                                  {aitem?.column?.columnDef?.header ===
                                  "name" ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-800 dark:text-light">
                                        {rows[index]?.original?.name}
                                      </span>

                                      <svg
                                        className={`h-4 w-4 text-gray-600 dark:text-light font-bold transition-transform cursor-pointer ${
                                          isOpen ? "rotate-180" : ""
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                                      </svg>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  {aitem?.column?.columnDef?.header ===
                                  "second_column" ? (
                                    <p className="text-xs text-gray-500 lg:hidden dark:text-light">
                                      {flexRender(
                                        aitem?.column?.columnDef?.cell,
                                        aitem?.getContext(),
                                      )}
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                {aitem?.column?.columnDef?.accessorKey ===
                                "action" ? (
                                  <div className="lg:hidden">
                                    <ActionButtonTable
                                      item={aitem?.column?.columnDef}
                                      dataArray={rows[index]?.original}
                                      setData={setData}
                                      setItemEdit={setItemEdit}
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 lg:hidden dark:text-light">
                        email
                      </p>

                      <div className="text-sm text-gray-700 dark:text-light flex items-center gap-1">
                        <span className="text-xs text-gray-400 lg:hidden">
                          <Phone size={14} />
                        </span>
                        <span>{item.phone} 098745656555</span>
                      </div>

                      <div className="text-sm text-gray-700 wrap-break-word dark:text-light flex items-center gap-1">
                        <span className="text-xs text-gray-400 lg:hidden">
                          <MapPin size={14} />
                        </span>
                        <span>{item.address} san cristobal</span>
                      </div>

                      <div className="flex items-center gap-3 justify-end ">
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

                      <div className="hidden lg:flex items-center justify-end text-gray-700 dark:text-light">
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
