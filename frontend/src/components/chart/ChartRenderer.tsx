import React from "react";
import CustomBarChart from "@/components/chart/CustomBarChart";
import CustomLineChart from "@/components/chart/CustomLineChart";

interface ChartRendererProps {
  data: any;
  type: "line" | "bar";
  options?: any;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  data,
  type,
  options,
}) => {
  if (!data) return null;

  return (
    <>
      {type === "line" ? (
        <CustomLineChart data={data} options={options} />
      ) : (
        <CustomBarChart data={data} options={options} />
      )}
    </>
  );
};

export default ChartRenderer;
