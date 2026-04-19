import { setIsAdd } from "@/store/StoreAction";
import ButtonSpinner from "../spinners/ButtonSpinner";
import { handleEscape } from "@/utilities/handleEscape";
import { StoreContext } from "@/store/StoreContext";
import React from "react";

const ModalButton = ({
  disabled = false,
  loading = false,
  itemEdit,
  type = "submit",
  handleClose,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className={`${type === "submit" ? "btn-modal-submit" : "btn-modal-cancel"}`}
        onClick={type !== "submit" ? handleClose : undefined}
      >
        {loading ? <ButtonSpinner /> : " "}
        <span className="">
          {type === "submit" ? <>{itemEdit ? "Save" : "Add"}</> : "Cancel"}
        </span>
      </button>
    </>
  );
};

export default ModalButton;
