import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface CustomAutocompleteInputProps {
  options: { TEXT: string; ID: string }[]; // Option list passed from the parent
  defaultID?: string; // Default ID as string since it's freeSolo
  name: string; // Name attribute for FormData
  id: string; // ID attribute to link with FormLabel
  onChange?: (newValue: string) => void; // onChange handler
  disableClearable?: boolean; // Option to control clearing
  useOptionId?: boolean; // New prop to determine whether to set ID or TEXT as the value
  placeholder?: string;
}

const CustomAutoCompleteInput = ({
  options,
  defaultID = "", // Initialize with an empty string for freeSolo
  name,
  id, // id prop passed from the parent component
  onChange,
  disableClearable = false, // 기본으로 "X" 버튼을 허용
  useOptionId = false, // Default to using TEXT for input, but allow ID via prop
  placeholder = "",
}: CustomAutocompleteInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");

  // Handle defaultValue updates (if defaultValue changes dynamically)
  useEffect(() => {
    if (defaultID) {
      const matchingOption = options.find((option) => option.ID === defaultID);
      if (matchingOption) {
        setInputValue(
          useOptionId
            ? matchingOption.ID
            : `[${matchingOption.ID}] ${matchingOption.TEXT}`
        );
      }
      setSelectedId(matchingOption ? matchingOption.ID : "");
    }
  }, [defaultID, options]);

  const handleInputChange = (
    event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    const extractedId = newInputValue.match(/\[(.*?)\]/)?.[1];
    const matchingOption = options.find(
      (option) =>
        option.TEXT === newInputValue ||
        (extractedId && option.ID === extractedId)
    );

    // Decide whether to use the ID or TEXT based on `useOptionId` prop
    const newValue =
      matchingOption && useOptionId
        ? matchingOption.ID // Use ID if `useOptionId` is true
        : newInputValue; // Otherwise use the typed value or TEXT

    // Update the state with the calculated new value
    setInputValue(newValue);
    setSelectedId(matchingOption ? matchingOption.ID : "");

    // Notify parent with the new value (ID or TEXT)
    if (onChange) {
      onChange(matchingOption ? matchingOption.ID : "");
    }
  };

  return (
    <>
      <Autocomplete
        id={id}
        freeSolo
        disableClearable={disableClearable} // "X" 버튼 비활성화 설정 가능
        options={options.map((option) => `[${option.ID}] ${option.TEXT}`)} // Show [ID] TEXT format
        inputValue={inputValue} // Bind the input field to state
        onInputChange={handleInputChange} // Update the state when input changes
        sx={{
          width: "100%",
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} />
        )}
      />
      {/* FormData로 전송할 숨겨진 필드 */}
      <input type="hidden" name={name} value={selectedId} />
    </>
  );
};

export default CustomAutoCompleteInput;
