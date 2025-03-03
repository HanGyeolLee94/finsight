import { Paper } from "@mui/material";
import React from "react";

interface SearchBoxProps {
  children: React.ReactNode;
}

const SearchBox: React.FC<SearchBoxProps> = ({ children }) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
      {children}
    </Paper>
  );
};

export default SearchBox;
