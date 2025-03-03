import { Checkbox } from "@mui/material";
import { useState, useEffect } from "react";

interface CheckboxCellProps {
  id: string; // Unique identifier for the checkbox
  name: string; // Name attribute for the checkbox
  value: string | null; // 'Y', 'N', 'DY', 'DN', or null
  onChange: (newValue: string) => void; // Callback for value changes
  disabled?: boolean; // Optional: Disable the checkbox (default: true)
}

const CheckboxCell = ({
  id,
  name,
  value,
  onChange,
  disabled = true, // Default value for the disabled prop
}: CheckboxCellProps) => {
  const [checked, setChecked] = useState(value === "Y" || value === "DY"); // Initialize state

  const handleChange = () => {
    if (value === "DY" || value === "DN") return; // Prevent changes when 'DY' or 'DN'
    const newValue = checked ? "N" : "Y"; // Toggle between 'Y' and 'N'
    setChecked(!checked); // Update local state
    onChange(newValue); // Inform the parent about the change
  };

  return (
    <Checkbox
      id={id} // Use the id prop
      name={name} // Use the name prop
      checked={checked}
      onChange={handleChange} // Handle state internally and inform the parent
      disabled={disabled || value === "DY" || value === "DN"} // Disable when 'DY' or 'DN'
      sx={{ padding: 0 }} // Remove padding for cleaner UI
    />
  );
};

export default CheckboxCell;
