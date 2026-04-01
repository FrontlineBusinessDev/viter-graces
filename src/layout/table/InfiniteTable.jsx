import NoData from "@/components/NoData";
import Pills from "@/components/Pills";
import ServerError from "@/components/ServerError";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import TableLoading from "@/components/spinners/TableLoading";
import TableSpinner from "@/components/spinners/TableSpinner";
import { apiVersion } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useRef, useState } from "react";

const InfiniteTable = ({ columns, className }) => {
  const [sorting, setSorting] = useState([]);
  const observer = useRef();

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
    queryKey: ["roles"],
    queryFn: async ({ pageParam = 1 }) =>
      await queryDataInfinite(
        `null`,
        `${apiVersion}/roles/page/${pageParam}`,
        false,
        {
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
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table?.getRowModel()?.rows;
  return (
    <div className="hidden sm:block">
      {/* TABLE */}
      <div className="relative rounded-md text-center overflow-auto z-0 ">
        {status !== "loading" && isFetching && <TableSpinner />}
        <div className={`${className} pr-6! `}>
          <table className="overflow-auto dark:border-[#0b111e]">
            <thead className={`relative z-50`}>
              {table?.getHeaderGroups()?.map((headerGroup) => (
                <tr
                  key={headerGroup?.id}
                  className="hidden sm:table-row sticky top-0 z-10 sm:z-10 capitalize dark:bg-[#0b111e] "
                >
                  <th className="w-px">#</th>
                  {headerGroup?.headers?.map((header) => (
                    <th
                      key={header?.id}
                      onClick={header?.column?.getToggleSortingHandler()}
                      className={`${header?.column?.columnDef?.classTh}`}
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
              {(status === "loading" || data?.pages[0]?.count === 0) && (
                <tr>
                  <td colSpan="100%" className="p-10">
                    {status === "loading" ? (
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
                return (
                  <tr
                    key={row.id}
                    ref={isLastRow ? lastRowRef : null}
                    className="hidden sm:table-row group"
                  >
                    <td className="text-center">{index + 1}.</td>
                    {row.getVisibleCells().map((item) => (
                      <td
                        key={item?.id}
                        className={`${item?.column?.columnDef?.classTd}`}
                      >
                        {item?.column?.columnDef?.header === "status" ? (
                          <Pills>
                            {flexRender(item?.getValue(), item?.getContext())
                              ? "Active"
                              : "Inactive"}
                          </Pills>
                        ) : (
                          flexRender(
                            item?.column?.columnDef?.cell,
                            item?.getContext(),
                          )
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {isFetchingNextPage && (
            <button className="text-center h-full relative text-primary rounded-full w-full disabled:opacity-50 disabled:cursor-not-allowed ">
              {isFetchingNextPage ? <ButtonSpinner /> : <span>Load more</span>}
            </button>
          )}
          {!hasNextPage && (
            <div className="text-center my-8 p-1.5">
              <p className="mb-0 ">End of list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfiniteTable;
