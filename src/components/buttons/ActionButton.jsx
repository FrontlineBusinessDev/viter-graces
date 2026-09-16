const ActionButton = ({ item, onClick = (e) => e, disabled = false, tooltip }) => {
  return (
    <>
      <button
        type="button"
        className="tooltip-action-table capitalize disabled:opacity-40 disabled:cursor-not-allowed"
        data-tooltip={tooltip || item.name}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        data-testid={`action-${item.name}`}
      >
        {item.icon}
      </button>
    </>
  );
};

export default ActionButton;
