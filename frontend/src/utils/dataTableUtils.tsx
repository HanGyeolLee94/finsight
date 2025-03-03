import React from "react";
import IndeterminateCheckbox from "@/components/tanstack/IndeterminateCheckBox";
import { v4 as uuidv4 } from "uuid";

import * as XLSX from "xlsx";
export const addUniqueIdsToData = (data: any[]): any[] => {
  const addIdsRecursively = (rows: any[]): any[] => {
    return rows.map((row) => ({
      ...row,
      row_id: uuidv4(), // 고유 row_id 추가
      subRows: row.subRows ? addIdsRecursively(row.subRows) : undefined, // 하위 데이터에 대해서도 재귀적으로 처리
    }));
  };

  return addIdsRecursively(data);
};

export const countSelectedRowsWithSubRows = (
  rows: any[],
  rowSelection: Record<string, boolean>
): number => {
  return rows.reduce((count, row) => {
    const isSelected = !!rowSelection[row.id];
    let subRowCount = 0;

    // 하위 행이 존재하면 재귀적으로 카운트
    if (row.subRows?.length > 0) {
      subRowCount = countSelectedRowsWithSubRows(row.subRows, rowSelection);
    }

    // 현재 행이 선택된 경우, 하위 행 카운트를 포함하여 반환
    return count + (isSelected ? 1 : 0) + subRowCount;
  }, 0);
};

// Expand All Rows
export const expandAllRows = (table: any) => {
  const allExpanded = table
    .getCoreRowModel()
    .rows.reduce(
      (
        acc: Record<string, boolean>,
        row: { id: string | number; subRows: any[] }
      ) => {
        acc[row.id] = true; // Expand the row
        if (row.subRows) {
          row.subRows.forEach((subRow: any) => {
            acc[subRow.id] = true; // Expand sub-rows
          });
        }
        return acc;
      },
      {}
    );
  table.setExpanded(allExpanded);
};

// Collapse All Rows
export const collapseAllRows = (table: any) => {
  table.setExpanded({});
};

// Extract column headers and data for Excel export
export const extractColumnInfo = (columns: any[]) => {
  const ids = columns
    .filter((col) => col.accessorKey !== "ACTIONS") // Exclude actions column
    .map((col) => col.accessorKey);

  const headers = columns
    .filter((col) => col.accessorKey !== "ACTIONS")
    .map((col) => col.header);

  return { ids, headers };
};

// Extract rows with subrows for Excel export
export const extractRowsWithSubRows = (
  rows: any[],
  ids: string[],
  headers: string[]
) => {
  const result: any[] = [];

  const processRow = (row: any) => {
    const formattedRow: { [key: string]: any } = {};
    ids.forEach((id, index) => {
      formattedRow[headers[index]] = row[id];
    });
    result.push(formattedRow);

    // Recursively process subrows if they exist
    if (row.subRows && row.subRows.length > 0) {
      row.subRows.forEach((subRow: any) => processRow(subRow));
    }
  };

  rows.forEach((row) => processRow(row));
  return result;
};

// Excel Export Function
export const exportToExcel = (data: any[], columns: any[]) => {
  const { ids, headers } = extractColumnInfo(columns);
  const formattedData = extractRowsWithSubRows(data, ids, headers);
  const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    header: headers,
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "table_data.xlsx");
};

export const flattenData = (data: any[]) => {
  const flattened: any[] = [];

  const traverse = (rows: any[]) => {
    rows.forEach((row) => {
      flattened.push(row);
      if (row.subRows) {
        traverse(row.subRows);
        delete row.subRows; // Remove subRows from the parent row to avoid duplication
      }
    });
  };

  traverse(data);

  return flattened;
};

const updateTreeData = (
  data: any[],
  rowId: string,
  columnId: string,
  value: unknown
): any[] => {
  return data.map((node) => {
    // 해당 노드가 업데이트 대상인지 확인
    if (node.row_id === rowId) {
      // 노드를 복사하고 값 업데이트
      return {
        ...node,
        [columnId]: value,
        subRows: node.subRows
          ? updateTreeData(node.subRows, rowId, columnId, value)
          : [],
      };
    }

    // 하위 노드 탐색 (재귀적으로 호출)
    return {
      ...node,
      subRows: node.subRows
        ? updateTreeData(node.subRows, rowId, columnId, value)
        : [],
    };
  });
};

export const updateRowData = (
  row: any,
  columnId: string,
  value: unknown,
  addedRows: any[],
  setAddedRows: (updateFn: (prev: any[]) => any[]) => void,
  setModifiedRows: (updateFn: (prev: any[]) => any[]) => void,
  setData: (updateFn: (prev: any[]) => any[]) => void
) => {
  const updatedRow = { ...row, [columnId]: value };
  // 트리 데이터 업데이트
  setData((prev) => {
    const updatedData = updateTreeData(prev, row.row_id, columnId, value);
    return [...updatedData]; // 항상 새로운 배열을 반환
  });

  // 추가된 행 처리
  const isNewRow = addedRows.some((addedRow) => addedRow.row_id === row.row_id);

  if (isNewRow) {
    setAddedRows((prev) =>
      prev.map((addedRow) =>
        addedRow.row_id === row.row_id
          ? { ...addedRow, [columnId]: value }
          : addedRow
      )
    );
  } else {
    // 수정된 행 처리
    setModifiedRows((prev) => {
      const alreadyModifiedRowIndex = prev.findIndex(
        (modifiedRow) => modifiedRow.row_id === row.row_id
      );

      if (alreadyModifiedRowIndex !== -1) {
        const updatedModifiedRows = [...prev];
        updatedModifiedRows[alreadyModifiedRowIndex] = updatedRow;
        return updatedModifiedRows;
      } else {
        return [...prev, updatedRow];
      }
    });
  }
};

