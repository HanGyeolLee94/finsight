import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface CustomAutoCompleteComboProps {
  options: { TEXT: string; ID: string }[]; // Option list passed from the parent
  defaultValue?: string | null; // Default value as an ID passed from the parent
  name: string; // Name attribute for FormData
  id: string; // ID attribute to link with FormLabel
  onChange?: (newValue: { TEXT: string; ID: string } | null) => void; // onChange handler, allows null
  disableClearable?: boolean; // New prop to control clearing option (default is false)
  [key: string]: any; // Additional props
}

const CustomAutoCompleteCombo = ({
  options,
  defaultValue = null, // Ensure it's null or a valid ID
  name,
  id, // id prop passed from the parent component
  onChange,
  disableClearable = false, // 기본으로 "X" 버튼을 허용
  ...rest // 모든 추가 속성 처리
}: CustomAutoCompleteComboProps) => {
  const [selectedOption, setSelectedOption] = useState<{
    TEXT: string;
    ID: string;
  } | null>(options.find((option) => option.ID === defaultValue) || null);

  // defaultValue가 설정된 후에는 다시 변경되지 않도록 초기화만 수행
  useEffect(() => {
    if (defaultValue) {
      const newSelectedOption =
        options.find((option) => option.ID === defaultValue) || null;
      setSelectedOption(newSelectedOption);
    }
  }, [defaultValue]);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: { TEXT: string; ID: string } | null // newValue can be null
  ) => {
    setSelectedOption(newValue); // 상태 업데이트
    setTimeout(() => {
      if (onChange) {
        onChange(newValue); // 상태 업데이트 후 부모 컴포넌트로 알림
      }
    }, 0); // 0 밀리초의 딜레이를 주어 상태가 먼저 업데이트되도록 함
  };

  return (
    <>
      <Autocomplete
        id={id} // Add the id prop here
        disablePortal
        options={options}
        getOptionLabel={(option) => option.TEXT || ""}
        value={selectedOption} // 선택된 옵션을 상태로 반영
        onChange={handleChange} // 값이 변경되면 상태 업데이트 및 부모에게 알림
        disableClearable={disableClearable} // "X" 버튼 비활성화 설정
        sx={{
          width: "100%",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            {...rest} // 추가 속성 전달
          />
        )}
      />
      {/* FormData로 전송할 숨겨진 필드 */}
      <input
        type="hidden"
        name={name}
        value={selectedOption ? selectedOption.ID : ""}
        {...rest} // 추가 속성 전달
      />
    </>
  );
};

export default CustomAutoCompleteCombo;
