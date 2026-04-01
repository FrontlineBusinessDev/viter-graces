import React from "react";

const GraphTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload || !payload.length) return null;

  const colorMap = {
    green: ["Money In", "Income"],
    red: ["Money Out", "Expenses"],
    blue: ["Balance", "Sales", "Net"],
  };

  const getColor = (name) => {
    if (colorMap.green.includes(name)) return "#22C55E";
    if (colorMap.red.includes(name)) return "#EF4444";
    if (colorMap.blue.includes(name)) return "#2563EB";
    return darkMode ? "#F9FAFB" : "#111827";
  };

  return (
    <div
      className={`p-2 rounded shadow-md ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <p
        className={`text-xs mb-1 ${darkMode ? "text-gray-100" : "text-gray-900"}`}
      >
        {label}
      </p>

      {payload.map((entry, index) => (
        <p
          key={index}
          className={`text-xs font-semibold`}
          style={{ color: getColor(entry.name) }}
        >
          <span
            className={`font-normal`}
            style={{ color: getColor(entry.name) }}
          >
            {entry.name}:
          </span>{" "}
          ₱{entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default GraphTooltip;
