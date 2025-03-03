import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface CodeBlockSectionProps {
  title: string;
  content: string;
}

const CodeBlockSection: React.FC<CodeBlockSectionProps> = ({
  title,
  content,
}) => {
  const theme = useTheme();

  const codeBlockStyle = {
    padding: 2,
    backgroundColor: theme.palette.mode === "dark" ? "#2d2d2d" : "#f4f4f4", // Slightly lighter dark background
    color: theme.palette.mode === "dark" ? "#e0e0e0" : "#000000",
    borderRadius: 4,
    fontSize: "0.9rem",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    border: `1px solid ${
      theme.palette.mode === "dark" ? "#555555" : "#dddddd"
    }`, // Border to enhance separation
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 0 10px rgba(255, 255, 255, 0.1)"
        : "0 0 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for focus
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      {title && (
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
      )}
      <Box component="pre" sx={codeBlockStyle}>
        {content}
      </Box>
    </Box>
  );
};

export default CodeBlockSection;
