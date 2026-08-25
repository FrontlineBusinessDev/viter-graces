import NoData from "@/components/NoData";
import { AmountWithPesoSign } from "@/components/PesoSign";
import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion, devNavUrl } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { numberWithCommasToFixed } from "@/utilities/numberWithCommas";
import {
  Eye,
  EyeOff,
  PhilippinePeso,
  TrendingDown,
  Trophy,
} from "lucide-react";
import React, { useMemo } from "react";
const DashboardTopSellingProductList = ({ path = "", id = 0 }) => {
  const [visibleAmounts, setVisibleAmounts] = React.useState({});

  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    path !== "" ? `${apiVersion}/${path}` : null, // endpoint
    "post", // method
    `${path}`, // key
    { id: id },
  );

  const valData = useMemo(() => {
    if (!result?.count) return [];

    return result.data;
  }, [result]);

  const toggleAmount = (id) => {
    setVisibleAmounts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {/* Top Selling Product List */}
      <div
        className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow relative"
        data-testid="top-selling-products"
      >
        <h2 className="flex gap-2 items-center font-semibold text-sm text-yellow-600 mb-4">
          <Trophy size={16} /> Top Selling Products
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
                    <span className="font-medium text-sm text-black dark:text-light">
                      {item.product_name}
                    </span>
                    <p className="text-gray-500 text-xs mb-1!">
                      {isEmptyItem(item.qty, 0)} units sold
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">
                      <span className="flex items-center gap-2 justify-end text-sm">
                        {visibleAmounts[item.sales_order_product_id] ? (
                          <>
                            <PhilippinePeso className="mr-1" size={14} />
                            {numberWithCommasToFixed(
                              isEmptyItem(item.total_amount, 0),
                              Number(2),
                            )}
                          </>
                        ) : (
                          <span className="mr-2">••••••</span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            toggleAmount(item.sales_order_product_id)
                          }
                          className="text-gray-500 hover:text-primary"
                        >
                          {visibleAmounts[item.sales_order_product_id] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </span>
                    </span>
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
      </div>
    </>
  );
};

export default DashboardTopSellingProductList;
