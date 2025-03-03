import DataTable from "@/components/tanstack/DataTable";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
} from "@mui/material";
import React, { useRef, useState } from "react";
import CodeBlockAccordion from "./CodeBlockAccordion";
import CodeBlockSection from "./CodeBlockSection";
import { getTableChanges } from "@/utils/helpers";

interface ExampleSectionProps {
  showTableChangesButton?: boolean;
  title: string;
  columns: any;
  data: Record<string, unknown>[];
  options: Record<string, unknown>;
}

interface TableChanges {
  add: any;
  delete: any;
  update: any;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({
  showTableChangesButton = true,
  title,
  columns,
  data,
  options,
}) => {
  const tableRef = useRef(null);
  const [tableChanges, setTableChanges] = useState<TableChanges | null>(null);
  const [open, setOpen] = useState(false);

  const handleShowTableChanges = () => {
    const tableChanges = getTableChanges(tableRef);
    if (!tableChanges) {
      return;
    }
    setTableChanges(tableChanges);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        marginBottom: 4,
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <CodeBlockAccordion title="Column Example" content={columns} />
      <CodeBlockAccordion title="Data Example" content={data} />
      <CodeBlockSection
        title="Usage"
        content={`
<DataTable
  columns={columns}
  data={data}
  options={options}
/>
  `}
      />
      <CodeBlockSection
        title="Options"
        content={JSON.stringify(options, null, 2)}
      />
      <DataTable
        ref={tableRef}
        columns={columns}
        data={data}
        options={options}
      />

      {showTableChangesButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowTableChanges}
          sx={{ marginTop: 2 }}
        >
          Show table changes
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Table Changes</DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(tableChanges, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ExampleSection;
