import React, { useEffect, useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { usePathname, useRouter } from "next/navigation";
import { useMenuReload } from "@/context/MenuReloadProvider";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" },
];

// Define the structure for a menu item
interface MenuItem {
  MENU_ID: string;
  MENU_NAME: string;
  PATH?: string; // Optional because some items might not have a PATH (e.g. parent items with subRows)
  CAN_EDIT?: string;
  subRows?: MenuItem[]; // Optional subRows array for nested menus
}

export default function MenuContent() {
  const pathname = usePathname(); // Get the current PATH from Next.js router
  const router = useRouter(); // Next.js router for navigation
  const { reloadKey } = useMenuReload();

  // State to track the active PATH (for highlighting)
  const [activePath, setActivePath] = useState(pathname);

  // State to hold the menu items, initially empty until we load from localStorage
  const [mainListItems, setMainListItems] = useState<MenuItem[]>([]);

  // Track the open/close state of submenus
  const [open, setOpen] = useState<Record<string | number, boolean>>({}); // Open state for collapsible menus

  // Use useEffect to safely access localStorage (client-side only)
  useEffect(() => {
    const fetchMenuData = () => {
      const storedMenu = localStorage.getItem("menuData");
      if (storedMenu) {
        setMainListItems(JSON.parse(storedMenu));
      }
    };

    // Reset the open state when reloadKey changes (collapse all menus)
    const resetOpenState = () => {
      setOpen({}); // Clear all open states to collapse all menus
    };

    fetchMenuData(); // Fetch new menu data
    resetOpenState(); // Collapse all menus
  }, [reloadKey]); // Trigger when reloadKey changes

  // Update the active PATH on pathname change
  useEffect(() => {
    setActivePath(pathname);

    // Function to recursively find and expand menu items based on pathname
    const expandMatchingMenu = (items: MenuItem[], currentPath: string) => {
      items.forEach((item, index) => {
        if (item.subRows && item.subRows.length > 0) {
          // Check if any sub-item matches the current path
          const isMatch = item.subRows.some(
            (subItem) => subItem.PATH === currentPath
          );

          if (isMatch) {
            setOpen((prevOpen) => ({
              ...prevOpen,
              [index]: true, // Expand the matched menu
            }));
          }

          // Recursive call for deeper submenus
          expandMatchingMenu(item.subRows, currentPath);
        }
      });
    };

    expandMatchingMenu(mainListItems, pathname);
  }, [pathname, mainListItems]);

  // Handle navigation when a menu item is clicked
  const handleNavigation = (PATH: string, CAN_EDIT?: string) => {
    router.push(PATH); // Navigate to the clicked PATH
    setActivePath(PATH); // Update the active PATH
  };

  // Handle the collapsing/expanding of submenus
  const handleClick = (index: string | number) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index], // Toggle the submenu open/close state
    }));
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      {/* Main List (Primary Menu Items) */}
      <List dense>
        {mainListItems.map((item, index) => (
          <React.Fragment key={item.PATH || index}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={activePath === item.PATH}
                onClick={
                  () =>
                    item.subRows &&
                    Array.isArray(item.subRows) &&
                    item.subRows.length > 0
                      ? handleClick(index) // If the item has subRows, toggle the submenu
                      : handleNavigation(item.PATH!, item.CAN_EDIT!) // Otherwise, navigate to the PATH
                }
              >
                <ListItemText primary={item.MENU_NAME} />
                {item.subRows && item.subRows.length > 0 ? (
                  open[index] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItemButton>
            </ListItem>

            {/* Render subRows if available and submenu is open */}
            {item.subRows && (
              <Collapse in={open[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                  {item.subRows.map((subItem) => (
                    <ListItem
                      key={subItem.PATH || subItem.MENU_ID}
                      disablePadding
                      sx={{ display: "block" }}
                    >
                      <ListItemButton
                        sx={{ pl: 4 }}
                        selected={activePath === subItem.PATH}
                        onClick={() =>
                          handleNavigation(subItem.PATH!, subItem.CAN_EDIT!)
                        }
                      >
                        <ListItemText primary={subItem.MENU_NAME} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: "block" }}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemButton selected={activePath === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
