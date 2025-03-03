// TabTitle.tsx
import React from "react";
import { Typography, Box } from "@mui/material";

interface TabTitleProps {
  title: string;
  subtitle?: string;
}

const TabTitle: React.FC<TabTitleProps> = ({ title, subtitle }) => (
  <Box mb={2}>
    <Typography variant="h5" component="div">
      {title}
    </Typography>
    {subtitle && (
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default TabTitle;
