import * as React from "react";
import {
  Box,
  IconButton,
  TableFooter,
  TablePagination,
  TableRow,
  useTheme,
  Paper,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Table } from "@tanstack/react-table";

interface DataTableFooterProps {
  table: Table<any>;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  handleSearch?: (pageIndex: number, pageSize: number) => void;
  totalCount?: number; // Optional totalCount
}

const TablePaginationActions: React.FC<{
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}> = ({ count, page, rowsPerPage, onPageChange }) => {
  const theme = useTheme();

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
};

const DataTableFooter: React.FC<DataTableFooterProps> = ({
  table,
  pagination,
  setPagination,
  handleSearch,
  totalCount,
}) => {
  const { pageIndex, pageSize } = pagination;
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const pageCount = table.getPageCount();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPagination({ pageIndex: newPage, pageSize }); // Persist the new page index
    if (handleSearch) {
      handleSearch(newPage, pageSize); // Fetch data for the new page
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPagination({ pageIndex: 0, pageSize: newPageSize });
    if (handleSearch) {
      handleSearch(0, newPageSize); // Reset to page 0 with new page size
    }
  };

  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalCount ?? totalRows);

  return (
    <TableFooter
      sx={{
        border: 1, // Add a border
        borderColor: (theme) => theme.palette.divider, // Use theme's divider color
        borderRadius: 2, // Optional: Add rounded corners for style
      }}
    >
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 50, 100, 500, 1000]}
          colSpan={3}
          count={totalCount ?? totalRows}
          rowsPerPage={pageSize}
          page={pageIndex}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={() =>
            `${from}-${to} of ${totalCount ?? totalRows}`
          }
          SelectProps={{
            inputProps: {
              id: "rows-per-page-select", // Add unique id
              name: "rowsPerPage", // Add name for accessibility and autofill
              "aria-label": "Rows per page", // Optional: Add aria-label for better accessibility
            },
          }}
          ActionsComponent={(subProps) => (
            <TablePaginationActions
              count={subProps.count}
              page={subProps.page}
              rowsPerPage={subProps.rowsPerPage}
              onPageChange={subProps.onPageChange}
            />
          )}
        />
      </TableRow>
    </TableFooter>
  );
};

export default DataTableFooter;
