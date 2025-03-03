import { useAlert } from "@/context/AlertContext";
import {
  addNewRow,
  addUniqueIdsToData,
  createRowNumberColumn,
  createSelectColumn,
  deleteSelectedRows,
  updateRowData,
  validateTableRows,
} from "@/utils/dataTableUtils";
import { Box, Paper, Table, TableContainer } from "@mui/material";
import {
  ColumnFiltersState,
  ColumnResizeMode,
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import "./DataTable.css";
import { DataTableBody } from "./DataTableBody";
import DataTableBox from "./DataTableBox";
import DataTableContainer from "./DataTableContainer";
import DataTableFlexGrowBox from "./DataTableFlexGrowBox";
import DataTableFooter from "./DataTableFooter";
import { DataTableHeader } from "./DataTableHeader";
import DataTableToolbar from "./DataTableToolbar";

interface DataTableOptions {
  checkboxEnabled?: boolean;
  paginationEnabled?: boolean;
  sortingEnabled?: boolean;
  toolbarEnabled?: boolean; // Add toolbarEnabled option
  toolbarOptions?: {
    showAddRow?: boolean; // Option to show or hide Add Row button
    showDeleteRow?: boolean;
    showSearch?: boolean; // Option to show or hide Search field
    showExcelExport?: boolean; // Option to show or hide Export to Excel button
    showExpandCollapse?: boolean; // Show Expand/Collapse buttons
  };
  tableHeight?: string | number;
  rowNumEnabled?: boolean;
  columnResizedEnabled?: boolean;
}

interface DataTableProps {
  columns: any[];
  data: any[];
  options?: DataTableOptions;
  handleSearch?: (pageIndex: number, pageSize: number) => void;
  totalCount?: number;
}

// Create a column helper for type safety and convenience
const columnHelper = createColumnHelper<any>();

const DataTable = forwardRef(
  (
    {
      columns,
      data: initialData,
      options = {},
      handleSearch,
      totalCount,
    }: DataTableProps,
    ref
  ) => {
    const [data, setData] = useState<any[]>([]);
    const [expanded, setExpanded] = useState({}); // Add state for expanded rows
    const { showAlert } = useAlert();
    const { t } = useTranslation();

    const [addedRows, setAddedRows] = useState<any[]>([]); // Tracks added rows
    const [modifiedRows, setModifiedRows] = useState<any[]>([]); // Tracks modified rows
    const [deletedRows, setDeletedRows] = useState<any[]>([]); // Tracks deleted rows
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
      {}
    ); // Tracks selected rows

    useEffect(() => {
      // Reset the table data and selection when initialData changes
      setData(addUniqueIdsToData(initialData));
      setAddedRows([]);
      setModifiedRows([]);
      setDeletedRows([]);
      setRowSelection({});
    }, [initialData]);

    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 50,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnVisibility, setColumnVisibility] = useState({});
    const [columnResizeMode, setColumnResizeMode] =
      useState<ColumnResizeMode>("onChange");

    const {
      checkboxEnabled = false,
      paginationEnabled = false,
      sortingEnabled = false,
      toolbarEnabled = false,
      rowNumEnabled = false,
      tableHeight = "auto",
      columnResizedEnabled = false,
    } = options;

    useEffect(() => {
      if (totalCount !== undefined) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset pageIndex to 0
      }
    }, [totalCount]);

    const updateData = (row: any, columnId: string, value: unknown) => {
      updateRowData(
        row,
        columnId,
        value,
        addedRows,
        setAddedRows,
        setModifiedRows,
        setData
      );
    };

    // 선택된 행 삭제
    const handleDeleteSelectedRows = () => {
      deleteSelectedRows(
        data,
        rowSelection,
        addedRows,
        setAddedRows,
        setDeletedRows,
        setData,
        setRowSelection
      );
    };

    const handleAddRow = () => {
      addNewRow(columns, setAddedRows, setData);
    };

    useImperativeHandle(ref, () => ({
      getAddedRows: () => addedRows,
      getDeletedRows: () => deletedRows,
      getModifiedRows: () => modifiedRows,
      resetPagination: () => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page
      },
      validateTable: () => {
        return validateTableRows(
          addedRows,
          modifiedRows,
          deletedRows,
          table,
          showAlert,
          t
        );
      },
    }));

    const dynamicColumns = [
      ...(rowNumEnabled ? [createRowNumberColumn(columnHelper)] : []),
      ...(checkboxEnabled ? [createSelectColumn(columnHelper)] : []),
      ...columns.map((col) => ({
        ...col,
        enableResizing: columnResizedEnabled, // Conditional resizing
        enableSorting: sortingEnabled,
      })),
    ];

    const table = useReactTable({
      data,
      columns: dynamicColumns,
      state: {
        sorting,
        pagination,
        columnFilters,
        globalFilter,
        rowSelection,
        columnVisibility,
        expanded,
      },
      onSortingChange: sortingEnabled ? setSorting : undefined,
      onPaginationChange:
        paginationEnabled && !handleSearch ? setPagination : undefined,
      onColumnFiltersChange: setColumnFilters,
      onRowSelectionChange: setRowSelection,
      onExpandedChange: setExpanded,
      columnResizeMode,
      getSubRows: (row) => row.subRows || [],
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: sortingEnabled ? getSortedRowModel() : undefined,
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel:
        paginationEnabled && !handleSearch
          ? getPaginationRowModel()
          : undefined,
      getExpandedRowModel: getExpandedRowModel(),
      enableRowSelection: checkboxEnabled,
      meta: { updateData },
    });

    return (
      <Box className="table-container">
        <TableContainer
          component={Paper}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Conditionally render DataTableToolbar if toolbarEnabled is true */}
          {toolbarEnabled && (
            <DataTableToolbar
              table={table}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              data={data}
              columns={columns}
              onAddRow={handleAddRow}
              onDeleteSelectedRows={handleDeleteSelectedRows}
              options={options.toolbarOptions} // Pass toolbarOptions to DataTableToolbar
            />
          )}
          <DataTableContainer height={tableHeight}>
            <DataTableBox>
              <Table
                stickyHeader
                sx={{
                  minWidth: tableHeight,
                  width: table.getCenterTotalSize(),
                  backgroundColor: (theme) => theme.palette.background.paper,
                  flexGrow: 1,
                }}
              >
                <DataTableHeader table={table} />
                <DataTableBody table={table} />
              </Table>
              <DataTableFlexGrowBox />
            </DataTableBox>
          </DataTableContainer>

          {/* Conditionally render the footer if pagination is enabled */}
          {paginationEnabled && (
            <Table>
              <DataTableFooter
                table={table}
                pagination={pagination}
                setPagination={setPagination}
                handleSearch={handleSearch}
                totalCount={totalCount}
              />
            </Table>
          )}
        </TableContainer>
      </Box>
    );
  }
);

DataTable.displayName = "DataTable";

export default DataTable;
