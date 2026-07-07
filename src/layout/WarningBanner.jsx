import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { TriangleAlert } from "lucide-react";
import React, { useMemo } from "react";

const WarningBanner = ({
  path = "",
  text = "",
  id = 0,
  description = "",
  isLowStock = false,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    path !== "" ? `${apiVersion}/${path}` : null, // endpoint
    "post", // method
    `${path}`, // key
    { id: id, userId: ProductOwnerId(store) },
  );

  const valData = useMemo(() => {
    if (!result?.count) return [];

    return result?.data;
  }, [result]);

  return (
    <>
      {path === "" && description !== "" ? (
        // <div className="bg-orange-100 text-orange-600 dark:bg-orange-200 dark:text-orange-300 border border-orange-300 rounded-xl px-3 py-2 my-2  ">
        //   <div className="flex items-center gap-2">
        //     <TriangleAlert size={14} className="place-self-start mt-0.5" />
        //     <p className="dark:text-orange-600 mb-0 ">{description}</p>
        //   </div>
        // </div>
        ""
      ) : error ? (
        <ServerError />
      ) : valData?.length > 0 ? (
        <div className="bg-orange-100 text-orange-600 dark:bg-orange-200 dark:text-orange-300 border border-orange-300 rounded-xl px-3 py-2 my-2  ">
          <div className="flex items-center gap-2">
            <TriangleAlert size={14} className="place-self-start mt-0.5" />
            <div className="dark:text-orange-600! mb-0 font-bold sm:truncate ">
              {isLoading ? (
                <TableLoading count={1} cols={1} />
              ) : (
                <>
                  <span className="mr-1 dark:text-orange-600">
                    {isEmptyItem(valData?.length, "")}
                  </span>
                  <span className="dark:text-orange-600 mr-1">{text}</span>
                  {description}
                  {/* {isLowStock ? (
                    <>
                      {isLowStock && (
                        <span className="ml-1 dark:text-orange-600">
                          {valData.map((item) => item.name).join(", ")}.
                        </span>
                      )}
                    </>
                  ) : (
                    ""
                  )} */}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default WarningBanner;
