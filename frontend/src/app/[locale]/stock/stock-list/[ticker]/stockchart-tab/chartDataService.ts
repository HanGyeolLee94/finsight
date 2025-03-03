import { apiRequestWithLoading } from "@/utils/api";
import { buildBarChartData, buildLineChartData } from "@/utils/chartData";

export const getClosePriceChartData = async (
  symbol: string,
  period: string,
  t: any
) => {
  const result = await apiRequestWithLoading("/ticker/close-price-chart-data", {
    method: "POST",
    json: { SYMBOL: symbol, PERIOD: period },
  });
  return buildLineChartData(result.closePrice, "DATE", [
    { id: "CLOSE_PRICE", label: t("jugajongga") },
  ]);
};

export const getPerChartData = async (
  symbol: string,
  period: string,
  t: any
) => {
  const result = await apiRequestWithLoading("/ticker/per-chart-data", {
    method: "POST",
    json: { SYMBOL: symbol, PERIOD: period },
  });
  return buildLineChartData(result.per, "DATE", [{ id: "PER", label: "PER" }]);
};

export const getEpsChartData = async (
  symbol: string,
  period: string,
  t: any
) => {
  const result = await apiRequestWithLoading("/ticker/eps-chart-data", {
    method: "POST",
    json: { SYMBOL: symbol, PERIOD: period },
  });
  return buildBarChartData(result.eps, "CALENDAR_YEAR", [
    { id: "EPS", label: t("judangsunuig") },
    { id: "EPS_DILUTED", label: t("huisog judangsunuig") },
  ]);
};

export const getRevenueChartData = async (
  symbol: string,
  period: string,
  t: any
) => {
  const result = await apiRequestWithLoading("/ticker/revenue-chart-data", {
    method: "POST",
    json: { SYMBOL: symbol, PERIOD: period },
  });
  const barChartData = buildBarChartData(result.revenue, "CALENDAR_YEAR", [
    { id: "COST_OF_REVENUE", label: t("maechulwonga"), stack: "A" },
    { id: "GROSS_PROFIT", label: t("maechulchongig"), stack: "A" },
  ]);

  const lineChartData = buildLineChartData(result.revenue, "CALENDAR_YEAR", [
    { id: "COST_OF_REVENUE", label: t("maechulwonga") },
    { id: "GROSS_PROFIT", label: t("maechulchongig") },
  ]);

  return { barChart: barChartData, lineChart: lineChartData };
};

export const getRatioChartData = async (
  symbol: string,
  period: string,
  t: any
) => {
  const result = await apiRequestWithLoading("/ticker/ratio-chart-data", {
    method: "POST",
    json: { SYMBOL: symbol, PERIOD: period },
  });
  return buildLineChartData(result.ratio, "CALENDAR_YEAR", [
    { id: "GROSS_PROFIT_RATIO", label: t("maechulchongiglyul") },
    { id: "EBITDARATIO", label: t("ebitda biyul") },
    { id: "NET_INCOME_RATIO", label: t("sunuiglyul") },
  ]);
};

export const getFreeCashFlowChartData = async (
  symbol: string,
  period: string,
  t: any
) => {
  const result = await apiRequestWithLoading(
    "/ticker/freecashflow-chart-data",
    {
      method: "POST",
      json: { SYMBOL: symbol, PERIOD: period },
    }
  );
  return buildLineChartData(result.freecashflow, "CALENDAR_YEAR", [
    { id: "FREE_CASH_FLOW", label: t("jauyeongeumhuleum") },
    { id: "NET_INCOME", label: t("suniig") },
  ]);
};

export const getCashFlowBreakdownChartData = async (
  symbol: string,
  period: string,
  t: any
) => {
  const result = await apiRequestWithLoading(
    "/ticker/cashflowbreakdown-chart-data",
    {
      method: "POST",
      json: { SYMBOL: symbol, PERIOD: period },
    }
  );

  return buildBarChartData(result.cashflowbreakdown, "CALENDAR_YEAR", [
    {
      id: "OPERATING_CASH_FLOW",
      label: t("yeongeophwaldongeuroinhansunhyeongeumheuleum"),
      stack: "A",
    },
    {
      id: "CAPITAL_EXPENDITURE",
      label: t("jabonchul"),
    },
    {
      id: "INVESTING_CASH_FLOW",
      label: t("toojahwaldongeuroinhansunhyeongeumheuleum"),
    },
    {
      id: "FINANCING_CASH_FLOW",
      label: t("jeonmohwaldongeuroinhansunhyeongeumheuleum"),
    },
  ]);
};
