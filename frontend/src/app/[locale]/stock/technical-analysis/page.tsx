"use client";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import PageLayout from "@/components/PageLayout";
import DataTable from "@/components/tanstack/DataTable";
import { Box, FormLabel, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MACDAnalysis from "./MACDAnalysis";
import MovingAverageAnalysis from "./MovingAverageAnalysis";
import RSIAnalysis from "./RSIAnalysis";

export default function TechnicalAnalysisPage() {
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<string>("RSI_ANALYSIS");
  const { t } = useTranslation();

  const analysisOptions = [
    { label: t("rsisuyigrulbunseog"), value: "RSI_ANALYSIS" },
    { label: "MACD 분석", value: "MACD_ANALYSIS" },
    { label: "이동 평균 분석", value: "MOVING_AVERAGE_ANALYSIS" },
  ];

  const renderAnalysisComponent = () => {
    switch (selectedAnalysis) {
      case "RSI_ANALYSIS":
        return <RSIAnalysis />;
      case "MACD_ANALYSIS":
        return <MACDAnalysis />;
      case "MOVING_AVERAGE_ANALYSIS":
        return <MovingAverageAnalysis />;
      default:
        return <DataTable data={[]} columns={[]} />;
    }
  };

  return (
    <PageLayout>
      <DynamicBreadcrumbs />

      {/* 분석 선택 드롭다운 */}
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormLabel htmlFor="analysis-type">{t("bunseogyuhyeong")}</FormLabel>
          <Select
            id="analysis-type"
            value={selectedAnalysis}
            onChange={(e) => setSelectedAnalysis(e.target.value)}
            fullWidth
          >
            {analysisOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* 선택된 분석 유형에 따라 컴포넌트 변경 */}
      <Box sx={{ mt: 3 }}>{renderAnalysisComponent()}</Box>
    </PageLayout>
  );
}
