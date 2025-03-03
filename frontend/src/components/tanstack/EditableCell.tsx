import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

interface EditableCellProps {
  value: string; // 부모에서 전달받은 값
  onBlur: (newValue: string) => void; // 포커스 해제 시 호출할 함수
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onBlur }) => {
  const [localValue, setLocalValue] = useState(value); // 로컬 상태로 초기화

  const handleBlur = () => {
    if (localValue !== value) {
      onBlur(localValue); // 로컬 값이 변경된 경우에만 부모 함수 호출
    }
  };

  return (
    <TextField
      value={localValue} // 로컬 상태 사용
      onChange={(e) => setLocalValue(e.target.value)} // 로컬 상태 업데이트
      onBlur={handleBlur} // 포커스 해제 시 부모로 값 전달
      variant="outlined"
      size="small"
      fullWidth
    />
  );
};

export default EditableCell;
