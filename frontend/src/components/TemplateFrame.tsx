import getDashboardTheme from "@/theme/getDashboardTheme";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import * as React from "react";
import CustomAppBar from "./CustomAppBar"; // 새로 만든 CustomAppBar 컴포넌트 불러오기

interface TemplateFrameProps {
  showCustomTheme: boolean;
  toggleCustomTheme: (theme: boolean) => void;
  mode: "light" | "dark";
  toggleColorMode: () => void;
  children: React.ReactNode;
}

export default function TemplateFrame({
  showCustomTheme,
  toggleCustomTheme,
  mode,
  toggleColorMode,
  children,
}: TemplateFrameProps) {
  const dashboardTheme = createTheme(getDashboardTheme(mode));
  return (
    <ThemeProvider theme={dashboardTheme}>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* CustomAppBar 사용 */}
        <CustomAppBar
          showCustomTheme={showCustomTheme}
          toggleCustomTheme={toggleCustomTheme}
          mode={mode}
          toggleColorMode={toggleColorMode}
        />
        <Box sx={{ flex: "1 1", overflow: "hidden" }}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
}
