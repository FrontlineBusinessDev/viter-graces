import AddButton from "@/components/buttons/AddButton";
import NoData from "@/components/NoData";
import SearchBar from "@/components/SearchBar";
import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import TableSpinner from "@/components/spinners/TableSpinner";
import { apiVersion } from "@/config/config";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";
import ModalAction from "../modal/ModalAction";

const TableDefaultPage = ({
  children,
  theadList = [],
  search,
  result,
  dataItem = null,
  classname = "",
  ref = null,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [isTableScroll, setIsTableScroll] = React.useState(false);
  const scrollRef = ref ? ref : React.useRef(null);

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      setIsTableScroll(false);
    }
    if (e.target.scrollTop > 0) {
      setIsTableScroll(true);
    }
  };
  return (
    <>
      <div className="flex justify-between mb-3">
        <div className="w-full sm:max-w-80">
          <SearchBar
            search={search}
            dispatch={dispatch}
            // setOnSearch={result?.setOnSearch}
            // onSearch={result?.onSearch}
          />
        </div>
        <div>
          <AddButton value={"User"} />
        </div>
      </div>
      <div className="">
        {/* TABLE */}
        <div className="relative rounded-md text-center overflow-auto z-0 ">
          {result?.loading !== "pending" && result?.isFetching && (
            <TableSpinner />
          )}
          {/* TABLE */}
          <div
            className={`md:overflow-auto md:h-[calc(100dvh-230px)] h-[calc(100dvh-270px)] ${classname}`}
            ref={scrollRef}
            onScroll={(e) => handleScroll(e)}
          >
            <table className="overflow-auto ">
              <thead className={`${isTableScroll && "relative"} z-50 `}>
                <tr className="hidden sm:table-row sticky top-0 z-10 capitalize ">
                  <th className="min-w-4 w-12 ">#</th>
                  {theadList?.map((item, key) => (
                    <th className={`${item.class} `} key={key}>
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/*
                <tr className="">
                  <td colSpan="100%" className="p-10">
                    {result?.loading === "pending" ? (
                      <TableLoading count={20} cols={3} />
                    ) : (
                      <NoData />
                    )}
                  </td>
                </tr>  {(result?.loading === "pending" ||
                  (result?.loading !== "error" &&
                    result?.pages[0]?.count === 0)) && (
                  <tr className="">
                    <td colSpan="100%" className="p-10">
                      {result?.loading === "pending" ? (
                        <TableLoading count={20} cols={3} />
                      ) : (
                        <NoData />
                      )}
                    </td>
                  </tr>
                )} 

                {result?.error && (
                  <tr>
                    <td colSpan="100%" className="p-10">
                      <ServerError />
                    </td>
                  </tr>
                )}*/}

                {children}
              </tbody>
            </table>
            {/* {result?.loading === "success" && (
              <div className="loadmore flex justify-center flex-col items-center pb-10">
                <Loadmore
                  fetchNextPage={result?.fetchNextPage}
                  isFetchingNextPage={result?.isFetchingNextPage}
                  hasNextPage={result?.hasNextPage}
                  result={result?.pages[0]}
                  setPage={result?.setPage}
                  page={result?.page}
                  refView={result?.ref}
                  isSearchOrFilter={store.isSearch || result?.isFilter}
                />
              </div>
            )} */}
          </div>
        </div>

        {store.isArchive && (
          <ModalAction
            mysqlApiArchive={`${apiVersion}/`}
            msg={`Are you sure you want to ${
              isEmptyItem(dataItem?.isSuspend, "0") === "1"
                ? " suspend "
                : " archive "
            } `}
            successMsg={`${
              isEmptyItem(dataItem?.isSuspend, "0") === "1"
                ? "Suspend "
                : "Archive "
            } successfully.`}
            item={dataItem}
            queryKey={result?.key}
          />
        )}
      </div>
    </>
  );
};

export default TableDefaultPage;
