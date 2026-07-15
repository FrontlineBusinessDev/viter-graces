import { AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import React, { useMemo } from "react";

const OverviewSalesCustomer = ({ path = "", id = "", columnFilters = [] }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/customer/read-cutomer-sales-summary`, // endpoint
    "post", // method
    `customer/read-cutomer-sales-summary`, // key
    { id: id, columnFilters: columnFilters, searchValue: "" },
  );

  const data = useMemo(() => {
    if (!result?.count) return "0.00";

    return result?.data[0];
  }, [result]);

  return (
    <>
      {path === "sales-order" && (
        <ul className="flex flex-wrap justify-between bg-gray-50 p-2 shadow border-l ">
          <li>
            <span className="font-bold uppercase">Open Balance </span>
            <span>
              <AmountWithPesoSign
                classN={"size-3"}
                amount={data?.open_balance}
              />
            </span>
          </li>
          <li>
            <span className="font-bold uppercase">Overdue Balance</span>
            <span>
              <AmountWithPesoSign
                classN={"size-3"}
                amount={data?.overdue_balance}
              />
            </span>
          </li>
          <li>
            <span className="font-bold uppercase">Number of Orders</span>
            <span>
              <AmountWithPesoSign
                classN={"size-3"}
                amount={data?.number_of_order}
              />
            </span>
          </li>
          <li>
            <span className="font-bold uppercase">Total Amount Spent</span>
            <span>
              <AmountWithPesoSign
                classN={"size-3"}
                amount={data?.total_amount_spent}
              />
            </span>
          </li>
        </ul>
      )}
    </>
  );
};

export default OverviewSalesCustomer;
