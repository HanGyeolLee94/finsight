import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<any>();

export const generateColumns = (
  dateArray: string[],
  t: (key: string) => string
) => {
  // Define the base column (항목)
  const columns = [
    columnHelper.accessor("ITEM", {
      header: t("sebuhangmok"), // Fixed header for the first column
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 200,
    }),
  ];

  // Add columns dynamically based on dateArray
  if (dateArray && dateArray.length > 0) {
    dateArray.forEach((date) => {
      columns.push(
        columnHelper.accessor(date, {
          header: date, // Use the date as the header
          cell: (info) => info.getValue(),
          enableResizing: true,
          size: 150,
          meta: { align: "right" },
        })
      );
    });
  }

  return columns;
};
