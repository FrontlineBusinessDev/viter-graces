import CloseButton from "@/components/buttons/CloseButton";
import { setIsAction } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import React from "react";

const ModalHeader = ({ val = "", itemEdit = null, mutation }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const handleClose = () => {
    dispatch(setIsAction(false));
  };

  handleEscape(() => handleClose());

  return (
    <>
      <div className="modal-header relative mb-4">
        <h3 className="text-dark text-sm">
          {itemEdit ? "Update" : "Add"} {val}
        </h3>
        <CloseButton handleClose={handleClose} disabled={mutation.isPending} />
      </div>
    </>
  );
};

export default ModalHeader;
