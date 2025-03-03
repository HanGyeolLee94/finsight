import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CodeBlockSection from "./CodeBlockSection"; // Ensure the path is correct

interface CodeBlockAccordionProps {
  title: string;
  content: unknown;
}

const CodeBlockAccordion: React.FC<CodeBlockAccordionProps> = ({
  title,
  content,
}) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <CodeBlockSection title="" content={JSON.stringify(content, null, 2)} />
      </AccordionDetails>
    </Accordion>
  );
};

export default CodeBlockAccordion;
