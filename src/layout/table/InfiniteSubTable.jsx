import AddButton from "@/components/buttons/AddButton";
import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { DateFormat } from "@/components/DateFormat";
import { DebouncedInput } from "@/components/inputs/InputText";
import NoData from "@/components/NoData";
import SearchBar from "@/components/SearchBar";
import ServerError from "@/components/ServerError";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import TableLoading from "@/components/spinners/TableLoading";
import TableSpinner from "@/components/spinners/TableSpinner";
import { apiVersion } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { setIsSubAdd, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ActionButtonSubTable from "../ActionButtonSubTable";
import MobileResponsiveList from "../mobile-responsive/MobileResponsiveList";
import ModalSubAction from "../modal/ModalSubAction";
import { renderCellContent } from "./function-table";
import OverviewSalesCustomer from "../customer/OverviewSalesCustomer";

const InfiniteSubTable = ({
  columns,
  className,
  path = "",
  subPath = "",
  data = [],
  setItemEdit,
  haveFilterTable = false,
  hasExport = false,
  isDefaultMobile = "",
  isSearch = true,
  ishaveSubAdd = false,
  refetchOnWindowFocus = false,
  setItemVal,
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

  const userId = ProductOwnerId(store);

  // ACTIONS ADD
  const handleView = (item, itemView) => {
    dispatch(setIsView(true));
    setItemEdit(item);
    setItemVal(itemView);
  };

  const searchPayload = useMemo(
    () => ({
      searchValue: search.current?.value || "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: data?.id,
      userId: userId,
    }),
    [store.isSearch, search.current?.value || ""],
  );

  const queryKey = useMemo(
    () => [path, store.isSearch, search.current?.value || "", columnFilters],
    [path, search.current?.value || "", JSON.stringify({ columnFilters })],
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
        `${apiVersion}/${path}/page-by-id/${pageParam}`,
        false,
        {
          ...searchPayload,
          columnFilters: columnFilters,
          userId: userId,
        },
        "post",
      ),

    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total) {
        return lastPage.page + lastPage.count;
      }
      return undefined;
    },
    refetchOnWindowFocus: refetchOnWindowFocus,
  });

  // // Flatten pages into single array
  const tableData = useMemo(
    () => result?.pages?.flatMap((page) => page.data || []) ?? [],
    [result],
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
      date: (row, columnId, value) => {
        return row.getValue(columnId) === DateFormat(value);
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

  // ACTIONS SUB ADD
  const handleSubAdd = () => {
    setItemVal(data);
    dispatch(setIsSubAdd(true));
    setItemEdit(null);
  };

  return (
    <>
      <OverviewSalesCustomer
        path={path}
        id={isEmptyItem(data?.id, "")}
        columnFilters={columnFilters}
      />

      <div className="sm:flex justify-between flex-row-reverse mb-3 gap-4 items-center mt-3">
        {ishaveSubAdd ? (
          <div className="flex justify-end sm:mb-0! mb-3 ">
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
            <MobileResponsiveList
              rows={rows}
              lastRowRef={lastRowRef}
              setData={setData}
              setItemEdit={setItemEdit}
              setItemVal={setItemVal}
              isDefaultMobile={isDefaultMobile}
              ishaveSubAdd={ishaveSubAdd}
            />
            {/* TABLE */}
            <table className="overflow-visible md:border md:border-gray-300 dark:border-[#0b111e] ">
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
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {haveFilterTable ? (
                <thead className={`relative border-0! z-50`}>
                  {table?.getHeaderGroups()?.map((headerGroup) => (
                    <tr
                      key={headerGroup?.id}
                      className="lg:table-row sticky top-9 uppercase dark:bg-[#0b111e] hidden lg:group"
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
                              cypressTesting={
                                header.column.columnDef.accessorKey
                              }
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

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        key={row.id}
                        ref={isLastRow ? lastRowRef : null}
                        className="hidden lg:table-row group"
                        data-testid="table-row"
                      >
                        <td className="text-center last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                          {index + 1}.
                        </td>
                        {row.getVisibleCells().map((item) => (
                          <td
                            key={item?.id}
                            className={` ${isEmptyItem(item?.column?.columnDef?.classTd, "")} `}
                          >
                            {renderCellContent(item, rowData)}

                            {/* FOR ACTION BUTTONS */}
                            {item?.column?.columnDef?.accessorKey ===
                              "action" && (
                              <ActionButtonSubTable
                                item={item?.column?.columnDef}
                                dataArray={row.original}
                                setData={setData}
                                setItemEdit={setItemEdit}
                                ishaveSubAdd={ishaveSubAdd}
                                path={path}
                              />
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
      {store.isSubAction && (
        <ModalSubAction
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

export default InfiniteSubTable;
