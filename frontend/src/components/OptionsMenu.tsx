import * as React from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "./MenuButton";
import { useRouter } from "next/navigation";
import { handleInvalidToken } from "@/utils/auth"; // Import your logout function
import { useState } from "react";
import DefaultPageSelector from "@/components/DefaultPageSelector";
import { useTranslation } from "react-i18next";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export default function OptionsMenu() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter(); // Use the router for redirection

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Call the logout function to remove token from localStorage and cookies
    handleInvalidToken();

    // Redirect the user to the login page
    router.push("/login");
  };

  const [selectorOpen, setSelectorOpen] = useState(false);

  const handleOpenSelector = () => {
    setSelectorOpen(true);
  };

  const handleCloseSelector = () => {
    setSelectorOpen(false);
  };

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        {/* <MenuItem onClick={handleClose} disabled>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose} disabled={true}>
          My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} disabled>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose} disabled>
          Settings
        </MenuItem> */}
        <MenuItem onClick={handleOpenSelector}>
          {t("gibonpeijibyeongyeong")}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout} // Attach handleLogout to the Logout menu item
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText>{t("rogeuaus")}</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
      <DefaultPageSelector open={selectorOpen} onClose={handleCloseSelector} />
    </React.Fragment>
  );
}