// 선택된 행 삭제
export const deleteSelectedRows = (
  data: any[],
  rowSelection: Record<string, boolean>,
  addedRows: any[],
  setAddedRows: (updateFn: (prev: any[]) => any[]) => void,
  setDeletedRows: (updateFn: (prev: any[]) => any[]) => void,
  setData: (updateFn: (prev: any[]) => any[]) => void,
  setRowSelection: (updateFn: Record<string, boolean>) => void
) => {
  const selectedRowIds = Object.keys(rowSelection).filter(
    (id) => rowSelection[id]
  );
  const selectedRows = selectedRowIds.map((id) => data[Number(id)]);

  // 새로 추가된 행과 기존 행 분리
  const newlyAddedRows = selectedRows.filter((row) =>
    addedRows.some((addedRow) => addedRow.row_id === row.row_id)
  );
  const existingRows = selectedRows.filter(
    (row) => !addedRows.some((addedRow) => addedRow.row_id === row.row_id)
  );

  // 새로 추가된 행을 완전히 제거
  setAddedRows((prev) =>
    prev.filter(
      (addedRow) =>
        !newlyAddedRows.some((newRow) => newRow.row_id === addedRow.row_id)
    )
  );
  setData((prev) =>
    prev.filter(
      (row) => !newlyAddedRows.some((newRow) => newRow.row_id === row.row_id)
    )
  );

  // 기존 행은 삭제 목록에 추가
  setDeletedRows((prev) => [...prev, ...existingRows]);

  // 기존 행은 data에서도 제거
  setData((prev) =>
    prev.filter(
      (row) =>
        !existingRows.some((existingRow) => existingRow.row_id === row.row_id)
    )
  );

  // 선택 초기화
  setRowSelection({});
};

// 새로운 행 추가
export const addNewRow = (
  columns: any[],
  setAddedRows: (updateFn: (prev: any[]) => any[]) => void,
  setData: (updateFn: (prev: any[]) => any[]) => void
) => {
  const newRow: any = {
    row_id: uuidv4(), // Unique row identifier
    is_new: true, // Mark as a new row
  };

  columns.forEach((col) => {
    if (col.accessorKey) {
      newRow[col.accessorKey] = ""; // Initialize each column key with an empty string
    }
  });

  // Update both addedRows and data state
  setAddedRows((prev) => [...prev, newRow]);
  setData((prev) => [...prev, newRow]);
};

// 테이블 유효성 검사 및 데이터 변경 여부 확인
export const validateTableRows = (
  addedRows: any[],
  modifiedRows: any[],
  deletedRows: any[],
  table: any,
  showAlert: (message: string, type: "error" | "warning") => void,
  t: (key: string) => string
): boolean => {
  let isValid = true;
  const rowsToValidate = [...addedRows, ...modifiedRows];

  rowsToValidate.forEach((row) => {
    let rowIsValid = true; // 각 행의 유효성 상태를 추적

    table.getAllColumns().forEach((column: any) => {
      const isRequired = column.columnDef.meta?.required;
      const value = row[column.id];

      if (isRequired && !value) {
        rowIsValid = false; // 행이 유효하지 않음을 표시
        isValid = false; // 전체 유효성 검사 실패
      }
    });

    if (!rowIsValid) {
      // 행 단위로 경고를 한 번만 표시
      showAlert(
        t("pilsuipyeongranibieoissseubnidaemodeunpildeureuljagseonghaejuseyo"),
        "error"
      );
    }
  });

  // 데이터 변경 여부 확인
  const hasDataChanged = () => {
    return (
      addedRows.length > 0 || modifiedRows.length > 0 || deletedRows.length > 0
    );
  };

  if (isValid && !hasDataChanged()) {
    showAlert(t("byeongyeongdeindaeteugaeopseumnida"), "warning");
    isValid = false;
  }

  return isValid;
};

// "No" 컬럼 생성 함수
export const createRowNumberColumn = (columnHelper: any) => {
  return columnHelper.display({
    id: "rowNum",
    header: "No",
    cell: (info: any) => info.row.index + 1,
    enableResizing: false,
    enableSorting: false,
    size: 50,
    meta: {
      align: "center",
    },
  });
};

// "Select" 컬럼 생성 함수
export const createSelectColumn = (columnHelper: any) => {
  return columnHelper.accessor("select", {
    id: "select",
    header: ({ table }: any) => (
      <IndeterminateCheckbox
        id={`checkbox-select-all`}
        name={`select-all`}
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: any) => (
      <IndeterminateCheckbox
        id={`checkbox-row-${row.id}`}
        name={`row-select-${row.id}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        // indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableResizing: false,
    enableSorting: false,
    size: 50,
    meta: {
      align: "center",
    },
  });
};
