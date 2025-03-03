import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { scrollableStyles } from "@/utils/scrollbarStyles";

interface StyledTextProps {
  variant: "primary" | "secondary";
}

const StyledText = styled("text")<StyledTextProps>(({ theme, variant }) => ({
  textAnchor: "middle",
  dominantBaseline: "central",
  fill: theme.palette.text.secondary,
  fontSize:
    variant === "primary"
      ? theme.typography.h5.fontSize
      : theme.typography.body2.fontSize,
  fontWeight:
    variant === "primary"
      ? theme.typography.h5.fontWeight
      : theme.typography.body2.fontWeight,
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({
  primaryText,
  secondaryText,
}: PieCenterLabelProps): JSX.Element {
  const { width, height, left, top } = useDrawingArea();
  return (
    <>
      <StyledText
        variant="primary"
        x={left + width / 2}
        y={top + height / 2 - 10}
      >
        {primaryText}
      </StyledText>
      <StyledText
        variant="secondary"
        x={left + width / 2}
        y={top + height / 2 + 14}
      >
        {secondaryText}
      </StyledText>
    </>
  );
}

interface ChartData {
  label: string;
  value: number;
}

interface CircleChartWithListProps {
  data: ChartData[];
  chartTitle?: string;
  totalLabel?: string;
  listMaxHeight?: number;
}

export default function CircleChartWithList({
  data,
  chartTitle = "Chart Title",
  totalLabel = "Total",
  listMaxHeight = 200,
}: CircleChartWithListProps): JSX.Element {
  const colors = [
    "hsl(220, 20%, 65%)",
    "hsl(220, 20%, 42%)",
    "hsl(220, 20%, 35%)",
    "hsl(220, 20%, 25%)",
  ];
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          {chartTitle}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <PieChart
            colors={colors}
            margin={{
              left: 80,
              right: 80,
              top: 80,
              bottom: 80,
            }}
            series={[
              {
                data,
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 0,
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel
              primaryText={totalValue.toLocaleString()}
              secondaryText={totalLabel}
            />
          </PieChart>
        </Box>
        <Box
          sx={{
            maxHeight: listMaxHeight,
            ...scrollableStyles,
          }}
        >
          {data.map((item, index) => {
            const percentage = ((item.value / totalValue) * 100).toFixed(2); // 퍼센트 계산
            return (
              <Stack
                key={index}
                direction="row"
                sx={{ alignItems: "center", gap: 2, pb: 2 }}
              >
                <Stack sx={{ gap: 1, flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: "500" }}>
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.value.toLocaleString()} ({percentage}%)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(percentage)}
                    sx={{
                      [`& .${linearProgressClasses.bar}`]: {
                        backgroundColor: colors[index % colors.length],
                      },
                    }}
                  />
                </Stack>
              </Stack>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
