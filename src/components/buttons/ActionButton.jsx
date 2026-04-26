import * as Icons from "lucide-react";

const ActionButton = ({ item, onClick = (e) => e }) => {
  return (
    <>
      <button
        type="button"
        className="tooltip-action-table capitalize z-0!"
        data-tooltip={item.name}
        onClick={onClick}
      >
        {item.icon}
      </button>
    </>
  );
};

export default ActionButton;
