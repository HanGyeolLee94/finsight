import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface TitleComponentProps {
  translationKey?: string;
  title?: string; // Optional title prop to override translationKey
  children?: React.ReactNode; // Allow for optional children (e.g., buttons)
}

const TitleComponent: React.FC<TitleComponentProps> = ({
  translationKey,
  title,
  children,
}) => {
  const { t } = useTranslation();

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
      <Typography variant="h5" component="h1">
        {title || (translationKey ? t(translationKey) : "")}
      </Typography>

      {children && (
        <Stack direction="row" spacing={2}>
          {children}
        </Stack>
      )}
    </Box>
  );
};

export default TitleComponent;
