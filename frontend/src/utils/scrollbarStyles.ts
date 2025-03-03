// src/utils/scrollbarStyles.ts

export const scrollableStyles = {
  mt: 2, // Add margin-top
  pr: 1, // Add padding-right
  overflowY: "auto", // Enable vertical scrolling
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#cccccc",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#aaaaaa",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
};
