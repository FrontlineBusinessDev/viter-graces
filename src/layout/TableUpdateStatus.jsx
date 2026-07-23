import { apiVersion } from "@/config/config";
import { queryData } from "@/services/queryData";
import { setError, setMessage, setSuccess } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ActivityLogDetails } from "./ArrayValue";

const TableUpdateStatus = ({ path, item, dataArray }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(`${apiVersion}/${path}/${dataArray?.id}`, "put", values),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["returns-products"] });

      if (data.success) {
        dispatch(setSuccess(true));
        dispatch(setMessage("Updated successfully"));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const handleYes = async (e) => {
    mutation.mutate({
      ...ActivityLogDetails("returns", "update", store, item),
      ...dataArray,
      return_product_status: e.target.value,
    });
  };

  return (
    <>
      <form className="relative">
        <select
          onChange={(e) => {
            handleYes(e);
          }}
          defaultValue={dataArray?.return_product_status}
          className="border-0 shadow shadow-primary h-8 capitalize"
        >
          <optgroup label={`Select status`}>
            <option value="pending">Pending</option>
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
            <option value="rejected">Rejected</option>
          </optgroup>
        </select>
      </form>
    </>
  );
};

export default TableUpdateStatus;
