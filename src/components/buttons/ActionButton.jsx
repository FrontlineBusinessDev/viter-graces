import { useRef, useState } from "react";
import { createPortal } from "react-dom";

const ActionButton = ({
  item,
  onClick = (e) => e,
  disabled = false,
  tooltip,
}) => {
  const buttonRef = useRef(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const tooltipText = tooltip || item.name;

  // Rendered through a portal into <body> instead of the shared
  // .tooltip-action-table CSS pseudo-element - that pseudo-element is
  // positioned relative to the button, so any scrollable/overflow-hidden
  // ancestor (the table's horizontal-scroll wrapper) clips it. A z-index
  // bump can't fix clipping, only stacking order.
  const showTooltip = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ top: rect.top, left: rect.left + rect.width / 2 });
  };

  const hideTooltip = () => setTooltipPos(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="relative p-1 bg-transparent leading-none hover:bg-primary/20 hover:rounded-sm capitalize disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={disabled ? undefined : onClick}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        disabled={disabled}
        data-testid={`action-${item.name}`}
      >
        {item.icon}
      </button>
      {tooltipPos &&
        createPortal(
          <span
            className="fixed -translate-x-2/4 -translate-y-full bg-dark/80 text-white p-1 rounded-sm leading-none whitespace-nowrap text-center text-[10px] pointer-events-none z-9999"
            style={{ top: tooltipPos.top - 6, left: tooltipPos.left }}
          >
            {tooltipText}
          </span>,
          document.body,
        )}
    </>
  );
};

export default ActionButton;
