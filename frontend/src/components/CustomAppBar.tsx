import { FinSightLogo } from "@/components/icons/CustomIcons";
import LanguageChanger from "@/components/LanguageChanger";
import { IconButton, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import ToggleColorMode from "./ToggleColorMode";
import MenuIcon from "@mui/icons-material/Menu";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "sticky", // 고정 위치를 상단으로 설정
  top: 0, // 페이지 스크롤 시 항상 상단에 위치
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary, // 텍스트 색상을 명시적으로 설정
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1, // zIndex 설정
  flex: "0 0 auto",
}));

interface CustomAppBarProps {
  mode: "light" | "dark";
  toggleColorMode: () => void;
  onMenuToggle: () => void; // 메뉴 토글 핸들러
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({
  mode,
  toggleColorMode,
  onMenuToggle,
}) => {
  return (
    <StyledAppBar>
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          p: "8px 12px",
        }}
      >
        {/* 왼쪽: 메뉴 버튼 및 로고 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* 메뉴 버튼 (모바일 전용) */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuToggle}
            sx={{ display: { xs: "block", md: "none" } }} // 모바일에서만 표시
          >
            <MenuIcon />
          </IconButton>

          {/* 로고 및 이름 */}
          <FinSightLogo size="small" />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          {/* 언어 변경 및 테마 토글 */}
          <LanguageChanger />
          <ToggleColorMode
            data-screenshot="toggle-mode"
            mode={mode}
            toggleColorMode={toggleColorMode}
          />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default CustomAppBar;
