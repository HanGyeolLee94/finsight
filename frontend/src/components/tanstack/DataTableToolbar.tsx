import {
  collapseAllRows,
  countSelectedRowsWithSubRows,
  expandAllRows,
  exportToExcel,
} from "@/utils/dataTableUtils";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess"; // Collapse icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Expand icon
import { Box, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";
import { useTranslation } from "react-i18next";
import ExcelIcon from "../icons/ExcelIcon";

interface DataTableToolbarProps {
  table: any;
  globalFilter: string;
  setGlobalFilter: (filterValue: string) => void;
  data: any[];
  columns: any[];
  onAddRow: () => void;
  onDeleteSelectedRows: () => void;
  options?: {
    showAddRow?: boolean; // Show Add Row button
    showDeleteRow?: boolean;
    showSearch?: boolean; // Show Search field
    showExcelExport?: boolean; // Show Export to Excel button
    showExpandCollapse?: boolean; // Show Expand/Collapse buttons
  };
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  table,
  globalFilter,
  setGlobalFilter,
  data,
  columns,
  onAddRow,
  onDeleteSelectedRows,
  options = {
    showAddRow: false,
    showDeleteRow: false,
    showSearch: false,
    showExcelExport: false,
    showExpandCollapse: false,
  },
}) => {
  const { t } = useTranslation();

  const rowSelection = table.getState().rowSelection; // 현재 선택 상태 가져오기
  const selectedRowCount = countSelectedRowsWithSubRows(
    table.getCoreRowModel().rows,
    rowSelection
  );

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          border: 1,
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "divider" : "divider",
        },
        selectedRowCount > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {/* Selected Rows Display */}
      {selectedRowCount > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selectedRowCount} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* Search Field */}
        {options.showSearch && (
          <TextField
            sx={{ flexGrow: 1, maxWidth: "30%" }}
            fullWidth
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            variant="outlined"
            placeholder={t("search_placeholder")}
          />
        )}

        {/* Expand/Collapse Icons */}
        {options.showExpandCollapse && (
          <>
            <Tooltip title={t("modupyeolchigi")}>
              <IconButton color="primary" onClick={() => expandAllRows(table)}>
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("modujeopgi")}>
              <IconButton
                color="primary"
                onClick={() => collapseAllRows(table)}
              >
                <ExpandLessIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {/* Conditionally render Add/Delete button */}
        {selectedRowCount > 0 && options.showDeleteRow ? (
          <Tooltip title={t("haengsakje")}>
            <IconButton color="error" onClick={onDeleteSelectedRows}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          options.showAddRow && (
            <Tooltip title={t("haengchuga")}>
              <IconButton color="primary" onClick={onAddRow}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )
        )}

        {/* Export to Excel Button */}
        {options.showExcelExport && (
          <Tooltip title={t("exceldaunrode")}>
            <IconButton
              color="success"
              onClick={() => exportToExcel(data, columns)}
            >
              <ExcelIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Toolbar>
  );
};

export default DataTableToolbar;
