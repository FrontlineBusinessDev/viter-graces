import NoData from "@/components/NoData";
import { AmountWithPesoSign } from "@/components/PesoSign";
import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion, devNavUrl } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { TrendingDown } from "lucide-react";
import React, { useMemo } from "react";
const DashboardOverduePayments = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;
  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/report-sales-order/read-overdue-payment`, // endpoint
    "post", // method
    `report-sales-order/read-overdue-payment`, // key
    { limit: 6 },
  );

  const valData = useMemo(() => {
    return result?.data;
  }, [result]);

  return (
    <>
      {/* Overdue Payments */}
      <div
        className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow relative"
        data-testid="overdue-payments"
      >
        <h2 className="flex gap-2 items-center font-semibold text-sm text-red-600 mb-4">
          <TrendingDown size={16} /> Overdue Payments
        </h2>
        <ul className="space-y-3 min-h-[300px]">
          {isLoading ? (
            <li>
              <TableLoading count={15} cols={1} />
            </li>
          ) : error ? (
            <li>
              <ServerError />
            </li>
          ) : valData?.length > 0 ? (
            valData?.map((item, key) => {
              return (
                <li key={key} className="flex justify-between">
                  <div>
                    <span className="font-medium text-xs text-black dark:text-light">
                      {item.installment_payment_customer_name} -{" "}
                      <span className="text-gray-500">
                        {item.installment_payment_code_number}
                      </span>
                    </span>
                    <p className="text-gray-500 text-sm mb-1!">
                      {item.installment_payment_due_date}
                    </p>
                  </div>
                  <div>
                    <span className="text-red-600 font-semibold">
                      <AmountWithPesoSign
                        classN={"size-3"}
                        amount={item.installment_payment_amount}
                      />
                    </span>
                    <p className="text-red-600 font-semibold mb-1!">
                      {Number(item.days_ago) === 0
                        ? "Due today"
                        : `${item.days_ago} day(s) ago`}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <li>
              <NoData />
            </li>
          )}
        </ul>
        {valData?.length > 0 ? (
          <a
            data-testid="overdue-payment-btn-to-view"
            href={`${devNavUrl}/${userRole}/overdue-payments`}
            className="absolute bottom-3 text-orange-500 pt-3 inline-block"
          >
            Click to view →
          </a>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default DashboardOverduePayments;
