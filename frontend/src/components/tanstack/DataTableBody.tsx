import { TableBody, TableRow, TableCell, useTheme } from "@mui/material";
import { flexRender } from "@tanstack/react-table";
import EditableCell from "@/components/tanstack/EditableCell";
import CheckboxCell from "@/components/tanstack/CheckboxCell";
import ComboBoxCell from "@/components/tanstack/ComboBoxCell";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePermissions } from "@/context/PermissionsContext";
import { formatValue } from "./function";
import LinkCell from "./LinkCell";

export function DataTableBody({ table }: { table: any }) {
  const theme = useTheme(); // Access the theme object
  const [renderKey, setRenderKey] = useState(uuidv4());
  const { getCurrentPermissions } = usePermissions();
  const { canEdit } = getCurrentPermissions();

  useEffect(() => {
    setRenderKey(uuidv4());
  }, [table.options.data]);

  return (
    <TableBody>
      {table.getRowModel().rows.map((row: any) => (
        <TableRow key={`${renderKey}-${row.id}`}>
          {row.getVisibleCells().map((cell: any) => {
            const { meta } = cell.column.columnDef;
            const align = meta?.align || "left";
            const comboBoxConfig = meta?.comboBox;
            const isCheckbox = meta?.checkbox;
            const editable =
              canEdit &&
              meta?.editable &&
              (!meta?.allowEditForNewRows || row.original?.is_new);

            // Determine error state and background color
            const error = meta?.required && !cell.getValue();
            const errorBackgroundColor = error
              ? theme.palette.mode === "dark"
                ? theme.palette.error.dark
                : theme.palette.error.light
              : "inherit";

            // Handle display columns (e.g., rowNum) separately
            const columnId = cell.column.id;
            const value =
              columnId === "rowNum"
                ? row.index + 1 // Dynamically calculate row number
                : cell.getValue();

            // Format the value if `format` is specified in `meta`
            const formattedValue = (() => {
              if (columnId === "rowNum") {
                // Skip formatting for row numbers, use the raw value
                return value;
              }

              if (meta?.format) {
                // Apply formatting if specified in `meta`
                return formatValue(value, meta.format);
              }

              // Default to the raw value if no conditions match
              return cell.column.columnDef.cell;
            })();

            return (
              <TableCell
                key={`${row.id}-${columnId}`}
                className="body-cell"
                style={{
                  width: cell.column.getSize(),
                  textAlign: align,
                  backgroundColor: errorBackgroundColor,
                }}
              >
                {meta?.enableLink ? (
                  <LinkCell
                    value={value}
                    rowData={row.original}
                    hrefFormatter={meta.enableLink.hrefFormatter}
                  />
                ) : isCheckbox ? (
                  <CheckboxCell
                    id={`checkbox-row-${row.id}-${columnId}`}
                    name={`row-select-${row.id}-${columnId}`}
                    value={value}
                    onChange={(value: string) =>
                      table.options.meta.updateData(
                        row.original,
                        columnId,
                        value
                      )
                    }
                    disabled={!editable}
                  />
                ) : comboBoxConfig ? (
                  <ComboBoxCell
                    value={value}
                    options={comboBoxConfig.optionData}
                    onChange={(option) =>
                      table.options.meta.updateData(
                        row.original,
                        columnId,
                        option?.ID || ""
                      )
                    }
                    disabled={!editable}
                    disableClearable={comboBoxConfig.disableClearable || false}
                  />
                ) : editable ? (
                  <EditableCell
                    value={value}
                    onBlur={(newValue) =>
                      table.options.meta.updateData(
                        row.original,
                        columnId,
                        newValue
                      )
                    }
                  />
                ) : (
                  flexRender(formattedValue, cell.getContext())
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
