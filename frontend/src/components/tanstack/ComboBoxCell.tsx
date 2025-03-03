import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface ComboBoxCellProps {
  value: string | null; // Current value (option's ID)
  options: { TEXT: string; ID: string }[]; // Options list
  onChange?: (newValue: { TEXT: string; ID: string } | null) => void; // Change handler (optional)
  disabled?: boolean; // Disable the ComboBox (optional)
  disableClearable?: boolean; // Disable the clear (X) icon
}

const ComboBoxCell: React.FC<ComboBoxCellProps> = ({
  value,
  options,
  onChange,
  disabled = true,
  disableClearable = false, // Default to allow clearing
}) => {
  const [selectedOption, setSelectedOption] = useState<{
    TEXT: string;
    ID: string;
  } | null>(null); // Manage the selected option as state

  useEffect(() => {
    // Find the matching option for the provided value
    const matchingOption =
      options.find((option) => option.ID === value) || null;
    setSelectedOption(matchingOption);
  }, [value, options]);

  const handleOptionChange = (
    event: any,
    newValue: { TEXT: string; ID: string } | null
  ) => {
    setSelectedOption(newValue); // Update the state
    if (onChange) {
      onChange(newValue); // Call the external onChange handler
    }
  };

  return (
    <Autocomplete
      options={options} // Use the provided options list
      getOptionLabel={(option) => option.TEXT} // Use TEXT for labels
      value={selectedOption} // Match the option by ID
      onChange={handleOptionChange} // Handle value change
      renderInput={(params) => <TextField {...params} disabled={disabled} />} // Disable the TextField when necessary
      disabled={disabled} // Disable the Autocomplete component
      disableClearable={disableClearable} // Disable the clear (X) icon
      fullWidth
    />
  );
};

export default ComboBoxCell;
