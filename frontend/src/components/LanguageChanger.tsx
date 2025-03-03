"use client";

import React, { useState } from "react";
import { useFetchAndStoreMenu } from "@/utils/menuUtils";
import { Box, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language.toUpperCase(); // Display as KO or EN
  const router = useRouter();
  const currentPathname = usePathname();
  const fetchAndStoreMenu = useFetchAndStoreMenu();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (newLocale: string) => {
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    await fetchAndStoreMenu();

    router.push(currentPathname); // Stay on the current page
    router.refresh();
    handleMenuClose(); // Close the menu
  };

  return (
    <Box>
      <IconButton
        onClick={handleMenuOpen}
        aria-label="Change Language"
        sx={{
          borderRadius: "50%",
        }}
      >
        <LanguageIcon fontSize="small" />
        <Typography
          sx={{
            ml: 1,
            fontSize: "0.875rem",
            fontWeight: 500,
            display: { xs: "none", sm: "inline" }, // Hide text on small screens
          }}
        >
          {currentLocale}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 150 },
        }}
      >
        <MenuItem onClick={() => handleLanguageChange("en")}>
          EN (ENGLISH)
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange("ko")}>
          KO (KOREAN)
        </MenuItem>
      </Menu>
    </Box>
  );
}
