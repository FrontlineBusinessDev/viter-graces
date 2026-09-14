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
import { FaCaretDown, FaFacebookMessenger } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import ExportModal from "@/components/modals/ExportModal";
import ActionButtonTable from "../ActionButtonTable";
import MobileResponsiveList from "../mobile-responsive/MobileResponsiveList";
import ModalAction from "../modal/ModalAction";
import { renderCellContent } from "./function-table";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import ActiveFilterTagBar from "./ActiveFilterTagBar";
import InfiniteSubTable from "./InfiniteSubTable";

// Shared by the dateRange/multiDateRange filterFns below. Columns vary
// between raw ISO dates ("2026-09-03") and formatted display aliases
// ("Sep 03, 2026"). Rather than compare Date objects (an ISO date-only
// string parses as UTC midnight, but "Sep 03, 2026" parses as LOCAL midnight
// - mixing the two silently shifts the comparison by a day in any non-UTC
// timezone), normalize everything to a plain "YYYY-MM-DD" string first and
// compare those lexically. Returns null when the raw value can't be dated.
const toDateOnlyString = (raw) => {
  if (raw === null || raw === undefined || raw === "") return null;

  const isoMatch = String(raw).match(/^\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return undefined;

  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Prefixes a raw handle ("facebook.com/bananadealer") with https:// so it's
// a clickable link, but leaves an already-qualified URL alone.
const toExternalLink = (raw) => {
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
};

const InfiniteFilterWithDropDown = ({
  columns,
  className,
  path = "",
  addLabel = path?.replaceAll("-", " "),
  setItemEdit = () => {},
  setSearchValue = () => {},
  setFilterColumns = () => {},
  setDataCount = () => {},
  haveFilterTable = false,
  hasExport = false,
  isSearch = true,
  ishaveAdd = true,
  ishaveSubAdd = false,
  dataTestidAddButton,
  // Expandable nested sub-table (e.g. a supplier's products). Optional and
  // opt-in: when `subColumnsTable` isn't passed, no toggle renders and every
  // other page using this table is unaffected.
  subColumnsTable = null,
  subPath = "",
  setItemVal = () => {},
  ishaveSubTableAdd = false,
  // Optional (a, b) comparator applied to the flattened, fetched rows before
  // they're handed to the table - a page-specific default order layered on
  // top of whatever the backend already returns, without touching every
  // other table that uses this component. A user-initiated column-header
  // sort (the `sorting` state below) still takes priority over this.
  sortComparator = null,
  refetchOnWindowFocus = false,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [dataItem, setData] = React.useState(null);
  const [sorting, setSorting] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [openRow, setOpenRow] = useState(null);

  let filterName = isEmptyItem(
    JSON.parse(window.sessionStorage.getItem("filter")),
    "",
  );

  const todayServerDate = store.credentials?.data?.server_date;

  let defaultValue =
    path === "sales-order"
      ? [
          {
            id: "sales_order_date",
            value: [
              {
                id: "default-today",
                start: todayServerDate,
                end: todayServerDate,
              },
            ],
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

  // the incoming filter is only meant for this one mount (e.g. navigating
  // here from an "Open Credit Memo" click) - consume it once so a later
  // remount of this same page (browser back/forward, etc.) doesn't silently
  // re-apply a stale filter from an unrelated page
  React.useEffect(() => {
    window.sessionStorage.removeItem("filter");
  }, []);

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
  });
  const pages = result?.pages;

  const tableData = useMemo(() => {
    const flattened = pages?.flatMap((page) => page.data ?? []) ?? [];
    return sortComparator ? [...flattened].sort(sortComparator) : flattened;
  }, [pages, sortComparator]);

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
        if (filterName !== "") {
          return row.getValue(columnId) === filterName[0]?.value;
        }

        return String(row.getValue(columnId)) === String(value);
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
      // multi-select filter: OR the checked values together. Values are
      // usually strings (e.g. "paid", "cash"), but some columns (is_active,
      // restocked) filter on 0/1 - stringify both sides so a numeric filter
      // value still matches a numeric or string row value either way.
      multiSelect: (row, columnId, value) => {
        if (!Array.isArray(value) || value.length === 0) return true;

        return value.map(String).includes(String(row.getValue(columnId)));
      },
      // date range filter: pair with DateRangeFilter (InputRangeFilter.jsx).
      dateRange: (row, columnId, value) => {
        const { start, end } = value || {};
        if (!start && !end) return true;

        const rowDateStr = toDateOnlyString(row.getValue(columnId));
        if (rowDateStr === null) return false;
        if (rowDateStr === undefined) return true;

        if (start && rowDateStr < start) return false;
        if (end && rowDateStr > end) return false;

        return true;
      },
      // multi-range filter: pair with MultiRangeAmountFilter
      // (InputRangeFilter.jsx). A row matches if it falls inside ANY of the
      // selected [min, max] ranges (OR'd together).
      multiRange: (row, columnId, value) => {
        if (!Array.isArray(value) || value.length === 0) return true;

        const rowValue = row.getValue(columnId);

        return value.some(({ min, max }) => {
          if (min !== undefined && min !== "" && rowValue < min) return false;
          if (max !== undefined && max !== "" && rowValue > max) return false;
          return true;
        });
      },
      // multi-range date filter: pair with MultiRangeDateFilter
      // (InputRangeFilter.jsx). A row matches if its date falls inside ANY of
      // the selected start/end spans (OR'd together).
      multiDateRange: (row, columnId, value) => {
        if (!Array.isArray(value) || value.length === 0) return true;

        // Flexible-plan orders have no fixed due date to fall inside a
        // range, so they're matched separately here and OR'd together with
        // any selected date ranges (see MultiRangeDateFilter's allowFlexible
        // prop) rather than one excluding the other. Other columns using
        // this filterFn never produce a `.flexible` item, so this is a
        // no-op for them.
        const flexibleMarker = value.find((range) => range.flexible);
        const ranges = value.filter((range) => !range.flexible);

        if (flexibleMarker) {
          const rowData = row.original;
          const paymentTerms =
            rowData?.sales_order_payment_terms?.toLowerCase();
          const installmentType =
            rowData?.sales_order_installment_type?.toLowerCase();

          // sales_order_installment_type defaults to "flexible" on every
          // order regardless of payment terms, so this must also require
          // payment terms = installment or it'd match every order.
          const isFlexibleRow =
            paymentTerms === "installment" &&
            (["flexible", "customize"].includes(installmentType) ||
              !row.getValue(columnId));

          if (isFlexibleRow) return true;
        }

        if (ranges.length === 0) return false;

        const rowDateStr = toDateOnlyString(row.getValue(columnId));
        if (rowDateStr === null) return false;
        if (rowDateStr === undefined) return true;

        return ranges.some(({ start, end }) => {
          if (start && rowDateStr < start) return false;
          if (end && rowDateStr > end) return false;
          return true;
        });
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
    if (isFetching) {
      setDataCount("...Loading");
    } else {
      setDataCount(rows?.length);
    }
  }, [columnFilters, isFetching]);

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
            <ExportCSVButton onClick={() => setShowExportModal(true)} />
          </div>
        )}
        {isSearch && (
          <div
            className={`${haveFilterTable ? " lg:hidden " : " "} ${path === "sales-order" ? " sm:grid grid-cols-[10rem_1fr] gap-2 " : " "} w-full `}
          >
            {path === "sales-order" && columnFilters?.length > 0 && (
              <>
                <div className="mt-1 md:mt-3">
                  <input
                    type={"date"}
                    defaultValue={
                      Array.isArray(columnFilters[0]["value"])
                        ? isEmptyItem(columnFilters[0]["value"][0]?.start, "")
                        : ""
                    }
                    onChange={(e) => {
                      setColumnFilters([
                        {
                          id: "sales_order_date",
                          value: [
                            {
                              id: "mobile-quick-filter",
                              start: e.target.value,
                              end: e.target.value,
                            },
                          ],
                        },
                      ]);
                    }}
                    className="text-xs h-[30px]"
                    data-testid={"sales_order_date"}
                  />
                </div>
              </>
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
      <ActiveFilterTagBar
        table={table}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
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
              setItemVal={setItemVal}
              isDefaultMobile={path}
              ishaveSubAdd={ishaveSubAdd}
              subColumnsTable={subColumnsTable}
              subPath={subPath}
              ishaveSubTableAdd={ishaveSubTableAdd}
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
                    {subColumnsTable && <th className="w-px "></th>}
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
                      {subColumnsTable && <th className="w-px  "></th>}
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
                  const isOpen = subColumnsTable && openRow === row.id;
                  const toggleRow = () => setOpenRow(isOpen ? null : row.id);

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
                        {subColumnsTable && (
                          <td className="text-center">
                            <button
                              type="button"
                              onClick={toggleRow}
                              className="inline-flex items-center justify-center cursor-pointer"
                              data-testid="button-toggle-sub-row"
                            >
                              <FaCaretDown
                                className={`h-4 w-4 text-gray-600 dark:text-light font-bold transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </td>
                        )}
                        {row.getVisibleCells().map((item) => (
                          <td
                            key={item?.id}
                            className={` ${isEmptyItem(item?.column?.columnDef?.classTd, "")} `}
                          >
                            {renderCellContent(item, rowData, path)}

                            {/* FOR ACTION BUTTONS */}
                            {item?.column?.columnDef?.accessorKey ===
                              "action" && (
                              <>
                                {item?.column?.columnDef?.haveAction ? (
                                  <>
                                    {rowData?.is_view === 1 && (
                                      <ActionButtonTable
                                        item={item?.column?.columnDef}
                                        dataArray={rowData}
                                        setData={setData}
                                        setItemEdit={setItemEdit}
                                        ishaveSubAdd={ishaveSubAdd}
                                        path={path}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <>
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
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        ))}
                      </tr>

                      {isOpen && (
                        <tr className="hidden lg:table-row">
                          <td
                            colSpan="100%"
                            className="bg-[#F6F7F9] dark:bg-[#0b111e] border-t border-gray-200 dark:border-[#1f2b47] p-4"
                          >
                            <div className="grid xs:grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs text-left">
                              <div>
                                <small className="font-bold uppercase text-[9px] text-gray-500 dark:text-light">
                                  Messenger
                                </small>
                                <br />
                                {rowData?.suppliers_messenger ? (
                                  <a
                                    href={toExternalLink(
                                      rowData.suppliers_messenger,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-blue-600 hover:underline"
                                  >
                                    <FaFacebookMessenger size={12} />
                                    {rowData.suppliers_messenger}
                                  </a>
                                ) : (
                                  <span>none</span>
                                )}
                              </div>
                              <div>
                                <small className="font-bold uppercase text-[9px] text-gray-500 dark:text-light">
                                  WhatsApp
                                </small>
                                <br />
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
                              </div>
                              <div>
                                <small className="font-bold uppercase text-[9px] text-gray-500 dark:text-light">
                                  Other Social
                                </small>
                                <br />
                                {rowData?.suppliers_other ? (
                                  <a
                                    href={toExternalLink(
                                      rowData.suppliers_other,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 hover:underline"
                                  >
                                    {rowData.suppliers_other}
                                  </a>
                                ) : (
                                  <span>none</span>
                                )}
                              </div>
                              <div>
                                <small className="font-bold uppercase text-[9px] text-gray-500 dark:text-light">
                                  Delivery
                                </small>
                                <br />
                                <span>
                                  {isEmptyItem(
                                    rowData?.suppliers_delivery,
                                    "none",
                                  )}
                                </span>
                              </div>
                              <div>
                                <small className="font-bold uppercase text-[9px] text-gray-500 dark:text-light">
                                  Other Contacts
                                </small>
                                <br />
                                {getConvertStringToJSONparseData(
                                  rowData?.suppliers_contact_person,
                                )?.length > 0 ? (
                                  getConvertStringToJSONparseData(
                                    rowData?.suppliers_contact_person,
                                  ).map((contact, contactKey) => (
                                    <p key={contactKey} className="m-0!">
                                      {contact?.contact_name}{" "}
                                      {`(${contact?.contact_phone})`}
                                    </p>
                                  ))
                                ) : (
                                  <span>none</span>
                                )}
                              </div>
                              <div className="xs:col-span-2 md:col-span-4">
                                <small className="font-bold uppercase text-[9px] text-gray-500 dark:text-light">
                                  Notes
                                </small>
                                <br />
                                <span>
                                  {isEmptyItem(
                                    rowData?.suppliers_notes,
                                    "none",
                                  )}
                                </span>
                              </div>
                            </div>

                            <InfiniteSubTable
                              columns={subColumnsTable}
                              className="sm:overflow-auto max-h-[calc(93dvh-200px)] min-h-full"
                              path={subPath}
                              data={rowData}
                              setItemEdit={setItemEdit}
                              setItemVal={setItemVal}
                              ishaveSubAdd={ishaveSubTableAdd}
                              haveFilterTable={haveFilterTable}
                              isDefaultMobile={subPath}
                            />
                          </td>
                        </tr>
                      )}
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
      {showExportModal && (
        <ExportModal
          columns={columns}
          path={path}
          columnFilters={columnFilters}
          searchValue={search.current?.value}
          isDeveloper={searchPayload.isDeveloper}
          userId={userId}
          defaultFileName={path}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </>
  );
};

export default InfiniteFilterWithDropDown;
