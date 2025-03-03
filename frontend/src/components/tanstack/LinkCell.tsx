import React from "react";
import { useRouter } from "next/navigation";
import { useRowData } from "@/context/RowDataContext";

interface LinkCellProps {
  value: string; // The TICKER or any other value you need for the link
  rowData: any; // The original row data (row.original)
  hrefFormatter: (value: string) => string; // A function that formats the URL based on the value
}

const LinkCell: React.FC<LinkCellProps> = ({
  value,
  rowData,
  hrefFormatter,
}) => {
  const router = useRouter();
  const { setRowData } = useRowData(); // Use RowDataContext to set the row data

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // Set the original row data in the context for later use
    setRowData(rowData);

    // Use the hrefFormatter to create the URL using only the value (e.g., TICKER)
    const href = hrefFormatter(value);

    router.push(href); // Navigate to the generated URL
  };

  return (
    <a href="#" onClick={handleClick}>
      {value} {/* Render the value (e.g., TICKER) as the link text */}
    </a>
  );
};

export default LinkCell;
