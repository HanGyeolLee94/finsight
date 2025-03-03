import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import { flexRender } from "@tanstack/react-table";

export function DataTableHeader({ table }: { table: any }) {
  return (
    <TableHead>
      {table.getHeaderGroups().map((headerGroup: any) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header: any) => {
            const isSorted = header.column.getIsSorted(); // Check if the column is sorted
            const sortDirection = isSorted === "asc" ? "asc" : "desc"; // Determine sorting direction

            const enableSorting =
              header.column.columnDef.enableSorting &&
              header.column.columnDef.meta?.enableSorting !== false;

            return (
              <TableCell
                key={header.id}
                className="header-cell"
                style={{ width: header.getSize() }}
              >
                {enableSorting ? (
                  <TableSortLabel
                    active={!!isSorted} // Show active sorting indicator
                    direction={sortDirection} // Ascending or descending
                    onClick={header.column.getToggleSortingHandler()} // Handle sorting toggle
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableSortLabel>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
                {header.column.columnDef.enableResizing && (
                  <div
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  />
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableHead>
  );
}
