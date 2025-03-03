// StackedAreaChart.tsx
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, Typography, Stack, Chip } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

interface AreaGradientProps {
  color: string;
  id: string;
}

function AreaGradient({ color, id }: AreaGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

interface StackedAreaChartProps {
  data: string[]; // x-axis labels, e.g., dates
  seriesData: {
    id: string;
    label: string;
    color: string;
    data: number[];
  }[]; // Array of data series, each with an ID, label, color, and data array
  totalSessions?: number; // Optional total metric to display
  percentageChange?: string; // Optional percentage change to display
}

const StackedAreaChart: React.FC<StackedAreaChartProps> = ({
  data,
  seriesData,
  totalSessions,
  percentageChange,
}) => {
  const theme = useTheme();

  return (
    <>
      <Stack sx={{ justifyContent: "space-between" }}>
        {totalSessions && (
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalSessions.toLocaleString()}
            </Typography>
            {percentageChange && (
              <Chip size="small" color="success" label={percentageChange} />
            )}
          </Stack>
        )}
      </Stack>

      {/* Line Chart */}
      <LineChart
        colors={seriesData.map((s) => s.color)}
        xAxis={[
          {
            scaleType: "point",
            data,
            tickInterval: (index, i) => (i + 1) % 5 === 0,
          },
        ]}
        series={seriesData.map((s) => ({
          id: s.id,
          label: s.label,
          showMark: false,
          curve: "linear",
          stack: "total",
          area: true,
          stackOrder: "ascending",
          data: s.data,
        }))}
        height={250}
        margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
        grid={{ horizontal: true }}
        sx={{
          ...seriesData.reduce<Record<string, any>>((acc, s) => {
            acc[`& .MuiAreaElement-series-${s.id}`] = {
              fill: `url(#${s.id})`,
            };
            return acc;
          }, {}),
        }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      >
        {seriesData.map((s) => (
          <AreaGradient key={s.id} color={s.color} id={s.id} />
        ))}
      </LineChart>
    </>
  );
};

export default StackedAreaChart;
