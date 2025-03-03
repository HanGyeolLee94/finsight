import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // 수직 점 3개 아이콘
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ActionsMenuProps {
  row: any; // You can refine this type based on your row data structure
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  onView: (row: any) => void;
  showView?: boolean; // Optional prop to show/hide the View button
  showEdit?: boolean; // Optional prop to show/hide the Edit button
  showDelete?: boolean; // Optional prop to show/hide the Delete button
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({
  row,
  onEdit,
  onDelete,
  onView,
  showView = true, // Default to true if not provided
  showEdit = true, // Default to true if not provided
  showDelete = true, // Default to true if not provided
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} aria-label="more actions">
        <MoreVertIcon /> {/* 수직 점 3개 아이콘 */}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {showView && (
          <MenuItem
            onClick={() => {
              onView(row);
              handleClose();
            }}
          >
            <VisibilityIcon fontSize="small" style={{ marginRight: 8 }} />
            상세 조회
          </MenuItem>
        )}
        {showEdit && (
          <MenuItem
            onClick={() => {
              onEdit(row);
              handleClose();
            }}
          >
            <EditIcon fontSize="small" style={{ marginRight: 8 }} />
            편집
          </MenuItem>
        )}
        {showDelete && (
          <MenuItem
            onClick={() => {
              onDelete(row);
              handleClose();
            }}
          >
            <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
            삭제
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default ActionsMenu;
