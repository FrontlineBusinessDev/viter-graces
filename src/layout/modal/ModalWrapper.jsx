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
        className="bg-dark/50 dark:bg-dark-mode/90 overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-999 flex justify-center items-center w-full md:inset-0 max-h-full animate-fadeIn"
        onClick={handleClose}
      >
        <div
          className={`p-1 ${width} animate-slideUp`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-light dark:bg-gray-900 p-3 pt-5 rounded-lg dark:border dark:border-gray-800">
            <div className="modal-header relative mb-4">
              <CloseButton
                handleClose={handleClose}
                disabled={mutation.isPending}
              />
              <h3 className="text-dark dark:text-light text-sm">
                {itemEdit ? "Update" : "Add New"} {val}
              </h3>
            </div>
            <div className="p-3 overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalWrapper;
