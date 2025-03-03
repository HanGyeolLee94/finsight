"use client";
import CircleChartWithList from "@/components/CircleChartWithList";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import FinancialTermTreeView from "@/components/FinancialTermTreeView";
import PageLayout from "@/components/PageLayout";
import StockHeatmap from "@/components/StockHeatmap";
import TickerList from "@/components/TickerList";
import TrendStatCard, { TrendStatCardProps } from "@/components/TrendStatCard";
import { setCustomParams } from "@/store/navigationSlice";
import { apiRequestWithLoading } from "@/utils/api";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [topGainerData, setTopGainerData] = useState<any>([]);
  const [topLoserData, setTopLoserData] = useState<any>([]);
  const [snp500Data, setSnp500Data] = useState<any>([]);
  const [snp500SectorCompanyCntData, setSnp500SectorCompanyCntData] =
    useState<any>([]);
  const [snp500IndexData, setSnp500IndexData] = useState<TrendStatCardProps>(
    {}
  );
  const [nasdaqIndexData, setNasdaqIndexData] = useState<TrendStatCardProps>(
    {}
  );
  const [dowJonesIndexData, setDowJonesIndexData] =
    useState<TrendStatCardProps>({});

  const navigateToAnalysis = (type: string) => {
    dispatch(setCustomParams({ analysisType: type }));
    router.push("/stock/market-overview"); // Navigate to the page
  };

  const fetchDashboardData = async () => {
    try {
      const response = await apiRequestWithLoading("/dashboard/data", {
        method: "POST",
        json: {},
      });
      response.snp500Index.interval = t("jinan30il");
      response.nasdaqIndex.interval = t("jinan30il");
      response.dowJonesIndex.interval = t("jinan30il");
      setSnp500IndexData(response.snp500Index);
      setNasdaqIndexData(response.nasdaqIndex);
      setDowJonesIndexData(response.dowJonesIndex);
      setTopGainerData(response.topGainers);
      setTopLoserData(response.topLosers);
      setSnp500Data(response.snp500);
      setSnp500SectorCompanyCntData(response.snp500_sector_company_count);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <PageLayout>
      <DynamicBreadcrumbs />
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
          <TrendStatCard data={snp500IndexData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
          <TrendStatCard data={nasdaqIndexData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
          <TrendStatCard data={dowJonesIndexData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TickerList
            title={t("choegosangseungsongmok")}
            data={topGainerData}
            onTitleClick={() => navigateToAnalysis("TOP_GAINERS")}
            height="15rem" // Custom height
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TickerList
            title={t("choegoharaksongmok")}
            data={topLoserData}
            onTitleClick={() => navigateToAnalysis("TOP_LOSERS")}
            height="15rem" // Custom height
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TickerList
            title={t("seuandpi500guseongjongmok")}
            data={snp500Data}
            onTitleClick={() => navigateToAnalysis("SNP500")}
            height="15rem" // Custom height
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            <FinancialTermTreeView />
            <CircleChartWithList
              data={snp500SectorCompanyCntData}
              chartTitle={t("sandp500sektogeuseong")}
              totalLabel={t("jeonche")}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          <StockHeatmap />
          {/* <PuzzleLayout></PuzzleLayout> */}
        </Grid>
      </Grid>
    </PageLayout>
  );
}
