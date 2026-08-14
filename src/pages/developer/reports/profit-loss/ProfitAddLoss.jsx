import { DateFormat } from "@/components/DateFormat";
import { SearchableSelectFilterProductOwner } from "@/components/inputs/InputSelect";
import { AmountWithPesoSign } from "@/components/PesoSign";
import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion } from "@/config/config";
import HeaderNav from "@/layout/headers/HeaderNav";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import {
  ProductOwnerId,
  ProductOwnerName,
} from "@/utilities/productOwnerToken";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import React, { useMemo } from "react";

const ProfitAddLoss = () => {
  const { store } = React.useContext(StoreContext);
  const [dateFrom, setDateFrom] = React.useState(
    store.credentials?.data?.server_date,
  );
  const [dateTo, setDateTo] = React.useState(
    store.credentials?.data?.server_date,
  );
  const [productOwner, setProductOwner] = React.useState([
    getAdminDeveloperRole(store)
      ? {
          id: 0,
          value: "",
          label: "",
        }
      : {
          id: ProductOwnerId(store),
          value: ProductOwnerName(store),
          label: ProductOwnerName(store),
        },
  ]);

  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/report-sales-order/read-profite-and-loss`, // endpoint
    "post", // method
    `read-profite-and-loss`, // key
    {
      id: getAdminDeveloperRole(store)
        ? Number(isEmptyItem(productOwner?.id, 0))
        : Number(ProductOwnerId(store)),
      from: dateFrom,
      to: dateTo,
    },
    {
      id: Number(isEmptyItem(productOwner?.id, 0)),
      from: dateFrom,
      to: dateTo,
    },
  );

  const item = useMemo(() => {
    if (!result?.count) return [];

    return isEmptyItem(result?.data[0], []);
  }, [result]);

  return (
    <HeaderNav menu={"reports"} activeTab="profit-&-loss">
      <div className="w-full max-w-2xl my-4 place-self-center text-sm ">
        <div
          className={`grid ${getAdminDeveloperRole(store) ? "  xs:grid-cols-3 " : " xs:grid-cols-2 "} gap-3 `}
        >
          <div>
            <label htmlFor="" className="text-black dark:text-light">
              From
            </label>
            <input
              type="date"
              defaultValue={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="text-black dark:text-light">
              To
            </label>
            <input
              type="date"
              defaultValue={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          {getAdminDeveloperRole(store) ? (
            <div>
              <label htmlFor="" className="text-black dark:text-light ">
                Product Owner
              </label>
              <SearchableSelectFilterProductOwner
                setColumn={setProductOwner}
                column={productOwner}
                path="product-owner/read-by-product-owner"
                testFilterId={"filter-owner"}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        {error && <ServerError />}
        <div className="my-3 space-y-3">
          {/* Profit and loss */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full `}
          >
            <h1 className="text-black dark:text-light md:text-2xl text-lg">
              Profit and Loss
            </h1>
            <ul className="flex justify-between mt-3">
              <li>
                As of
                {dateFrom === dateTo ? (
                  <span className="font-semibold mx-1">
                    {DateFormat(dateFrom)}
                  </span>
                ) : (
                  <>
                    <span className="font-semibold mx-1">
                      {DateFormat(dateFrom)}
                    </span>
                    -
                    <span className="font-semibold ml-1">
                      {DateFormat(dateTo)}
                    </span>
                  </>
                )}
              </li>
              <li>
                Product Owner:
                <span className="text-black dark:text-light font-semibold capitalize ml-1">
                  {isLoading || isFetching ? (
                    <TableLoading count={1} cols={1} />
                  ) : getAdminDeveloperRole(store) ? (
                    productOwner?.label
                  ) : (
                    ProductOwnerName(store)
                  )}
                </span>
              </li>
            </ul>
          </div>

          {/* Income */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full `}
          >
            <p className="text-yellow-500 font-semibold">INCOME</p>
            <ul className="grid grid-cols-2 indent-3 gap-2 border-b pb-2">
              <li>Gross Sales</li>
              <li className="text-black dark:text-light text-right">
                {isLoading || isFetching ? (
                  <TableLoading count={1} cols={1} />
                ) : (
                  <AmountWithPesoSign
                    classN="size-3"
                    amount={item?.gross_sales}
                  />
                )}
              </li>
              <li className="">Tax</li>
              <li className=" text-right">
                {isLoading || isFetching ? (
                  <TableLoading count={1} cols={1} />
                ) : (
                  <AmountWithPesoSign
                    classN="size-3"
                    amount={item?.tax_amount}
                  />
                )}
              </li>
              <li className="text-red-500">Less: Discounts</li>
              <li className="text-red-500 text-right">
                {isLoading || isFetching ? (
                  <TableLoading count={1} cols={1} />
                ) : (
                  <AmountWithPesoSign
                    classN="size-3"
                    amount={item?.less_discount}
                  />
                )}
              </li>
            </ul>
            <ul className="grid grid-cols-2 mt-3 text-black dark:text-white font-semibold">
              <li>Net Sales</li>
              <li>
                {isLoading || isFetching ? (
                  <TableLoading count={1} cols={1} />
                ) : (
                  <AmountWithPesoSign
                    classN="size-3"
                    amount={item?.net_sales}
                  />
                )}
              </li>
            </ul>
          </div>

          {/* Operating Expenses */}
          <div
            className={`bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 shadow-xs w-full `}
          >
            <p className="text-red-500 font-semibold">OPERATING EXPENSES</p>
            {item.operating_expenses?.length > 0
              ? item.operating_expenses?.map((i, key) => {
                  return (
                    <ul
                      key={key}
                      className="grid grid-cols-2 indent-3 gap-2 pb-2"
                    >
                      <li>{i?.name}</li>
                      <li className="text-black dark:text-light text-right">
                        {isLoading || isFetching ? (
                          <TableLoading count={1} cols={1} />
                        ) : (
                          <AmountWithPesoSign
                            classN="size-3"
                            amount={i?.amount}
                          />
                        )}
                      </li>
                    </ul>
                  );
                })
              : ""}
            <ul className="grid grid-cols-2 indent-3 gap-2 border-b pb-2">
              <li>Supplies</li>
              <li className="text-black dark:text-light text-right">
                {isLoading || isFetching ? (
                  <TableLoading count={1} cols={1} />
                ) : (
                  <AmountWithPesoSign
                    classN="size-3"
                    amount={item?.supplier_amount}
                  />
                )}
              </li>
            </ul>
            <ul className="grid grid-cols-2 mt-3 text-black dark:text-white font-semibold">
              <li>Total Operating Expenses</li>
              <li>
                {isLoading || isFetching ? (
                  <TableLoading count={1} cols={1} />
                ) : (
                  <AmountWithPesoSign
                    classN="size-3"
                    amount={item?.total_oe_amount}
                  />
                )}
              </li>
            </ul>
          </div>

          {/* Net Income */}
          <ul
            className={`bg-red-500 dark:bg-red-500/30 rounded-xl p-5 shadow-xs w-full grid grid-cols-2 `}
          >
            <li className="text-light font-semibold md:text-lg text-base">
              Net Income
            </li>
            <li className="text-light font-semibold md:text-xl text-lg">
              {isLoading || isFetching ? (
                <TableLoading count={1} cols={1} />
              ) : (
                <AmountWithPesoSign
                  classAmnt="text-white!"
                  amount={item?.net_income}
                />
              )}
            </li>
          </ul>
        </div>
      </div>
    </HeaderNav>
  );
};

export default ProfitAddLoss;
