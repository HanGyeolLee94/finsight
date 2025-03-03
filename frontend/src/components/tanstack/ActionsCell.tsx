import React from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ActionsCellProps {
  row: any; // You can refine this type based on your row data structure
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  onView: (row: any) => void;
  showView?: boolean; // Optional prop to show/hide the View button
  showEdit?: boolean; // Optional prop to show/hide the Edit button
  showDelete?: boolean; // Optional prop to show/hide the Delete button
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  row,
  onEdit,
  onDelete,
  onView,
  showView = true,   // Default to true if not provided
  showEdit = true,   // Default to true if not provided
  showDelete = true  // Default to true if not provided
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {showView && (
        <IconButton onClick={() => onView(row)} aria-label="view">
          <VisibilityIcon />
        </IconButton>
      )}
      {showEdit && (
        <IconButton onClick={() => onEdit(row)} aria-label="edit">
          <EditIcon />
        </IconButton>
      )}
      {showDelete && (
        <IconButton onClick={() => onDelete(row)} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
};

export default ActionsCell;
