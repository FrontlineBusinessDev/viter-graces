import * as Icons from "lucide-react";

const ActionButton = ({ item, onClick = (e) => e }) => {
  return (
    <>
      <button
        type="button"
        className="tooltip-action-table capitalize "
        data-tooltip={item.name}
        onClick={onClick}
        data-testid={`action-${item.name}`}
      >
        {item.icon}
      </button>
    </>
  );
};

export default ActionButton;
