import MessageError from "@/components/MessageError";
import ButtonSpinner from "@/components/spinners/ButtonSpinner";
import { queryData } from "@/services/queryData";
import {
  setError,
  setIsAction,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleQuestionMark } from "lucide-react";
import React from "react";

const ModalAction = ({ mysqlApiAction, msg, successMsg, item, queryKey }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        mysqlApiAction,
        isEmptyItem(item?.action, "active") !== "delete" ? "put" : "delete",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (data.success) {
        dispatch(setIsAction(false));
        dispatch(setSuccess(true));
        dispatch(setMessage(successMsg));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });
  const handleYes = async () => {
    // mutate data
    mutation.mutate({
      isActive: Number(isEmptyItem(item?.is_active, 0)) === 1 ? 0 : 1,
      ...item,
    });
  };

  const handleClose = () => {
    dispatch(setIsAction(false));
  };

  handleEscape(() => handleClose());

  React.useEffect(() => {
    dispatch(setError(false));
  }, []);

  return (
    <>
      <div className="bg-dark/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-99 flex justify-center items-center w-full md:inset-0 max-h-full animate-fadeIn">
        <div className="p-1 w-[350px] animate-slideUp">
          <div className="bg-white p-6 pt-10 text-center rounded-lg">
            <CircleQuestionMark className="my-2 mx-auto animate-bounce h-11 w-11 text-red-700" />
            <p className="text-sm">{msg}</p>
            <p className="text-sm font-bold">{isEmptyItem(item?.name, "")}</p>
            {store.error && <MessageError />}
            <div className="flex items-center gap-1 pt-8">
              <button
                type="submit"
                className="btn-modal-submit"
                disabled={mutation.isPending}
                onClick={handleYes}
              >
                {mutation.isPending ? <ButtonSpinner /> : "Confirm"}
              </button>
              <button
                type="reset"
                className="btn-modal-cancel"
                disabled={mutation.isPending}
                onClick={handleClose}
                autoFocus
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalAction;
