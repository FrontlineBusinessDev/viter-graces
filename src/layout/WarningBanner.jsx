import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { TriangleAlert } from "lucide-react";

const WarningBanner = ({ path = "", text = "", id = 0, description = "" }) => {
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
  return (
    <>
      {path === "" && description !== "" ? (
        <div className="bg-orange-100 text-orange-600 dark:bg-orange-200 dark:text-orange-300 border border-orange-300 rounded-xl px-3 py-2 my-2  ">
          <div className="flex items-center gap-2">
            <TriangleAlert size={14} className="place-self-start mt-0.5" />
            <p className="dark:text-orange-600 mb-0 ">{description}</p>
          </div>
        </div>
      ) : error ? (
        <ServerError />
      ) : isLoading || isFetching ? (
        <TableLoading count={2} cols={1} />
      ) : result?.count > 0 ? (
        <div className="bg-orange-100 text-orange-600 dark:bg-orange-200 dark:text-orange-300 border border-orange-300 rounded-xl px-3 py-2 my-2  ">
          <div className="flex items-center gap-2">
            <TriangleAlert size={14} className="place-self-start mt-0.5" />
            <p className="dark:text-orange-600 mb-0 ">
              <span className="dark:text-orange-600 font-bold ">
                {isEmptyItem(result?.data[0]?.data_count, "")} {text}{" "}
              </span>
              {description}
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default WarningBanner;
