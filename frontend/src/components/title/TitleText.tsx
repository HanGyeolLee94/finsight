// TitleText.tsx
import React from "react";
import { Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TitleTextProps {
  translationKey?: string;
  title?: string;
  children?: React.ReactNode; // Allows additional content to be passed in (e.g., price or change values)
}

const TitleText: React.FC<TitleTextProps> = ({
  translationKey,
  title,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="h5" component="h1">
        {title || (translationKey ? t(translationKey) : "")}
      </Typography>
      {children && <Box ml={2}>{children}</Box>}{" "}
      {/* Display children with some spacing on the left */}
    </Box>
  );
};

export default TitleText;
