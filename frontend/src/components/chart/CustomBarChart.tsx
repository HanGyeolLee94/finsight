import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";
import React from "react";

// 데이터셋의 각 항목 구조
interface DatasetItem {
  [key: string]: any;
}

// 시리즈 데이터 구조
interface SeriesData {
  dataKey: string;
  label: string;
  color?: string;
  stack?: string;
}

// CustomBarChart에 전달될 데이터 구조
interface CustomBarChartData {
  dataset: DatasetItem[];
  xKey: string;
  seriesData: SeriesData[];
}

// 옵션 구조
interface CustomBarChartOptions {
  borderRadius?: number;
  legend_hidden?: boolean;
  yAxisValueFormatter?: (value: number) => string; // Y축 값 포맷 함수
}

// 확장된 xAxis 설정
interface ExtendedXAxisConfig {
  scaleType: "band" | "linear" | "point"; // 지원하는 스케일 타입
  dataKey: string; // x축 데이터 키
  categoryGapRatio?: number; // 막대 간격 비율
}

// CustomBarChart Props 타입
interface CustomBarChartProps {
  data?: CustomBarChartData;
  options?: CustomBarChartOptions;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  options = {},
}) => {
  const { borderRadius = 10, yAxisValueFormatter } = options;

  if (
    !data ||
    !data.dataset ||
    data.dataset.length === 0 ||
    !data.xKey ||
    !data.seriesData ||
    data.seriesData.length === 0
  ) {
    return null;
  }

  const xAxisConfig: ExtendedXAxisConfig = {
    scaleType: "band",
    dataKey: data.xKey,
    categoryGapRatio: 0.3, // 막대 간격 설정
  };

  return (
    <MuiBarChart
      dataset={data.dataset}
      xAxis={[xAxisConfig]} // 확장된 xAxis 설정
      yAxis={[
        {
          scaleType: "linear",
          valueFormatter: yAxisValueFormatter, // Y축 값 포맷 함수
        },
      ]}
      series={data.seriesData.map((series) => ({
        dataKey: series.dataKey,
        label: series.label,
        color: series.color,
        stack: series.stack,
        stackOrder: "ascending",
      }))}
      height={250}
      borderRadius={borderRadius}
      margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
      grid={{ horizontal: true }}
      slotProps={{
        legend: {
          hidden: options.legend_hidden !== false,
        },
      }}
    />
  );
};

export default CustomBarChart;
