import React from "react";
import { Button, ButtonGroup } from "@mui/material";

interface ChartPeriodSelectorProps {
  periods: string[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const ChartPeriodSelector: React.FC<ChartPeriodSelectorProps> = ({
  periods,
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <ButtonGroup variant="text" aria-label="Chart Period Buttons">
      {periods.map((period) => (
        <Button
          key={period}
          onClick={() => onPeriodChange(period)}
          color={period === selectedPeriod ? "primary" : "inherit"}
        >
          {period}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ChartPeriodSelector;
