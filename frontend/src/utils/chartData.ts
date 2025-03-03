export const buildLineChartData = (
  result: Array<{ [key: string]: any }>, // API result
  xKey: string, // x-axis key
  seriesConfig: Array<{
    id: string;
    label: string;
    color?: string; // Optional color
    tooltipKeys?: string[]; // Optional keys for tooltip data
    tooltipLabels?: string[]; // Optional labels for tooltip keys
  }>
) => {
  // Define a set of default colors
  const defaultColors = [
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
    "#AB47BC",
    "#EF5350",
    "#26C6DA",
    "#FFCA28",
    "#8D6E63",
    "#78909C",
    "#D4E157",
  ];

  // Extract x-axis labels
  const xLabels = result.map((item) => item[xKey]);

  // Create series data
  const seriesData = seriesConfig.map((config, index) => ({
    id: config.id,
    label: config.label,
    color: config.color || defaultColors[index % defaultColors.length], // Assign color if not provided
    lineData: result.map((item) => item[config.id] || null),
  }));

  return { xLabels, seriesData };
};

export const buildBarChartData = (
  result: Array<{ [key: string]: any }>, // API result
  xKey: string, // Key for x-axis labels
  labels: Array<{ id: string; label: string; stack?: string; color?: string }> // Custom labels mapping
) => {
  // Define a set of default colors
  const defaultColors = [
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
    "#AB47BC",
    "#EF5350",
    "#26C6DA",
    "#FFCA28",
    "#8D6E63",
    "#78909C",
    "#D4E157",
  ];

  // The dataset remains the same
  const dataset = result;

  // Extract seriesData dynamically, including only labeled keys
  const seriesData = labels.map((label, index) => ({
    dataKey: label.id, // Each label id becomes a dataKey
    label: label.label, // Use the provided label
    color: label.color || defaultColors[index % defaultColors.length], // Assign color if not provided
    stack: label.stack,
  }));

  return { dataset, seriesData, xKey };
};
