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
    { id: id, columnFilters: [], searchValue: "" },
    { id: id, columnFilters: [], searchValue: "" },
  );

  const data = useMemo(() => {
    if (!result?.count) return "0.00";

    return result?.data[0];
  }, [result]);

  return (
    <>
      {path === "sales-order" && (
        <ul className="xs:flex flex-wrap gap-2 justify-between md:border-l md:p-2 md:shadow md:border-gray-300 md:bg-gray-50 md:text-right ">
          <li className="border-l border-gray-300 mb-2 w-full p-2 shadow sm:w-40  bg-gray-50 md:border-none md:p-0 md:shadow-none ">
            <span className="font-bold uppercase">Open Balance </span>
            <span>
              <AmountWithPesoSign
                classN={"size-3"}
                amount={data?.open_balance}
              />
            </span>
          </li>
          <li className="border-l border-gray-300 mb-2 w-full p-2 shadow sm:w-40  bg-gray-50 md:border-none md:p-0 md:shadow-none">
            <span className="font-bold uppercase">Overdue Balance</span>
            <span>
              <AmountWithPesoSign
                classN={"size-3"}
                amount={data?.overdue_balance}
              />
            </span>
          </li>
          <li className="border-l border-gray-300 mb-2 w-full p-2 shadow sm:w-40  bg-gray-50 md:border-none md:p-0 md:shadow-none">
            <span className="font-bold uppercase">Number of Orders</span>
            <span className="flex justify-end text-black">
              {data?.number_of_order}
            </span>
          </li>
          <li className="border-l border-gray-300 mb-2 w-full p-2 shadow sm:w-40  bg-gray-50 md:border-none md:p-0 md:shadow-none">
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
