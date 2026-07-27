import AddButton from "@/components/buttons/AddButton";
import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { DateFormat } from "@/components/DateFormat";
import { DebouncedInput } from "@/components/inputs/InputText";
import NoData from "@/components/NoData";
import SearchBar from "@/components/SearchBar";
import ServerError from "@/components/ServerError";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { setIsAdd, setIsSubAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
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
import MobileResponsiveList from "../mobile-responsive/MobileResponsiveList";
import ModalAction from "../modal/ModalAction";
import { renderCellContent } from "./function-table";
import { ProductOwnerId } from "@/utilities/productOwnerToken";

const InfiniteTable = ({
  columns,
  className,
  path = "",
  addLabel = path?.replaceAll("-", " "),
  setItemEdit = () => {},
  setSearchValue = () => {},
  setFilterColumns = () => {},
  haveFilterTable = false,
  hasExport = false,
  isSearch = true,
  ishaveAdd = true,
  ishaveSubAdd = false,
  dataTestidAddButton,
  refetchOnWindowFocus = false,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [dataItem, setData] = React.useState(null);
  const [sorting, setSorting] = useState([]);

  let filterName = isEmptyItem(
    JSON.parse(window.sessionStorage.getItem("filter")),
    "",
  );

  let defaultValue =
    path === "sales-order"
      ? [
          {
            id: "sales_order_date",
            value: store.credentials?.data?.server_date,
          },
        ]
      : [];

  const observer = useRef();
  const search = React.useRef(null);
  const [onSearch, setOnSearch] = React.useState(false);
  const [page, setPage] = useState(1);

  const userId = ProductOwnerId(store);

  const [columnFilters, setColumnFilters] = useState(
    search.current?.value ? [] : filterName !== "" ? filterName : defaultValue,
  );

  const searchPayload = useMemo(
    () => ({
      searchValue: search.current?.value || "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: "",
      userId: userId,
    }),
    [store.isSearch, search.current?.value || ""],
  );

  const queryKey = useMemo(
    () => [
      path,
      store.isSearch,
      search.current?.value || "",
      JSON.stringify({ columnFilters }),
    ],
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
        `${apiVersion}/${path}/page/${pageParam}`,
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
      return;
    },
    refetchOnWindowFocus: refetchOnWindowFocus,
    // staleTime: 1000 * 60 * 5, // 5 mins → no refetch when revisiting
    // gcTime: 1000 * 60 * 30, // keep cache for 30 mins
    // refetchOnMount: true,
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,

    // enabled: !isStatic,
  });
  const pages = result?.pages;

  const tableData = useMemo(() => {
    return pages?.flatMap((page) => page.data ?? []) ?? [];
  }, [pages]);

  const lastRowRef = useCallback(
    (node) => {
      if (!node) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      observer.current.observe(node);
    },
    [hasNextPage, fetchNextPage],
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
        if (filterName !== "" && columnId === "customer_name") {
          return row.getValue(columnId) === filterName[0]?.value;
        }

        return row.getValue(columnId) === value;
      },
      date: (row, columnId, value) => {
        if (
          path === "sales-order" &&
          columnId === "sales_order_date" &&
          value !== store.credentials?.data?.server_date
        ) {
          return row.getValue(columnId) === DateFormat(value);
        } else {
          return (
            row.getValue(columnId) ===
            DateFormat(store.credentials?.data?.server_date)
          );
        }
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

  // console.log("rows", rows);
  // console.log("tableData", tableData);
  // console.log("getHeaderGroups", table?.getHeaderGroups());

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

  const renderEmptyState = () => {
    if (status === "pending") return <TableLoading count={20} cols={3} />;

    return <NoData />;
  };

  React.useEffect(() => {
    if (columnFilters !== "") {
      setFilterColumns(columnFilters);
    }
  }, [columnFilters]);

  console.log("columnFilters", columnFilters);
  return (
    <>
      <div className="md:flex md:justify-between flex-row-reverse my-2 gap-4 items-center">
        {ishaveAdd && (
          <div className="flex justify-end sm:mb-0! mb-3 md:w-1/2 ">
            <AddButton
              value={addLabel}
              onClick={handleAdd}
              testId={dataTestidAddButton}
            />
          </div>
        )}
        {ishaveSubAdd && (
          <div className="flex justify-end sm:mb-0! mb-3  ">
            <AddButton
              value={addLabel}
              onClick={handleSubAdd}
              testId={dataTestidAddButton}
            />
          </div>
        )}

        {hasExport && (
          <div className="flex md:justify-end lg:mb-0! w-70 ">
            <ExportCSVButton />
          </div>
        )}
        {isSearch && (
          <div
            className={`${haveFilterTable ? " lg:hidden " : " "} ${path === "sales-order" ? " sm:grid grid-cols-[10rem_1fr] gap-2 " : " "} w-full `}
          >
            {path === "sales-order" && (
              <div className="mt-1 md:mt-3">
                <input
                  type={"date"}
                  value={isEmptyItem(columnFilters[0]?.value, "")}
                  onChange={(e) => {
                    setColumnFilters([
                      {
                        id: "sales_order_date",
                        value: e.target.value,
                      },
                    ]);
                  }}
                  className="text-xs h-[30px]"
                  data-testid={"sales_order_date"}
                />
              </div>
            )}
            <SearchBar
              search={search}
              dispatch={dispatch}
              setOnSearch={setOnSearch}
              onSearch={onSearch}
              label={"Search..."}
              className="mb-3 mt-1 md:my-3 "
            />
          </div>
        )}
      </div>
      {columnFilters?.length > 0 && (
        <>
          <ul className="lg:hidden mb-2 flex items-center flex-wrap gap-2">
            <li>Filtered by:</li>
            {columnFilters?.map((a) => (
              <li key={a?.id} className="bg-gray-100 px-2 py-1 rounded-sm">
                {a.value}
              </li>
            ))}
            <li className="bg-gray-400 cursor-pointer hover:bg-primary text-white px-2 py-1 rounded-sm">
              <button
                onClick={() => {
                  setColumnFilters([]);
                }}
              >
                Clear
              </button>
            </li>
          </ul>
        </>
      )}
      <div className="">
        <div className="relative rounded-xl md:text-center overflow-auto z-0 ">
          <div className={`${className} `}>
            {(status === "pending" || rows?.length === 0) && (
              <div className="lg:hidden p-10">{renderEmptyState()}</div>
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
              isDefaultMobile={path}
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
                      <th className="w-px  ">{/* {rows?.length} */}</th>
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
                            {renderCellContent(item, rowData, path)}

                            {/* FOR ACTION BUTTONS */}
                            {item?.column?.columnDef?.accessorKey ===
                              "action" && (
                              <ActionButtonTable
                                item={item?.column?.columnDef}
                                dataArray={rowData}
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
