import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface ExpandableCellProps {
  row: any; // Replace 'any' with your specific row type
  getValue: () => any; // Define the type based on the value's return type
}

const ExpandableCell: React.FC<ExpandableCellProps> = ({ row, getValue }) => {
  return (
    <div
      style={{
        paddingLeft: `${row.depth * 2}rem`, // Apply indentation based on row depth
        display: "flex", // Use flexbox to align items
        alignItems: "center", // Align button and value vertically in the center
      }}
    >
      {/* Check if the row can be expanded */}
      {row.getCanExpand() ? (
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            display: "flex", // Ensure the button behaves like a flex item
            alignItems: "center", // Center the icon vertically
          }}
        >
          {/* Use Material UI icons for expand/collapse */}
          {row.getIsExpanded() ? (
            <KeyboardArrowDownIcon /> // Collapse (down arrow)
          ) : (
            <KeyboardArrowRightIcon /> // Expand (right arrow)
          )}
        </button>
      ) : (
        <div style={{ width: "24px" }} /> // Placeholder to keep alignment
      )}
      {/* Render the cell value */}
      <span style={{ marginLeft: "8px" }}>{getValue()}</span>
    </div>
  );
};

export default ExpandableCell;
