import { Box } from "@mui/material";
import React from "react";

interface DataTableBoxProps {
  children: React.ReactNode;
}

const DataTableBox: React.FC<DataTableBoxProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#303030" : "#f0f0f0",
      }}
    >
      {children}
    </Box>
  );
};

export default DataTableBox;
