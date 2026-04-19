import { X } from "lucide-react";

const CloseButton = ({ handleClose = (e) => e, disabled = false }) => {
  return (
    <>
      <button
        type="button"
        className="absolute top-3 right-2 cursor-pointer hover:bg-primary/20 hover:rounded-sm"
        onClick={handleClose}
        disabled={disabled}
      >
        <X className="text-primary text-lg" />
      </button>
    </>
  );
};

export default CloseButton;
