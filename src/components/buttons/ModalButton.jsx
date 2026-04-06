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
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const handleClose = () => {
    dispatch(setIsAdd(false));
  };

  handleEscape(() => handleClose());

  return (
    <>
      <button
        type={type}
        disabled={disabled}
        className={`${type === "submit" ? "btn-modal-submit" : "btn-modal-cancel"}`}
        onClick={(e) => {
          `${type === "submit" ? e : handleClose}`;
        }}
      >
        {loading ? <ButtonSpinner /> : " "}
        <span className="ml-2">
          {type === "submit" ? <>{itemEdit ? "Save" : "Add"}</> : "Cancel"}
        </span>
      </button>
    </>
  );
};

export default ModalButton;
