import { LineSeriesType } from "@mui/x-charts";
import { LineChart as MuiLineChart } from "@mui/x-charts/LineChart";
import React from "react";

// 시리즈 데이터 구조
interface LineChartSeriesData {
  id: string; // 시리즈 ID
  label: string; // 시리즈 이름 (범례에 표시)
  lineData: number[]; // Y축 값
  color?: string; // 시리즈 색상 (선택적)
}

// LineChart에 전달될 데이터 구조
interface CustomLineChartData {
  xLabels: string[]; // X축 라벨 배열
  seriesData: LineChartSeriesData[]; // 시리즈 데이터 배열
}

// 옵션 구조
interface CustomLineChartOptions {
  legend_hidden?: boolean; // 범례 표시 여부
  showMark?: boolean; // 마커 표시 여부
  percent?: boolean; // 값을 백분율로 표시 여부
  yAxisValueFormatter?: (value: number) => string; // Y축 값 포맷 함수
  series_stack?: string; // 시리즈 스택 이름 (선택적)
  series_area?: boolean; // 시리즈를 영역 차트로 표시 여부
}

// CustomLineChart Props 타입
interface CustomLineChartProps {
  data?: CustomLineChartData; // 데이터 (옵셔널)
  options?: CustomLineChartOptions; // 옵션 (옵셔널)
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
  data,
  options = {},
}) => {
  // 데이터 유효성 검증
  if (!data || !data.xLabels?.length || !data.seriesData?.length) {
    return null; // 유효하지 않은 데이터일 경우 아무것도 렌더링하지 않음
  }

  // Tick 간격 계산 함수
  const calculateTickInterval = (labelCount: number): number => {
    if (labelCount <= 10) return 1;
    else if (labelCount <= 20) return 2;
    else if (labelCount <= 50) return 5;
    else return Math.ceil(labelCount / 10);
  };

  const tickInterval = calculateTickInterval(data.xLabels.length);

  // 메모이제이션된 차트 키 생성
  const chartKey = React.useMemo(
    () => JSON.stringify(data.xLabels),
    [data.xLabels]
  );

  return (
    <MuiLineChart
      key={chartKey}
      colors={data.seriesData.map((series) => series.color || "#000")} // 기본 색상 설정
      xAxis={[
        {
          scaleType: "point",
          data: data.xLabels,
          tickInterval: (index, i) => (i + 1) % tickInterval === 0,
        },
      ]}
      yAxis={[
        {
          scaleType: "linear",
          valueFormatter: options.percent
            ? (value) => `${(value * 100).toFixed(0)}%`
            : options.yAxisValueFormatter, // Y축 값 포맷 함수
        },
      ]}
      series={data.seriesData.map((series) => {
        const { series_stack, series_area } = options;

        return {
          id: series.id,
          label: series.label,
          showMark: options.showMark === true,
          curve: "linear",
          data: series.lineData,
          stackOrder: "ascending",
          valueFormatter: options.percent
            ? (value: number | null) =>
                value !== null ? `${(value * 100).toFixed(1)}%` : ""
            : undefined,
          ...(series_stack && { stack: series_stack }),
          ...(series_area && { area: series_area }),
        };
      })}
      height={250}
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

export default CustomLineChart;
