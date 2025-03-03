import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Tabs, Tab, Typography } from "@mui/material";
import DataTable from "@/components/tanstack/DataTable";
import { generateColumns } from "./generateColumns";
import { apiRequestWithLoading } from "@/utils/api";
import { useTranslation } from "react-i18next";
import {
  processIncomeStatement,
  processBalanceSheet,
  processCashFlow,
} from "./function";

interface FinancialTabsProps {
  symbol: string;
  refreshKey: number; // New prop for triggering data refresh
}

const FinancialTabs: React.FC<FinancialTabsProps> = ({
  symbol,
  refreshKey,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState("FY");
  const [tableData, setTableData] = useState<any[]>([]);
  const [columnData, setColumnData] = useState<any[]>([]); // State for dynamic columns
  const { t } = useTranslation(); // Hook for translations

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleViewModeChange = (period: string) => {
    setViewMode(period);
    fetchFinancialData(selectedTab, viewMode);
  };

  const endpointMap = [
    "/ticker/get-income-statement",
    "/ticker/get-balance-sheet",
    "/ticker/get-cash-flow-statement",
  ];

  // 메인 함수
  const fetchFinancialData = async (tab: any, period: any): Promise<any> => {
    const json: any = { SYMBOL: symbol, PERIOD: period };

    try {
      const response: any = await apiRequestWithLoading(endpointMap[tab], {
        method: "POST",
        json: json,
      });

      let dateArray: any = [];
      let verticalData: any = [];

      // tab에 따라 다른 함수 호출
      switch (tab) {
        case 0:
          ({ dateArray, verticalData } = processIncomeStatement(response, t));
          break;
        case 1:
          ({ dateArray, verticalData } = processBalanceSheet(response, t));
          break;
        case 2:
          ({ dateArray, verticalData } = processCashFlow(response, t));
          break;
        default:
          console.error("Invalid tab value");
          return;
      }

      // 컬럼과 테이블 데이터 업데이트
      const newColumns: any = generateColumns(dateArray, t);
      setColumnData(newColumns);
      setTableData(verticalData);
    } catch (error: any) {
      console.error("Failed to fetch financial data:", error);
      setColumnData([]);
      setTableData([]);
    }
  };

  // Fetch data on symbol, tab, viewMode, or refreshKey change
  useEffect(() => {
    fetchFinancialData(selectedTab, viewMode);
  }, [symbol, selectedTab, viewMode, refreshKey]);

  return (
    <Box>
      {/* 상단 탭 */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{
          justifyContent: "flex-start",
          display: "flex",
        }}
      >
        <Tab label={t("jaemujejipyo")} />
        <Tab label={t("sonikgyesaekseo")} />
        <Tab label={t("daechadaejopyo")} />
      </Tabs>

      {/* 버튼 그룹 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Typography variant="subtitle1">
          {/* {t("modeun susjaneun cheon danwideibnida")} */}
        </Typography>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button
            onClick={() => handleViewModeChange("FY")}
            variant={viewMode === "FY" ? "contained" : "outlined"}
          >
            {t("yeonggan")}
          </Button>
          <Button
            onClick={() => handleViewModeChange("Q")}
            variant={viewMode === "Q" ? "contained" : "outlined"}
          >
            {t("bungigyeol")}
          </Button>
        </ButtonGroup>
      </Box>

      {/* 콘텐츠 표시 */}
      <Box mt={4}>
        <DataTable
          columns={columnData} // Use dynamic column state
          data={tableData} // Use dynamic table data
          options={{
            tableHeight: "auto",
            paginationEnabled: false,
            checkboxEnabled: false,
            toolbarEnabled: true,
            rowNumEnabled: false,
            toolbarOptions: {
              showExcelExport: true,
              showExpandCollapse: false,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FinancialTabs;
