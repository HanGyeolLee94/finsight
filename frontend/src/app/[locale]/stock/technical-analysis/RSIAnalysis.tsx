import ChartPeriodSelector from "@/components/chart/ChartPeriodSelector";
import ChartRenderer from "@/components/chart/ChartRenderer";
import CustomAutoCompleteInput from "@/components/CustomAutoCompleteInput";
import { apiRequestWithLoading } from "@/utils/api";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormLabel,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

export default function RSIAnalysis() {
  const periodsTypeOne = ["5D", "1M", "3M", "YTD", "1Y", "5Y", "All"];
  const [periodTypeOne, setPeriodTypeOne] = useState("1M");
  const fetchChartDataTypeOne = async (period: string) => {
    console.log(period);
    try {
      setPeriodTypeOne(period);
    } catch (error) {
      console.error("Error fetching TypeOne chart data", error);
    }
  };
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [rsiData, setRsiData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [companies, setCompanies] = useState<{ TEXT: string; ID: string }[]>(
    []
  );
  const { t } = useTranslation();

  // 기업 리스트 서버에서 가져오기
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const json = {}; // 필요 시 검색 조건 추가 가능

        const companies = await apiRequestWithLoading(
          "/technical-analysis/tickers",
          {
            method: "POST",
            json: json,
          }
        );
        setCompanies(companies);
      } catch (err) {
        console.error("Error fetching company data:", err);
      }
    };
    fetchCompanies();
  }, []);

  // 선택한 기업의 RSI 데이터 가져오기
  const fetchRsiData = async (company: string) => {
    if (!company) return;
    try {
      const data = await apiRequestWithLoading(
        `/technical-analysis/rsi/history`,
        {
          method: "POST",
          json: { symbol: company },
        }
      );

      setRsiData(data.rsi);
      setLabels(data.labels);
    } catch (err) {
      console.error("Error fetching RSI data:", err);
    }
  };

  const generateRsiData = async (company: string) => {
    if (!company) return;

    try {
      await apiRequestWithLoading(`/technical-analysis/rsi/generate`, {
        method: "POST",
        json: { symbol: company },
      });
      // After generating RSI, fetch the updated data
      //fetchRsiData(company);
    } catch (err) {
      console.error("Error generating RSI data:", err);
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <FormLabel htmlFor="company-search" sx={{ mr: 1 }}>
            {t("tikeo")}
          </FormLabel>
          <CustomAutoCompleteInput
            options={companies}
            name="company-search"
            id="company-search"
            disableClearable={false}
            useOptionId={false}
            placeholder={t("hoesamyeongttoneuntikeoibryeog")}
            onChange={setSelectedCompany}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 8 }}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <ButtonGroup variant="contained">
            <Button onClick={() => fetchRsiData(selectedCompany)}>
              {t("rsibeunsug")}
            </Button>
            <Button onClick={() => generateRsiData(selectedCompany)}>
              {t("rsibeunsugdeiteiseongsaeng")}
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {/* Line Chart - Close Price */}
        <Grid size={{ xs: 12, md: 6 }}>
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
                  RSI
                </Typography>
                <ChartPeriodSelector
                  periods={periodsTypeOne}
                  selectedPeriod={periodTypeOne}
                  onPeriodChange={fetchChartDataTypeOne}
                />
              </Box>
              <ChartRenderer data={[]} type="line" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
