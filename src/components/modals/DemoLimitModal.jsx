import CloseButton from "@/components/buttons/CloseButton";

const DemoLimitModal = ({ onClose = () => {} }) => {
  return (
    <div
      className="bg-dark/50 dark:bg-dark-mode/90 fixed inset-0 z-999 flex justify-center items-center overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="p-1 min-w-[350px] animate-slideUp w-full max-w-md my-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col">
          <div className="modal-header relative p-4">
            <CloseButton handleClose={onClose} disabled={false} />
            <h3 className="text-dark dark:text-light text-sm">
              Demo limit reached
            </h3>
          </div>

          <div className="p-4 text-sm" data-testid="demo-limit-message">
            <p>
              You’ve reached the product limit for testing. The next step is
              deployment, where you can encode your complete product list and
              proceed with UAT. This will also help avoid unexpected issues when
              migrating data from the demo to the live system.
            </p>
          </div>

          <div className="p-4 flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="btn--outline--gray"
              data-testid="demo-limit-close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLimitModal;
