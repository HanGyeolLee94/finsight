// TitleContainer.tsx
import React from "react";
import { Box } from "@mui/material";

interface TitleContainerProps {
  children?: React.ReactNode;
  rightContent?: React.ReactNode; // Optional elements to the right of the title
}

const TitleContainer: React.FC<TitleContainerProps> = ({
  children,
  rightContent,
}) => {
  return (
    <Box
      my={2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: { xs: "center", md: "left" },
      }}
    >
      {/* Title or left-side content */}
      <Box>{children}</Box>

      {/* Right-side content */}
      {rightContent && (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {rightContent}
        </Box>
      )}
    </Box>
  );
};

export default TitleContainer;
