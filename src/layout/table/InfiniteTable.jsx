import AddButton from "@/components/buttons/AddButton";
import NoData from "@/components/NoData";
import SearchBar from "@/components/SearchBar";
import ServerError from "@/components/ServerError";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import TableLoading from "@/components/spinners/TableLoading";
import TableSpinner from "@/components/spinners/TableSpinner";
import { apiVersion } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { setIsAdd } from "@/store/StoreAction";
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

const InfiniteTable = ({
  columns,
  className,
  path = "",
  setItemEdit,
  haveFilterTable = false,
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
    queryKey: [path, store.isSearch],
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        `${apiVersion}/${path}/search`,
        `${apiVersion}/${path}/page/${pageParam}`,
        store.isSearch, // search boolean
        {
          searchValue: search.current.value,
          id: "",
        }, // search value
        "post",
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total) {
        return lastPage.page + lastPage.count;
      }
      return;
    },
    refetchOnWindowFocus: true,
    // enabled: !isStatic, // disable API
  });

  const finalStatus = isStatic ? "success" : status;
  const finalError = isStatic ? null : error;
  const finalHasNextPage = isStatic ? false : hasNextPage;

  // // Flatten pages into single array
  const tableData = useMemo(
    () => data?.pages?.flatMap((page) => page.data || []) ?? [],
    [data],
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

        console.log("rowValue", rowValue);
        console.log("min max", { min, max });

        if (min !== undefined && rowValue < min) return false;
        if (max !== undefined && rowValue > max) return false;

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

  return (
    <>
      <div className="sm:flex justify-between flex-row-reverse mb-3 gap-4 pr-6">
        <div className="flex justify-end sm:mb-0! mb-3 ">
          <AddButton value={path} onClick={handleAdd} />
        </div>
        <div
          className={`${haveFilterTable ? " sm:hidden " : " "} "w-full md:max-w-1/4 "`}
        >
          <SearchBar
            search={search}
            dispatch={dispatch}
            setOnSearch={setOnSearch}
            onSearch={onSearch}
            label={"Search..."}
          />
        </div>
      </div>
      <div className="">
        <div className="relative rounded-xl md:text-center overflow-auto z-0 ">
          {status !== "pending" && isFetching && <TableSpinner />}
          <div className={`${className} `}>
            {/* MOBILE CARD */}
            {rows?.map((row) => {
              const cells = row.getVisibleCells();

              const titleCell =
                cells.find((c) => c.column.columnDef.isMobileTitle) || cells[0];

              return (
                <div
                  key={row.id}
                  className="sm:hidden border rounded-xl p-4 mb-4 shadow-sm"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-2">
                    <p
                      className={`font-semibold text-lg ${
                        titleCell.column.columnDef.classTd || ""
                      }`}
                    >
                      {flexRender(
                        titleCell.column.columnDef.cell,
                        titleCell.getContext(),
                      )}
                    </p>

                    {/* STATUS (same logic as table) */}
                    {cells.map((item, key) => {
                      if (item.column.columnDef.header === "status") {
                        return (
                          <div key={key}>
                            <TableStatus
                              item={titleCell.column.columnDef}
                              dataArray={row.original}
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  {/* OTHER FIELDS */}
                  <div className="space-y-2">
                    {cells.map((cell) => {
                      const colDef = cell.column.columnDef;
                      const accessor = colDef.accessorKey;

                      // Skip title, status, action
                      if (
                        cell.id === titleCell.id ||
                        colDef.header === "status" ||
                        accessor === "action"
                      )
                        return null;

                      const header = colDef.header;

                      return (
                        <div
                          key={cell.id}
                          className={`grid grid-cols-2 ${isEmptyItem(
                            colDef.classTd,
                            "",
                          )}`}
                        >
                          <p
                            className={`text-xs text-gray-500 ${isEmptyItem(
                              colDef.classTh,
                              "",
                            )}`}
                          >
                            {typeof header === "string" ? header : ""}
                          </p>

                          <p className="text-sm">
                            {flexRender(colDef.cell, cell.getContext())}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ACTIONS */}
                  {cells.map((item) => {
                    if (item.column.columnDef.accessorKey === "action") {
                      return (
                        <div key={item.id} className="flex gap-2 mt-3">
                          <ActionButtonTable
                            item={item.column.columnDef}
                            dataArray={row.original}
                            setData={setData}
                            setItemEdit={setItemEdit}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
            {/* TABLE */}
            <table className="overflow-auto md:border md:border-gray-300 dark:border-[#0b111e] ">
              <thead className={`relative z-50 hidden sm:table-header-group`}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <tr
                    key={headerGroup?.id}
                    className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! z-999"
                  >
                    <th className="w-px dark:bg-[#0b111e]!">#</th>
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
                      className="sm:table-row sticky top-9 uppercase dark:bg-[#0b111e] z-999"
                    >
                      <th className="w-px dark:bg-[#0b111e]! "> </th>
                      {headerGroup?.headers?.map((header) => (
                        <th
                          key={header?.id}
                          className={`pb-2! pr-2! ${isEmptyItem(header?.column?.columnDef?.classTh, "")}`}
                        >
                          {header.column.columnDef.meta?.filterComponent?.(
                            header.column,
                          )}

                          {header.column.columnDef.meta === "" ? (
                            <input
                              type="search"
                              // placeholder={`Type to search ${flexRender(
                              //   header?.column?.columnDef?.header,
                              //   header?.getContext(),
                              // )}....`}
                              className={`bg-white m-0! w-full! text-sm border cursor-pointer! isFocused:border-primary!
                              isFocused:ring-1 isFocused:ring-primary! border-gray-300 hover:border-primary! h-8 `}
                              onChange={(e) => {
                                const val = e.target.value || undefined;

                                header.column.setFilterValue(val);

                                setData([]);
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
                  <tr>
                    <td colSpan="100%" className="p-10">
                      {status === "pending" ? (
                        <TableLoading count={20} cols={3} />
                      ) : (
                        <NoData />
                      )}
                    </td>
                  </tr>
                )}
                {(status === "error" || error) && (
                  <tr>
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
                        className="hidden sm:table-row group"
                      >
                        <td className="text-center">{index + 1}.</td>
                        {row.getVisibleCells().map((item) => (
                          <td
                            key={item?.id}
                            className={` ${isEmptyItem(item?.column?.columnDef?.classTd, "")} overflow-visible `}
                          >
                            {item?.column?.columnDef?.header === "status" ? (
                              <TableStatus
                                item={item?.column?.columnDef}
                                dataArray={row.original}
                              />
                            ) : (
                              flexRender(
                                item?.column?.columnDef?.cell,
                                item?.getContext(),
                              )
                            )}
                            {/* FOR ACTION BUTTONS */}
                            {item?.column?.columnDef?.accessorKey ===
                            "action" ? (
                              <ActionButtonTable
                                item={item?.column?.columnDef}
                                dataArray={row.original}
                                setData={setData}
                                setItemEdit={setItemEdit}
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
