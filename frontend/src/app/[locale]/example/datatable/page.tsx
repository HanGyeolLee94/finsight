"use client";
import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import ExampleSection from "./ExampleSection";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import ExpandableCell from "@/components/tanstack/ExpandableCell";

const columnHelper = createColumnHelper<any>();

// 컬럼 정의 함수
const useColumns = () => {
  const { t } = useTranslation(); // Translation hook

  return [
    columnHelper.accessor("PRODUCT_ID", {
      header: t("Product ID"),
      cell: (props) => (
        <ExpandableCell row={props.row} getValue={props.getValue} />
      ),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 150,
      meta: {
        enableSorting: true,
      },
    }),
    columnHelper.accessor("PRODUCT_NAME", {
      header: t("Product Name"),
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 200,
      meta: {
        enableLink: {
          hrefFormatter: (value) => `/products/${value}`,
        },
      },
    }),
    columnHelper.accessor("CATEGORY", {
      header: t("Category"),
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 200,
      meta: {
        comboBox: {
          optionData: [
            { TEXT: "Electronics", ID: "Electronics" },
            { TEXT: "Clothing", ID: "Clothing" },
            { TEXT: "Accessories", ID: "Accessories" },
          ],
          disableClearable: false,
        },
        editable: true,
      },
    }),
    columnHelper.accessor("PRICE", {
      header: t("Price"),
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 120,
      meta: {
        editable: true,
        required: true,
        format: "currency",
        align: "right",
      },
    }),
    columnHelper.accessor("STOCK", {
      header: t("Check box"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        align: "center",
        checkbox: true,
        editable: true,
      },
    }),
  ];
};

const ExampleTablesWithDocs = () => {
  const sampleColumns1 = useColumns();

  const generateSampleData = (count: number) => {
    return Array.from({ length: count }, (_, index) => {
      const id = index + 1;
      return {
        PRODUCT_ID: `P-${id}`,
        PRODUCT_NAME: `Product ${id}`,
        CATEGORY: id % 2 === 0 ? "Electronics" : "Clothing",
        PRICE: (Math.random() * 100).toFixed(2),
        STOCK: Math.floor(Math.random() * 1000),
        subRows:
          id % 5 === 0
            ? [
                {
                  PRODUCT_ID: `P-${id}-A`,
                  PRODUCT_NAME: `SubProduct ${id}-A`,
                  CATEGORY: "Accessories",
                  PRICE: (Math.random() * 50).toFixed(2),
                  STOCK: Math.floor(Math.random() * 500),
                },
                {
                  PRODUCT_ID: `P-${id}-B`,
                  PRODUCT_NAME: `SubProduct ${id}-B`,
                  CATEGORY: "Accessories",
                  PRICE: (Math.random() * 50).toFixed(2),
                  STOCK: Math.floor(Math.random() * 500),
                },
              ]
            : [],
      };
    });
  };

  const sampleData1 = generateSampleData(15);

  const options1 = {
    checkboxEnabled: true,
    paginationEnabled: true,
    sortingEnabled: true,
    toolbarEnabled: true,
    rowNumEnabled: true,
    tableHeight: "400px",
    columnResizedEnabled: true,
    toolbarOptions: {
      showAddRow: true,
      showDeleteRow: true,
      showSearch: true,
      showExcelExport: true,
      showExpandCollapse: true,
    },
  };

  // Example 3: Minimal Configuration
  const sampleColumns2 = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "price", header: "Price" },
  ];
  const sampleData2 = [
    { id: 1, product: "Laptop", price: "$1000" },
    { id: 2, product: "Phone", price: "$700" },
    { id: 3, product: "Tablet", price: "$400" },
  ];
  const options2 = {
    checkboxEnabled: false,
    paginationEnabled: false,
    sortingEnabled: false,
    toolbarEnabled: false,
    rowNumEnabled: false,
    tableHeight: "auto",
    columnResizedEnabled: false,
  };

  const tableRef1 = useRef<any>(null);

  return (
    <Box sx={{ padding: "2rem", maxWidth: "80%", margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        Data Table Examples
      </Typography>

      {/* Example 1 */}
      <ExampleSection
        title="Example 1: Full Features Enabled with SubRows"
        columns={sampleColumns1}
        data={sampleData1}
        options={options1}
      />

      <ExampleSection
        showTableChangesButton={false}
        title="Example 2: Minimal Configuration"
        columns={sampleColumns2}
        data={sampleData2}
        options={options2}
      />
    </Box>
  );
};

export default ExampleTablesWithDocs;
