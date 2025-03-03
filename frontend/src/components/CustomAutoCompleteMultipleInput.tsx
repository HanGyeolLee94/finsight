import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Checkbox } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useTranslation } from "react-i18next";

interface CustomAutoCompleteMultipleInputProps {
  options: { TEXT: string; ID: string }[]; // Option list passed from the parent
  defaultValue?: string[]; // Default value as an array
  name: string; // Name attribute for FormData
  id: string; // ID attribute to link with FormLabel
  onChange?: (newValues: string[] | null) => void; // onChange handler, supports null
  useOptionId?: boolean; // Whether to set ID or TEXT as the value
}

const CustomAutoCompleteMultipleInput = ({
  options,
  defaultValue = [],
  name,
  id,
  onChange,
  useOptionId = false,
}: CustomAutoCompleteMultipleInputProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]); // Initialize with an empty array
  const { t } = useTranslation();

  useEffect(() => {
    // Map defaultValue (IDs) to TEXT values
    const initialValues = (defaultValue || [])
      .map((id) => {
        const matchingOption = options.find((option) => option.ID === id);
        return matchingOption ? matchingOption.TEXT : null;
      })
      .filter(Boolean) as string[];

    // Only update state if initialValues has changed
    if (JSON.stringify(initialValues) !== JSON.stringify(selectedValues)) {
      setSelectedValues(initialValues);
    }
  }, [JSON.stringify(defaultValue), JSON.stringify(options)]);

  const handleInputChange = (
    event: React.SyntheticEvent,
    newValues: string[] | null
  ) => {
    if (!newValues) {
      setSelectedValues([]);
      if (onChange) {
        onChange([]); // Pass an empty array of IDs
      }
      return;
    }

    const mappedIDs = newValues.map((value) => {
      const matchingOption = options.find((option) => option.TEXT === value);
      return matchingOption ? matchingOption.ID : value;
    });

    setSelectedValues(newValues); // Update TEXT values in state

    if (onChange) {
      onChange(mappedIDs); // Pass IDs to the parent
    }
  };

  // Combine selected IDs into a JSON string for the hidden input
  const inputValue = JSON.stringify(
    selectedValues.map((value) => {
      const matchingOption = options.find((option) => option.TEXT === value);
      return matchingOption ? matchingOption.ID : "";
    })
  );

  return (
    <>
      <Autocomplete
        id={id}
        multiple
        options={options.map((option) => option.TEXT)} // Display TEXT values in dropdown
        value={selectedValues} // Bind selected values to the component
        onChange={handleInputChange}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => {
          const { key, ...otherProps } = props; // Extract and set `key` explicitly
          return (
            <li key={key} {...otherProps}>
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                checked={selected}
                style={{ marginRight: 8 }}
              />
              {option}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={t("ibryeoghayeogyeongsaeg")} />
        )}
        sx={{ width: "100%" }}
      />
      {/* Single hidden input for selected IDs */}
      <input type="hidden" name={name} value={inputValue} />
    </>
  );
};

export default CustomAutoCompleteMultipleInput;
