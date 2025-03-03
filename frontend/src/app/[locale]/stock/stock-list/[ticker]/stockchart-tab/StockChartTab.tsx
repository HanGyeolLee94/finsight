import ChartRenderer from "@/components/chart/ChartRenderer";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getClosePriceChartData,
  getEpsChartData,
  getFreeCashFlowChartData,
  getPerChartData,
  getRatioChartData,
  getRevenueChartData,
  getCashFlowBreakdownChartData,
} from "./chartDataService";
import { formatYAxisValue } from "./function";
import ChartPeriodSelector from "@/components/chart/ChartPeriodSelector";
import { TOOLTIP_CONTENTS } from "./tooltipContents";

interface StockChartTabProps {
  symbol: string;
  refreshKey: number; // New prop to trigger data refresh
}

const StockChartTab: React.FC<StockChartTabProps> = ({
  symbol,
  refreshKey,
}) => {
  const gridSize = 6;
  const { t } = useTranslation();
  // State for chart data
  const [closePriceChartData, setClosePriceChartData] = useState<any>(null);
  const [perChartData, setPerChartData] = useState<any>(null);
  const [epsChartData, setEpsChartData] = useState<any>(null);
  const [revenueBarChartData, setRevenueBarChartData] = useState<any>(null);
  const [revenueLineChartData, setRevenueLineChartData] = useState<any>(null);
  const [ratioChartData, setRatioChartData] = useState<any>(null);
  const [freeCashFlowChartData, setFreeCashFlowChartData] = useState<any>(null);
  const [cashFlowBreakdownChartData, setCashFlowBreakdownChartData] =
    useState<any>(null);

  // State for filters
  const [periodTypeOne, setPeriodTypeOne] = useState("1M");
  const [periodTypeTwo, setPeriodTypeTwo] = useState("5Y");

  // Fetch Line Chart Data
  const periodsTypeOne = ["5D", "1M", "3M", "YTD", "1Y", "5Y", "All"];
  const periodsTypeTwo = ["1Y", "2Y", "3Y", "5Y", "All"];
  const fetchChartDataTypeOne = async (period: string) => {
    try {
      const closePriceData = await getClosePriceChartData(symbol, period, t);
      setClosePriceChartData(closePriceData);
      const perData = await getPerChartData(symbol, period, t);
      setPerChartData(perData);
      setPeriodTypeOne(period);
    } catch (error) {
      console.error("Error fetching TypeOne chart data", error);
    }
  };

  const fetchChartDataTypeTwo = async (period: string) => {
    try {
      const epsData = await getEpsChartData(symbol, period, t);
      const revenueData = await getRevenueChartData(symbol, period, t);
      const ratioData = await getRatioChartData(symbol, period, t);
      const freeCashFlowData = await getFreeCashFlowChartData(
        symbol,
        period,
        t
      );
      const cashFlowBreakdown = await getCashFlowBreakdownChartData(
        symbol,
        period,
        t
      );
      setEpsChartData(epsData);
      setRevenueBarChartData(revenueData.barChart);
      setRevenueLineChartData(revenueData.lineChart);
      setRatioChartData(ratioData);
      setFreeCashFlowChartData(freeCashFlowData);
      setCashFlowBreakdownChartData(cashFlowBreakdown);

      setPeriodTypeTwo(period);
    } catch (error) {
      console.error("Error fetching TypeTwo chart data", error);
    }
  };

  // Initial fetch on mount or refreshKey change
  useEffect(() => {
    fetchChartDataTypeOne(periodTypeOne);
    fetchChartDataTypeTwo(periodTypeTwo);
  }, [symbol, refreshKey]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}></Grid>

      {/* Line Chart - Close Price */}
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                {t("jugajongga")}
              </Typography>
              <ChartPeriodSelector
                periods={periodsTypeOne}
                selectedPeriod={periodTypeOne}
                onPeriodChange={fetchChartDataTypeOne}
              />
            </Box>
            <ChartRenderer data={closePriceChartData} type="line" />
          </CardContent>
        </Card>
      </Grid>

      {/* Line Chart - PER */}
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                {t("PERjugasuyikbiyul")}
              </Typography>
              <ChartPeriodSelector
                periods={periodsTypeOne}
                selectedPeriod={periodTypeOne}
                onPeriodChange={fetchChartDataTypeOne}
              />
            </Box>
            <ChartRenderer data={perChartData} type="line" />
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart Filter */}
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                {t("judangsunuig")}
              </Typography>
              <ChartPeriodSelector
                periods={periodsTypeTwo}
                selectedPeriod={periodTypeTwo}
                onPeriodChange={fetchChartDataTypeTwo}
              />
            </Box>
            <ChartRenderer
              data={epsChartData}
              options={{ legend_hidden: false }}
              type="bar"
            />
          </CardContent>
        </Card>
      </Grid>
      {/* Line Chart - Ratio */}
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tooltip
                title={
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-line" }}
                  ></Typography>
                }
                arrow
              >
                <Typography
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{ cursor: "help" }}
                >
                  {t("suikseongbiyul")}
                </Typography>
              </Tooltip>
              <ChartPeriodSelector
                periods={periodsTypeTwo}
                selectedPeriod={periodTypeTwo}
                onPeriodChange={fetchChartDataTypeTwo}
              />
            </Box>

            <ChartRenderer
              data={ratioChartData}
              options={{
                legend_hidden: false,
                showMark: true,
                percent: true,
              }}
              type="line"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                {t("maechulmitiikchui")}
              </Typography>
              <ChartPeriodSelector
                periods={periodsTypeTwo}
                selectedPeriod={periodTypeTwo}
                onPeriodChange={fetchChartDataTypeTwo}
              />
            </Box>
            <ChartRenderer
              data={revenueBarChartData}
              options={{
                legend_hidden: false,
                yAxisValueFormatter: formatYAxisValue,
              }}
              type="bar"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography component="h2" variant="subtitle2" gutterBottom>
                {t("maechulmitiikchui")}
              </Typography>
              <ChartPeriodSelector
                periods={periodsTypeTwo}
                selectedPeriod={periodTypeTwo}
                onPeriodChange={fetchChartDataTypeTwo}
              />
            </Box>
            <ChartRenderer
              data={revenueLineChartData}
              options={{
                series_area: true,
                series_stack: "total",
                yAxisValueFormatter: formatYAxisValue,
                showMark: true,
              }}
              type="line"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tooltip
                title={
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {TOOLTIP_CONTENTS.FREE_CASH_FLOW}
                  </Typography>
                }
                arrow
              >
                <Typography
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{ cursor: "help" }}
                >
                  {t("jayuheonkeumheuleumvssuniikbigyo")}
                </Typography>
              </Tooltip>
              <ChartPeriodSelector
                periods={periodsTypeTwo}
                selectedPeriod={periodTypeTwo}
                onPeriodChange={fetchChartDataTypeTwo}
              />
            </Box>
            <ChartRenderer
              data={freeCashFlowChartData}
              options={{
                legend_hidden: false,
                showMark: true,
                yAxisValueFormatter: formatYAxisValue,
              }}
              type="line"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: gridSize }}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Tooltip
                title={
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {TOOLTIP_CONTENTS.CASH_FLOW_BREAKDOWN}
                  </Typography>
                }
                arrow
              >
                <Typography
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{ cursor: "help" }}
                >
                  {t("hyeongeumeuleumguseong")}
                </Typography>
              </Tooltip>
              <ChartPeriodSelector
                periods={periodsTypeTwo}
                selectedPeriod={periodTypeTwo}
                onPeriodChange={fetchChartDataTypeTwo}
              />
            </Box>
            <ChartRenderer
              data={cashFlowBreakdownChartData}
              options={{
                yAxisValueFormatter: formatYAxisValue,
              }}
              type="bar"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StockChartTab;
