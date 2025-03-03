import React from "react";
import { Box } from "@mui/material";

const COLORS = {
  NEGATIVE_3: "#d32f2f",
  NEGATIVE_2: "#f44336",
  NEGATIVE_1: "#ef9a9a",
  ZERO: "#9e9e9e",
  POSITIVE_1: "#81c784",
  POSITIVE_2: "#4caf50",
  POSITIVE_3: "#388e3c",
};

type LegendItem = {
  label: string;
  color: string;
};

const changeRateLegendData: LegendItem[] = [
  { label: "-3%", color: COLORS.NEGATIVE_3 },
  { label: "-2%", color: COLORS.NEGATIVE_2 },
  { label: "-1%", color: COLORS.NEGATIVE_1 },
  { label: "0%", color: COLORS.ZERO },
  { label: "+1%", color: COLORS.POSITIVE_1 },
  { label: "+2%", color: COLORS.POSITIVE_2 },
  { label: "+3%", color: COLORS.POSITIVE_3 },
];

const ChangeRateLegend: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "right",
        gap: "1px",
        marginTop: "20px",
      }}
    >
      {changeRateLegendData.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50px",
            height: "30px",
            backgroundColor: item.color,
            color: "white",
            fontWeight: "bold",
          }}
        >
          {item.label}
        </Box>
      ))}
    </Box>
  );
};

export default ChangeRateLegend;

export const getChangeColor = (change: number): string => {
  if (change <= -3) return COLORS.NEGATIVE_3;
  if (change <= -2) return COLORS.NEGATIVE_2;
  if (change <= -1) return COLORS.NEGATIVE_1;
  if (change === 0) return COLORS.ZERO;
  if (change <= 1) return COLORS.POSITIVE_1;
  if (change <= 2) return COLORS.POSITIVE_2;
  return COLORS.POSITIVE_3;
};
