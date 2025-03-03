import { TableContainer, Paper } from "@mui/material";
import React from "react";

interface DataTableContainerProps {
  children: React.ReactNode;
  height: string | number;
}

const DataTableContainer: React.FC<DataTableContainerProps> = ({
  children,
  height,
}) => {
  return (
    <TableContainer
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        height: height,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "#303030" // 다크 모드용 배경색
            : "#f0f0f0", // 라이트 모드용 배경색
      }}
    >
      {children}
    </TableContainer>
  );
};

export default DataTableContainer;
