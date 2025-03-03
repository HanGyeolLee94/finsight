// src/types/react-table.d.ts
import { ColumnDef } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    required?: boolean;
    editable?: boolean;
    allowEditForNewRows?: boolean; // Allow editing only for new rows (is_new: true)
    checkbox?: boolean; // Determines whether CheckboxCell is used
    align?: "left" | "center" | "right";
    format?: "comma" | "currency" | "percentage" | "uppercase" | "lowercase";
    enableSorting?: boolean;
    comboBox?: {
      optionData: { TEXT: string; ID: string }[]; // Options for ComboBoxCell
      disableClearable?: boolean; // Disable the clear (X) icon
    }; // ComboBox configuration object
    enableLink?: {
      hrefFormatter: (value: string) => string; // Function to format link href
    };
  }
  interface TableMeta<TData> {
    updateData: (row: any, columnId: string, value: unknown) => void;
  }
}
