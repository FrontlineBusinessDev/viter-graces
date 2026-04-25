import CloseButton from "@/components/buttons/CloseButton";
import ModalButton from "@/components/buttons/ModalButton";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import React from "react";

const ModalWrapper = ({
  val = "",
  itemEdit = null,
  mutation,
  children,
  width = "min-w-[350px]",
  handleClose,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      <div
        className="bg-dark/50 dark:bg-dark-mode/90 fixed inset-0 z-999 flex justify-center items-center overflow-y-auto animate-fadeIn"
        onClick={handleClose}
      >
        <div
          className={`p-1 ${width} animate-slideUp w-full max-w-lg my-10`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="modal-header relative p-4">
              <CloseButton
                handleClose={handleClose}
                disabled={mutation.isPending}
              />
              <h3 className="text-dark dark:text-light text-sm">
                {itemEdit ? "Update" : "Add New"} {val}
              </h3>
            </div>

            <div className="p-4 overflow-y-auto flex-1">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalWrapper;
