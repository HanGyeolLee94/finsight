import TabContext from "@mui/lab/TabContext";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TabContainerProps {
  children: ReactNode;
  value: string;
}

const TabContainer: React.FC<TabContainerProps> = ({ children, value }) => (
  <Box sx={{ width: "100%", typography: "body1" }}>
    <TabContext value={value}>{children}</TabContext>
  </Box>
);

export default TabContainer;
