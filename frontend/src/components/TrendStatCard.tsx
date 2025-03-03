import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

export type TrendStatCardProps = Partial<{
  title: string;
  value: string; // String type for value
  interval: string;
  trend: "up" | "down" | "neutral";
  trend_value: string;
  data: {
    xAxisData?: string[]; // Optional x-axis labels
    values: number[]; // Corresponding y-axis values
  };
}>;

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function normalizeData(data: number[]): number[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  if (min === max) return data.map(() => 0.5); // Prevent divide-by-zero
  return data.map((value) => (value - min) / (max - min));
}

function addRandomNoise(data: number[], variation = 0.01): number[] {
  return data.map(
    (value) => value + value * (Math.random() * variation * 2 - variation)
  );
}

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function TrendStatCard({ data }: { data: TrendStatCardProps }) {
  const theme = useTheme();
  const fallbackDays = getDaysInMonth(4, 2024);

  const {
    title = "N/A",
    value = "0",
    interval = "N/A",
    trend = "neutral",
    trend_value = "0%",
    data: chartData = { xAxisData: fallbackDays, values: [] },
  } = data || {};

  // Parse value as a number, format with commas and two decimal places
  const formattedValue = value
    ? Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "N/A";

  const { xAxisData = fallbackDays, values } = chartData;

  // Normalize and process the data for rendering
  const normalizedValues = normalizeData(values);
  const processedChartData = values.map((value, index) => ({
    original: value,
    normalized: addRandomNoise(normalizedValues)[index],
  }));

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: "success" as const,
    down: "error" as const,
    neutral: "default" as const,
  };

  const color = labelColors[trend];
  const chartColor = trendColors[trend];

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="h4" component="p">
                {formattedValue}
              </Typography>
              <Chip size="small" color={color} label={trend_value} />
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {interval}
            </Typography>
          </Stack>
          <Box sx={{ width: "100%", height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={processedChartData.map((point) => point.normalized)} // Use normalized data for chart rendering
              valueFormatter={(value) => {
                const index = processedChartData.findIndex(
                  (point) => point.normalized === value
                );
                const originalValue = processedChartData[index]?.original || 0;
                return originalValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
              }}
              showTooltip={true} // Enable the tooltip
              showHighlight={true}
              area
              xAxis={{
                scaleType: "band",
                data: xAxisData, // Use xAxisData from the props
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
