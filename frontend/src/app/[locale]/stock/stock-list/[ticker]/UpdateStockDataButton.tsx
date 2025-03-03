import React, { useState, useRef } from "react";
import {
  Button,
  ButtonGroup,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { apiRequestWithLoading } from "@/utils/api";
import { useTranslation } from "react-i18next";
import { useAlert } from "@/context/AlertContext";
import { usePermissions } from "@/context/PermissionsContext";

interface UpdateStockDataButtonProps {
  symbol: string;
  onUpdateSuccess?: () => void; // Callback after successful update
}

const UpdateStockDataButton: React.FC<UpdateStockDataButtonProps> = ({
  symbol,
  onUpdateSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const { getCurrentPermissions } = usePermissions();
  const { canEdit } = getCurrentPermissions();

  const options = [
    { label: t("jeonchedaeiteoeobdeiteu"), action: "/ticker/update-all" },
  ];

  const triggerUpdate = async (index: number) => {
    const selectedAction = options[index].action;

    try {
      await apiRequestWithLoading(selectedAction, {
        method: "POST",
        json: { symbol },
      });
      showAlert(t("eobdeiteugaweollyodeotseumnida"), "success");
      if (onUpdateSuccess) {
        onUpdateSuccess(); // Notify parent about success
      }
    } catch (error) {
      console.error(`Action "${options[index].label}" failed:`, error);
    }
  };

  const handleClick = async () => {
    await triggerUpdate(selectedIndex);
  };

  const handleMenuItemClick = async (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    await triggerUpdate(index);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <ButtonGroup variant="contained" ref={anchorRef}>
        {/* Primary button for executing the selected action */}
        <Button
          onClick={handleClick}
          aria-label={options[selectedIndex].label}
          disabled={!canEdit}
        >
          {options[selectedIndex].label}
        </Button>

        {/* Dropdown button for toggling the menu */}
        <Button
          size="small"
          aria-controls={open ? "update-stock-data-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
          aria-label="Toggle menu"
          disabled={!canEdit}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="update-stock-data-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.label}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default UpdateStockDataButton;
