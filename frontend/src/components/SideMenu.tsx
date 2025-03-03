"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: theme.palette.background.paper,
  },
}));

interface SideMenuProps {
  open: boolean;
  onClose: () => void; // 닫기 핸들러
}

export default function SideMenu({ open, onClose }: SideMenuProps) {
  const [username, setUsername] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // 모바일 감지

  React.useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    setUsername(storedUsername);
    setEmail(storedEmail);
  }, []);

  return (
    <Drawer
      variant={isSmallScreen ? "temporary" : "permanent"} // 모바일에서는 temporary
      open={isSmallScreen ? open : true} // 모바일일 때 open 상태로 제어
      onClose={onClose} // 모바일일 때 닫기 동작
    >
      <Box
        sx={(theme) => ({
          ...theme.mixins.toolbar,
        })}
      />
      <MenuContent />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* <Avatar
          sizes="small"
          alt={username || ""}
          src=""
          sx={{ width: 36, height: 36 }}
        /> */}
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {username || "Unknown User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {email || "No Email Provided"}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
