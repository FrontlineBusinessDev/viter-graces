import AddButton from "@/components/buttons/AddButton";
import NoData from "@/components/NoData";
import SearchBar from "@/components/SearchBar";
import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion } from "@/config/config";
import ActionButtonTable from "@/layout/ActionButtonTable";
import ModalAction from "@/layout/modal/ModalAction";
import TableDefaultStatusDot from "@/layout/TableDefaultStatusDot";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useCallback, useMemo, useRef } from "react";
import InfiniteSubTable from "./InfiniteSubTable";

const InfinitePerTabs = ({
  columns,
  subColumnsTable,
  path,
  subPath,
  setItemEdit,
  setItemVal,
  isSearch = false,
  ishaveAdd = false,
  ishaveSubAdd = true,
  isDefaultMobile = "default",
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [openRow, setOpenRow] = React.useState(null);
  const [dataItem, setData] = React.useState(null);
  const search = React.useRef(null);
  const [onSearch, setOnSearch] = React.useState(false);
  const observer = useRef();
  let counter = 1;

  // ACTIONS ADD
  const handleAdd = () => {
    dispatch(setIsAdd(true));
    setItemEdit(null);
  };

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
    queryKey: [path, search.current?.value],
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        null,
        `${apiVersion}/${path}/page/${pageParam}`,
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
  let arrayContact = [];
  return (
    <>
      <div className="sm:flex justify-between flex-row-reverse mb-3 gap-4 ">
        <div className="flex justify-end sm:mb-0! mb-3 ">
          <AddButton value={path?.replaceAll("-", " ")} onClick={handleAdd} />
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
            arrayContact = getConvertStringToJSONparseData(
              rows[index]?.original?.suppliers_contact_person,
            );

            return (
              <div
                key={index}
                ref={isLastRow ? lastRowRef : null}
                className="rounded-2xl border border-gray-300 bg-white shadow-sm dark:border-[#0b111e] dark:bg-[#0b111e] "
              >
                <div className="px-4 py-4 lg:px-5">
                  <div className="flex flex-col gap-2 lg:grid lg:grid-cols-[40px_1.5fr_1fr_1fr_1.3fr_140px] lg:items-center">
                    <div className="hidden lg:block text-gray-500 text-sm dark:text-light">
                      {counter++}.
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
                          return (
                            <React.Fragment key={akey}>
                              <div className="min-w-0">
                                {aitem?.column?.columnDef?.header === "name" ? (
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
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3 justify-end lg:hidden">
                        {item.getVisibleCells().map((bitem, bkey) => {
                          return bitem?.column?.columnDef?.header ===
                            "social" ? (
                            <React.Fragment key={bkey}>
                              {isEmptyItem(
                                rows[index]?.original?.messenger,
                                "",
                              ) !== "" &&
                              bitem?.column?.columnDef?.accessorKey ===
                                "messenger" ? (
                                <a
                                  href={`${bitem?.column?.columnDef?.link}`}
                                  target="_black"
                                >
                                  {bitem?.column?.columnDef?.icon}
                                </a>
                              ) : (
                                ""
                              )}
                              {isEmptyItem(
                                rows[index]?.original?.whatsapp,
                                "",
                              ) !== "" &&
                              bitem?.column?.columnDef?.accessorKey ===
                                "whatsapp" ? (
                                <a
                                  href={`${bitem?.column?.columnDef?.link}`}
                                  target="_black"
                                >
                                  {bitem?.column?.columnDef?.icon}
                                </a>
                              ) : (
                                ""
                              )}
                              {isEmptyItem(rows[index]?.original?.other, "") !==
                                "" &&
                              bitem?.column?.columnDef?.accessorKey ===
                                "other" ? (
                                <a href={`${bitem?.column?.columnDef?.link}`}>
                                  {bitem?.column?.columnDef?.icon}
                                </a>
                              ) : (
                                ""
                              )}
                            </React.Fragment>
                          ) : (
                            ""
                          );
                        })}
                      </div>
                    </div>
                    {item.getVisibleCells().map((ditem, dkey) => {
                      return (
                        <React.Fragment key={dkey}>
                          {ditem?.column?.columnDef?.header ===
                          "second_column" ? (
                            <p className="text-xs text-gray-500 lg:hidden dark:text-light">
                              {flexRender(
                                ditem?.column?.columnDef?.cell,
                                ditem?.getContext(),
                              )}
                            </p>
                          ) : (
                            ""
                          )}
                        </React.Fragment>
                      );
                    })}
                    {item.getVisibleCells().map((eitem, ekey) => {
                      return (
                        <React.Fragment key={ekey}>
                          {eitem?.column?.columnDef?.header === "contact" ? (
                            <div className="text-sm text-gray-700 dark:text-light flex items-center gap-1">
                              <span className="text-xs text-gray-400 lg:hidden">
                                {eitem?.column?.columnDef?.icon}
                              </span>
                              <span>
                                {flexRender(
                                  eitem?.column?.columnDef?.cell,
                                  eitem?.getContext(),
                                )}
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                        </React.Fragment>
                      );
                    })}

                    <div className="hidden lg:flex items-center gap-3 justify-end">
                      {item.getVisibleCells().map((bitem, bkey) => {
                        return bitem?.column?.columnDef?.header === "social" ? (
                          <React.Fragment key={bkey}>
                            {isEmptyItem(
                              rows[index]?.original?.messenger,
                              "",
                            ) !== "" &&
                            bitem?.column?.columnDef?.accessorKey ===
                              "messenger" ? (
                              <a
                                href={`${bitem?.column?.columnDef?.link}`}
                                target="_black"
                              >
                                {bitem?.column?.columnDef?.icon}
                              </a>
                            ) : (
                              ""
                            )}
                            {isEmptyItem(
                              rows[index]?.original?.whatsapp,
                              "",
                            ) !== "" &&
                            bitem?.column?.columnDef?.accessorKey ===
                              "whatsapp" ? (
                              <a
                                href={`${bitem?.column?.columnDef?.link}`}
                                target="_black"
                              >
                                {bitem?.column?.columnDef?.icon}
                              </a>
                            ) : (
                              ""
                            )}
                            {isEmptyItem(rows[index]?.original?.other, "") !==
                              "" &&
                            bitem?.column?.columnDef?.accessorKey ===
                              "other" ? (
                              <a href={`${bitem?.column?.columnDef?.link}`}>
                                {bitem?.column?.columnDef?.icon}
                              </a>
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                        ) : (
                          ""
                        );
                      })}
                    </div>

                    <div className=" flex justify-end lg:items-center text-gray-700 dark:text-light">
                      {item.getVisibleCells().map((fitem, fkey) => {
                        return (
                          <React.Fragment key={fkey}>
                            {fitem?.column?.columnDef?.accessorKey ===
                            "action" ? (
                              <ActionButtonTable
                                item={fitem?.column?.columnDef}
                                dataArray={rows[index]?.original}
                                setData={setData}
                                setItemEdit={setItemEdit}
                                path={path}
                              />
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-200 px-4 lg:px-5 pb-4 pt-3  ">
                    <div className="grid lg:grid-cols-3 my-3">
                      {ishaveSubAdd ? (
                        <>
                          {item.getVisibleCells().map((gitem, gkey) => {
                            return (
                              <React.Fragment key={gkey}>
                                {gitem?.column?.columnDef?.header ===
                                "stringArray" ? (
                                  <div className="flex gap-2">
                                    <p>{gitem?.column?.columnDef?.label}:</p>
                                    <div className="text-black dark:text-light">
                                      {arrayContact?.map((gitem, gkey) => {
                                        return (
                                          <p key={gkey}>
                                            {gitem?.contact_name}{" "}
                                            {`(${gitem?.contact_phone})`}
                                          </p>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </React.Fragment>
                            );
                          })}
                          {item.getVisibleCells().map((hitem, hkey) => {
                            return (
                              <React.Fragment key={hkey}>
                                {hitem?.column?.columnDef?.header ===
                                "suppliers_delivery" ? (
                                  <div className="flex gap-2">
                                    <p>{hitem?.column?.columnDef?.label}:</p>
                                    <div className="text-black dark:text-light">
                                      <p className="font-semibold">
                                        {flexRender(
                                          hitem?.column?.columnDef?.cell,
                                          hitem?.getContext(),
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </React.Fragment>
                            );
                          })}
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    <InfiniteSubTable
                      columns={subColumnsTable}
                      className={`sm:overflow-auto max-h-[calc(93dvh-200px)] min-h-full`}
                      path={subPath}
                      data={rows[index]?.original}
                      setItemEdit={setItemEdit}
                      isSearch={isSearch}
                      ishaveAdd={ishaveAdd}
                      ishaveSubAdd={ishaveSubAdd}
                      isDefaultMobile={isDefaultMobile}
                      setItemVal={setItemVal}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {store.isAction && (
        <ModalAction
          mysqlApiAction={`${apiVersion}/${path}/${dataItem?.path}`}
          msg={`Are you sure you want to ${dataItem?.action}`}
          successMsg={`${dataItem?.action} successfully.`}
          item={dataItem}
          queryKey={`${path}`}
        />
      )}
    </>
  );
};

export default InfinitePerTabs;
