import React from "react";
import { Card, CardContent } from "@mui/material";
import { TabPanel } from "@mui/lab";

interface CustomTabPanelCardProps {
  value: string; // Tab value for conditional rendering
  selectedValue: string; // Currently selected tab value
  children?: React.ReactNode; // Flexible content, including title, subtitle, and body
}

const CustomTabPanelCard: React.FC<CustomTabPanelCardProps> = ({
  value,
  selectedValue,
  children,
}) => (
  <TabPanel
    value={value}
    hidden={selectedValue !== value}
    sx={{
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingLeft: "0px",
      paddingRight: "0px",
    }}
  >
    <Card variant="outlined" elevation={3}>
      <CardContent>{children}</CardContent>
    </Card>
  </TabPanel>
);

export default CustomTabPanelCard;
