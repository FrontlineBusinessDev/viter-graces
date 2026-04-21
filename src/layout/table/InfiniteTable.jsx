import NoData from "@/components/NoData";
import Pills from "@/components/Pills";
import SearchBar from "@/components/SearchBar";
import ServerError from "@/components/ServerError";
import AddButton from "@/components/buttons/AddButton";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import TableLoading from "@/components/spinners/TableLoading";
import TableSpinner from "@/components/spinners/TableSpinner";
import { apiVersion } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { StoreContext } from "@/store/StoreContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useCallback, useMemo, useRef, useState } from "react";
import ActionButtonTable from "../ActionButtonTable";
import ModalAction from "../modal/ModalAction";
import { setIsAdd } from "@/store/StoreAction";
import { isEmptyItem } from "@/utilities/isEmptyItem";

const InfiniteTable = ({
  columns,
  className,
  path = "",
  setItemEdit,
  mockData = [],
  isStatic = false,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [dataItem, setData] = React.useState(null);
  const [sorting, setSorting] = useState([]);
  const observer = useRef();
  const search = React.useRef(null);
  const [onSearch, setOnSearch] = React.useState(false);

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
    refetchOnWindowFocus: false,
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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table?.getRowModel()?.rows;

  // ACTIONS ADD
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <div className="w-full max-w-1/4 ">
          <SearchBar
            search={search}
            dispatch={dispatch}
            setOnSearch={setOnSearch}
            onSearch={onSearch}
            label={"Search..."}
          />
        </div>

        <AddButton value={path} onClick={handleAdd} />
      </div>
      <div className="">
        {/* TABLE */}
        <div className="relative rounded-xl md:text-center overflow-auto z-0 ">
          {status !== "pending" && isFetching && <TableSpinner />}
          <div className={`${className} `}>
            {/* MOBILE CARD */}
            {rows?.map((row) => {
              const cells = row.getVisibleCells();

              const titleCell =
                cells.find((c) => c.column.columnDef.isMobileTitle) || cells[0];

              const statusCell = cells.find(
                (c) => c.column.columnDef.accessorKey === "status",
              );

              const actionCell = cells.find(
                (c) => c.column.columnDef.accessorKey === "action",
              );

              return (
                <div
                  key={row.id}
                  className="sm:hidden border rounded-xl p-4 mb-4 shadow-sm"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-lg">
                      {flexRender(
                        titleCell.column.columnDef.cell,
                        titleCell.getContext(),
                      )}
                    </p>

                    {/* STATUS */}
                    {statusCell && (
                      <Pills
                        variant={
                          statusCell.getValue() === "Active"
                            ? "active"
                            : "inactive"
                        }
                      >
                        {flexRender(
                          statusCell.column.columnDef.cell,
                          statusCell.getContext(),
                        )}
                      </Pills>
                    )}
                  </div>

                  {/* OTHER FIELDS */}
                  <div className="space-y-2">
                    {cells.map((cell) => {
                      const accessor = cell.column.columnDef.accessorKey;

                      // Skip special fields
                      if (
                        cell.id === titleCell.id ||
                        accessor === "status" ||
                        accessor === "action"
                      )
                        return null;

                      const header = cell.column.columnDef.header;

                      return (
                        <div key={cell.id} className="grid grid-cols-2">
                          <p className="text-xs text-gray-500">
                            {typeof header === "string" ? header : ""}
                          </p>
                          <p className="text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ACTIONS */}
                  {actionCell && (
                    <div className="flex gap-2 mt-3">
                      <ActionButtonTable
                        item={actionCell.column.columnDef}
                        dataArray={row.original}
                        setData={setData}
                        setItemEdit={setItemEdit}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <table className="overflow-auto md:border md:border-gray-300 dark:border-[#0b111e] ">
              <thead className={`relative z-50 hidden sm:table-header-group`}>
                {table?.getHeaderGroups()?.map((headerGroup) => (
                  <tr
                    key={headerGroup?.id}
                    className=" sm:table-row sticky top-0 z-10 sm:z-10 uppercase dark:bg-[#0b111e] "
                  >
                    <th className="w-px">#</th>
                    {headerGroup?.headers?.map((header) => (
                      <th
                        key={header?.id}
                        onClick={header?.column?.getToggleSortingHandler()}
                        className={`${isEmptyItem(header?.column?.columnDef?.classTh, "")}`}
                      >
                        {flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext(),
                        )}
                        {header?.column?.getIsSorted() === "asc" && " 🔼"}
                        {header?.column?.getIsSorted() === "desc" && " 🔽"}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {(status === "pending" || data?.pages[0]?.count === 0) && (
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
                        ref={isLastRow ? lastRowRef : null}
                        className="hidden sm:table-row group"
                      >
                        <td className="text-center">{index + 1}.</td>
                        {row.getVisibleCells().map((item) => (
                          <td
                            key={item?.id}
                            className={`${isEmptyItem(
                              item?.column?.columnDef?.classTd,
                              "",
                            )}`}
                          >
                            {item?.column?.columnDef?.header === "status" ? (
                              <Pills
                                variant={
                                  flexRender(
                                    item?.getValue(),
                                    item?.getContext(),
                                  )
                                    ? "active"
                                    : "inactive"
                                }
                              >
                                {flexRender(
                                  item?.getValue(),
                                  item?.getContext(),
                                )
                                  ? "Active"
                                  : "Inactive"}
                              </Pills>
                            ) : (
                              flexRender(
                                item?.column?.columnDef?.cell,
                                item?.getContext(),
                              )
                            )}

                            {item?.column?.columnDef?.accessorKey ===
                              "action" && (
                              <ActionButtonTable
                                item={item?.column?.columnDef}
                                dataArray={row.original}
                                setData={setData}
                                setItemEdit={setItemEdit}
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
