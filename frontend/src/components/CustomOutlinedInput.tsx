import React, { useState } from "react";
import {
  OutlinedInput,
  InputAdornment,
  IconButton,
  OutlinedInputProps,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

interface CustomOutlinedInputProps
  extends Omit<OutlinedInputProps, "onChange" | "value"> {
  defaultValue?: string;
  onSearchClick?: () => void;
  showSearchIcon?: boolean;
  showDeleteIcon?: boolean;
  autoComplete?: string; // Add autocomplete prop
}

const CustomOutlinedInput: React.FC<CustomOutlinedInputProps> = ({
  defaultValue = "",
  onSearchClick,
  showSearchIcon = false,
  showDeleteIcon = false,
  autoComplete = "off", // Default value for autocomplete
  ...rest
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue);

  return (
    <OutlinedInput
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      autoComplete={autoComplete} // Pass autocomplete attribute
      endAdornment={
        <InputAdornment position="end">
          {showSearchIcon && (
            <IconButton onClick={onSearchClick} edge="end">
              <SearchIcon />
            </IconButton>
          )}
          {showDeleteIcon && (
            <IconButton onClick={() => setInputValue("")} edge="end">
              <DeleteIcon />
            </IconButton>
          )}
        </InputAdornment>
      }
      {...rest}
    />
  );
};

export default CustomOutlinedInput;
