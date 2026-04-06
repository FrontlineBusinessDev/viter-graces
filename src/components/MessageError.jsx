import { setError, setMessage } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { X } from "lucide-react";
import React from "react";

const MessageError = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const ref = React.useRef(null);

  const handleClose = () => {
    dispatch(setError(false));
  };

  React.useEffect(() => {
    if (ref) {
      ref.current.scrollIntoView();
    }
  }, [ref]);

  return (
    <>
      <div
        className="bg-red-200 px-4 py-3 mt-4 rounded-sm flex items-center justify-between gap-1"
        ref={ref}
      >
        <span className="text-red-500 max-w-full overflow-hidden text-ellipsis">
          {store.message}
        </span>
        <div>
          <button
            type="button"
            className="rounded-sm p-2 hover:bg-gray-100/20"
            onClick={handleClose}
          >
            <X />
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageError;
