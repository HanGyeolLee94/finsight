"use client";
import * as React from "react";
import {
  PaletteMode,
  createTheme,
  ThemeProvider,
  alpha,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SideMenu from "@/components/SideMenu";
import CustomAppBar from "@/components/CustomAppBar";
import getOriginalTheme from "@/theme/getOriginalTheme";
import { setCookie, getCookie } from "@/utils/cookies";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [menuOpen, setMenuOpen] = React.useState(false); // 메뉴 열림 상태 추가
  const defaultTheme = createTheme(getOriginalTheme(mode));

  React.useEffect(() => {
    // 쿠키에서 테마 모드 가져오기
    const savedMode = getCookie("themeMode") as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // 시스템 기본 테마 확인
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    setCookie("themeMode", newMode, { expires: 365 }); // 쿠키에 저장 (유효기간: 1년)
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev); // 메뉴 열림 상태 토글

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <CustomAppBar
          mode={mode}
          toggleColorMode={toggleColorMode}
          onMenuToggle={toggleMenu} // AppBar에 메뉴 토글 핸들러 전달
        />

        <Box
          sx={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <SideMenu open={menuOpen} onClose={toggleMenu} />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
