import { Box } from "@mui/material";
import React from "react";

const DataTableFlexGrowBox: React.FC = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#303030" : "#f0f0f0",
      }}
    />
  );
};

export default DataTableFlexGrowBox;
