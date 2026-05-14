import AddButton from "@/components/buttons/AddButton";
import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { DebouncedInput } from "@/components/inputs/InputText";
import NoData from "@/components/NoData";
import { AmountWithPesoSign, PesoSign } from "@/components/PesoSign";
import SearchBar from "@/components/SearchBar";
import ServerError from "@/components/ServerError";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import TableLoading from "@/components/spinners/TableLoading";
import TableSpinner from "@/components/spinners/TableSpinner";
import { apiVersion, devBaseImgUrl } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { setIsAdd, setIsSubAdd, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ActionButtonTable from "../ActionButtonTable";
import ModalAction from "../modal/ModalAction";
import TableStatus from "../TableStatus";
import CustomerMobile from "./CustomerMobile";
import InfiniteDefaultTableMobileCard from "./InfiniteDefaultTableMobileCard";
import ProductsMobile from "./ProductsMobile";
import { Image } from "lucide-react";

const InfiniteTable = ({
  columns,
  className,
  path = "",
  setItemEdit,
  haveFilterTable = false,
  hasExport = false,
  isDefaultMobile = "default",
  isSearch = true,
  ishaveAdd = true,
  ishaveSubAdd = false,
  productMobile = false,
  mockData = [],
  isStatic = false,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [dataItem, setData] = React.useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const observer = useRef();
  const search = React.useRef(null);
  const [onSearch, setOnSearch] = React.useState(false);
  const [page, setPage] = useState(1);
  const [isFetchFilterDate, setIsFetchFilterDate] = useState(false);

  // ACTIONS ADD
  const handleView = () => {
    dispatch(setIsView(true));
    setItemEdit(null);
  };

  const searchPayload = useMemo(
    () => ({
      searchValue: search.current?.value || "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: "",
    }),
    [store.isSearch],
  );

  const queryKey = useMemo(
    () => [
      path,
      store.isSearch,
      JSON.stringify({ searchPayload }),
      isFetchFilterDate ? JSON.stringify({ columnFilters }) : "",
    ],
    [path, store.isSearch, JSON.stringify({ columnFilters })],
  );

  // React Query infinite fetch
  const {
    data: result,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        null,
        `${apiVersion}/${path}/page/${pageParam}`,
        false,
        {
          ...searchPayload,
          columnFilters: isFetchFilterDate ? columnFilters : [],
        },
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
    () => result?.pages?.flatMap((page) => page.data || []) ?? [],
    [result],
  );

  // use UI-only data
  // const tableData = useMemo(() => {
  //   if (isStatic) return mockData;
  //   return data?.pages?.flatMap((page) => page.data || []) ?? [];
  // }, [data, mockData, isStatic]);

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
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    filterFns: {
      equals: (row, columnId, value) => {
        return row.getValue(columnId) === value;
      },
      between: (row, columnId, value) => {
        const rowValue = row.getValue(columnId);
        const { min, max } = value || {};

        if (min !== undefined && rowValue < min) return false;
        if (max !== "" && rowValue > max) return false;

        return true;
      },
    },
  });

  const rows = table?.getRowModel()?.rows;

  // ACTIONS ADD
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

  // ACTIONS SUB ADD
  const handleSubAdd = () => {
    dispatch(setIsSubAdd(true));
    setItemEdit(null);
  };

  React.useEffect(() => {
    if (result?.pages[0]?.total < 30) {
      setIsFetchFilterDate(false);
    } else {
      setIsFetchFilterDate(true);
    }
  }, [columnFilters]);

  return (
    <>
      <div className="sm:flex justify-between flex-row-reverse mb-3 gap-4 items-center">
        {ishaveAdd ? (
          <div className="flex justify-end sm:mb-0! mb-3 w-full ">
            <AddButton value={path?.replaceAll("-", " ")} onClick={handleAdd} />
          </div>
        ) : (
          ""
        )}
        {ishaveSubAdd ? (
          <div className="flex justify-end sm:mb-0! mb-3  ">
            <AddButton
              value={path?.replaceAll("-", " ")}
              onClick={handleSubAdd}
            />
          </div>
        ) : (
          ""
        )}

        {hasExport === true ? (
          <div className="flex justify-end lg:mb-0! ">
            {hasExport === true ? <ExportCSVButton /> : ""}
          </div>
        ) : (
          ""
        )}
        {isSearch ? (
          <div className={`${haveFilterTable ? " lg:hidden " : " "} w-full `}>
            <SearchBar
              search={search}
              dispatch={dispatch}
              setOnSearch={setOnSearch}
              onSearch={onSearch}
              label={"Search..."}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="">
        <div className="relative rounded-xl md:text-center overflow-auto z-0 ">
          {status !== "pending" && isFetching && <TableSpinner />}
          <div className={`${className} `}>
            {(status === "pending" || rows?.length === 0) && (
              <div className="lg:hidden p-10">
                {status === "pending" ? (
                  <TableLoading count={20} cols={3} />
                ) : (
                  <NoData />
                )}
              </div>
            )}
            {error && (
              <div className="lg:hidden p-10">
                <ServerError />
              </div>
            )}
            {/* MOBILE CARD */}
            <InfiniteDefaultTableMobileCard
              rows={rows}
              lastRowRef={lastRowRef}
              setData={setData}
              setItemEdit={setItemEdit}
              isDefaultMobile={isDefaultMobile}
              ishaveSubAdd={ishaveSubAdd}
            />
            <CustomerMobile
              rows={rows}
              lastRowRef={lastRowRef}
              setItemEdit={setItemEdit}
              isDefaultMobile={isDefaultMobile}
              ishaveSubAdd={ishaveSubAdd}
            />
            <ProductsMobile
              rows={rows}
              setData={setData}
              setItemEdit={setItemEdit}
              lastRowRef={lastRowRef}
              isDefaultMobile={isDefaultMobile}
              ishaveSubAdd={ishaveSubAdd}
            />
            {/* TABLE */}
            <table className="overflow-auto md:border md:border-gray-300 dark:border-[#0b111e] ">
              <thead className={`relative z-50 hidden lg:table-header-group`}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <tr
                    key={headerGroup?.id}
                    className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! z-999"
                  >
                    <th className="w-px ">#</th>
                    {headerGroup?.headers?.map((header) => (
                      <th
                        key={header?.id}
                        className={` ${isEmptyItem(header?.column?.columnDef?.classTh, "")}`}
                      >
                        {flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext(),
                        )}

                        {/* <button
                            onClick={header?.column?.getToggleSortingHandler()}
                            className="bg-gray-100 hover:bg-white rounded-sm ml-2 "
                          >
                            {header?.column?.getIsSorted() !== "asc" ? (
                              <ChevronDown />
                            ) : (
                              <ChevronUp />
                            )}
                          </button> */}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {haveFilterTable ? (
                <thead className={`relative border-0!`}>
                  {table?.getHeaderGroups()?.map((headerGroup) => (
                    <tr
                      key={headerGroup?.id}
                      className="lg:table-row sticky top-9 uppercase dark:bg-[#0b111e] z-999 hidden lg:group"
                    >
                      <th className="w-px  "> </th>
                      {headerGroup?.headers?.map((header) => (
                        <th
                          key={header?.id}
                          className={`pb-2! pr-2! ${isEmptyItem(header?.column?.columnDef?.classTh, "")}`}
                        >
                          {header.column.columnDef.meta?.filterComponent?.(
                            header.column,
                          )}

                          {header.column.columnDef.meta === "" ? (
                            <DebouncedInput
                              type="search"
                              className={`bg-white dark:bg-[#0b111e] m-0! w-full! text-sm border cursor-pointer! isFocused:border-primary! isFocused:ring-1 isFocused:ring-primary! border-gray-300 hover:border-primary! h-8`}
                              value={header.column.getFilterValue() ?? ""}
                              filterFn={header.column.columnDef.filterFn}
                              onChange={(value) => {
                                setData([]);
                                header.column.setFilterValue(
                                  value || undefined,
                                );
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
              ) : (
                ""
              )}

              <tbody>
                {(status === "pending" || rows?.length === 0) && (
                  <tr className="lg:table-row hidden">
                    <td colSpan="100%" className="p-10">
                      {status === "pending" ? (
                        <TableLoading count={20} cols={3} />
                      ) : (
                        <NoData />
                      )}
                    </td>
                  </tr>
                )}
                {error && (
                  <tr className="lg:table-row hidden">
                    <td colSpan="100%" className="p-10">
                      <ServerError />
                    </td>
                  </tr>
                )}
                {rows?.map((row, index) => {
                  const isLastRow = index === rows?.length - 1;
                  const rowData = row.original;

                  console.log("rowData", rowData);

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        key={row.id}
                        ref={isLastRow ? lastRowRef : null}
                        className="hidden lg:table-row group"
                      >
                        <td className="text-center">{index + 1}.</td>
                        {row.getVisibleCells().map((item) => (
                          <td
                            key={item?.id}
                            className={` ${isEmptyItem(item?.column?.columnDef?.classTd, "")} overflow-visible `}
                          >
                            {item?.column?.columnDef?.isImage ? (
                              <>
                                {isEmptyItem(rowData?.img, "") !== "" ? (
                                  <div className=" rounded-sm">
                                    <Image className="mx-auto p-1" size={30} />
                                  </div>
                                ) : (
                                  <div className="rounded-sm">
                                    <img
                                      src={`${devBaseImgUrl}/SideLogo.png`}
                                      alt="picture"
                                      className="min-w-12 w-12 m-auto"
                                    />
                                  </div>
                                )}
                              </>
                            ) : (
                              ""
                            )}
                            {item?.column?.columnDef?.header === "status" ? (
                              <TableStatus
                                item={item?.column?.columnDef}
                                dataArray={rowData}
                              />
                            ) : item?.column?.columnDef?.isViewItems ? (
                              <button
                                className="text-green-700 hover:text-green-800 hover:underline"
                                onClick={() => handleView(item)}
                              >
                                View Items
                              </button>
                            ) : (
                              <div className="flex items-center">
                                {isEmptyItem(
                                  item?.column?.columnDef?.amount,
                                  false,
                                ) ? (
                                  <AmountWithPesoSign
                                    classN="size-3"
                                    amount={rowData?.total_amount}
                                  />
                                ) : isEmptyItem(
                                    item?.column?.columnDef?.paid_amount,
                                    false,
                                  ) ? (
                                  <>
                                    <AmountWithPesoSign
                                      classN="size-3"
                                      amount={rowData?.total_paid}
                                    />
                                  </>
                                ) : (
                                  flexRender(
                                    item?.column?.columnDef?.cell,
                                    item?.getContext(),
                                  )
                                )}
                              </div>
                            )}
                            {/* FOR ACTION BUTTONS */}
                            {item?.column?.columnDef?.accessorKey ===
                            "action" ? (
                              <ActionButtonTable
                                item={item?.column?.columnDef}
                                dataArray={rowData}
                                setData={setData}
                                setItemEdit={setItemEdit}
                                ishaveSubAdd={ishaveSubAdd}
                                path={path}
                              />
                            ) : (
                              ""
                            )}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            {isFetchingNextPage && (
              <button className="text-center h-full relative text-primary rounded-full w-full disabled:opacity-50 disabled:cursor-not-allowed ">
                {isFetchingNextPage ? (
                  <ButtonSpinner />
                ) : (
                  <span>Load more</span>
                )}
              </button>
            )}
            {!hasNextPage && (
              <div className="text-center md:my-8 p-1.5">
                <p className="mb-0 ">End of list.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {store.isAction && (
        <ModalAction
          mysqlApiAction={`${apiVersion}/${path}/${dataItem?.path}`}
          msg={`Are you sure you want to ${dataItem?.action}`}
          successMsg={`${dataItem?.action} successfully.`}
          item={dataItem}
          queryKey={path}
        />
      )}
    </>
  );
};

export default InfiniteTable;
