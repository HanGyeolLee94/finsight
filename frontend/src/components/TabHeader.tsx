import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TabHeaderProps {
  children: ReactNode;
}

const TabHeader: React.FC<TabHeaderProps> = ({ children }) => (
  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>{children}</Box>
);

export default TabHeader;
