"use client";
import React, { useState, useEffect } from "react";
import DynamicInfoContainer from "@/components/info/DynamicInfoContainer";
import PageLayout from "@/components/PageLayout";
import CustomTabPanelCard from "@/components/tab/CustomTabPanelCard";
import TabContainer from "@/components/TabContainer";
import TabHeader from "@/components/TabHeader";
import TitleContainer from "@/components/title/TitleContainer";
import TitleText from "@/components/title/TitleText";
import { apiRequest } from "@/utils/api";
import { TabList } from "@mui/lab";
import { Box, Tab, Typography, Breadcrumbs, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

import AssessmentIcon from "@mui/icons-material/Assessment";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FinancialTabs from "./financials-tab/FinancialTabs";
import { formatChange, formatDataForDisplay } from "./function";
import StockChartTab from "./stockchart-tab/StockChartTab";
import UpdateStockDataButton from "./UpdateStockDataButton";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";

export default function TickerPage({ params }: { params: { ticker: string } }) {
  const { t } = useTranslation();
  let { ticker } = params;
  ticker = ticker?.replace(/-/g, ".");
  const [tickerData, setTickerData] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0); // State to force chart update
  const fetchTickerData = async () => {
    const json = { SYMBOL: ticker };
    try {
      const response = await apiRequest("/ticker/select-one", {
        method: "POST",
        json: json,
      });
      setTickerData(response);
    } catch (error) {
      console.error("Failed to fetch ticker data:", error);
    }
  };

  // Unified update function for `onUpdateSuccess`
  const handleUpdateSuccess = () => {
    fetchTickerData(); // Refresh ticker data
    setRefreshKey((prevKey) => prevKey + 1); // Force chart update
  };

  useEffect(() => {
    fetchTickerData();
  }, [ticker]);

  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <PageLayout>
      <DynamicBreadcrumbs>
        <UpdateStockDataButton
          symbol={ticker}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </DynamicBreadcrumbs>

      {tickerData && (
        <>
          <TitleContainer>
            <TitleText title={`${tickerData.NAME} (${ticker})`}>
              {tickerData.PRICE != null &&
                tickerData.CHANGE_VALUE != null &&
                tickerData.CHANGES_PERCENTAGE != null && (
                  <Box ml={2} display="flex" alignItems="center">
                    <Typography variant="h6" component="span">
                      {tickerData.PRICE.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{
                        color: tickerData.CHANGE_VALUE < 0 ? "red" : "green",
                        ml: 1,
                      }}
                    >
                      {`${formatChange(
                        tickerData.CHANGE_VALUE
                      )} (${formatChange(tickerData.CHANGES_PERCENTAGE)}%)`}
                    </Typography>
                  </Box>
                )}
            </TitleText>
          </TitleContainer>
          <DynamicInfoContainer
            items={formatDataForDisplay(tickerData, t)}
            layoutType="column"
          />

          <TabContainer value={value}>
            <TabHeader>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  icon={<ShowChartIcon />}
                  iconPosition="start"
                  label={t("chateu")}
                  value="1"
                />
                <Tab
                  icon={<AssessmentIcon />}
                  iconPosition="start"
                  label={t("jaemujejipyo")}
                  value="2"
                />
              </TabList>
            </TabHeader>

            <CustomTabPanelCard value="1" selectedValue={value}>
              <StockChartTab symbol={ticker} refreshKey={refreshKey} />
            </CustomTabPanelCard>

            <CustomTabPanelCard value="2" selectedValue={value}>
              <FinancialTabs symbol={ticker} refreshKey={refreshKey} />
            </CustomTabPanelCard>
          </TabContainer>
        </>
      )}
    </PageLayout>
  );
}
