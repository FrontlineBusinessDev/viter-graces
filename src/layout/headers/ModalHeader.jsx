import CloseButton from "@/components/buttons/CloseButton";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import React from "react";

const ModalHeader = ({ val = "", itemEdit = null, mutation }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  return (
    <>
      <div className="modal-header relative mb-4">
        <CloseButton handleClose={handleClose} disabled={mutation.isPending} />
        <h3 className="text-dark text-sm">
          {itemEdit ? "Update" : "Add new"} {val}
        </h3>
      </div>
    </>
  );
};

export default ModalHeader;
