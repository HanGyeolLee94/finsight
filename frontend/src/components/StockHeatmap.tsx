import { apiRequestWithLoading } from "@/utils/api";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ChangeRateLegend, { getChangeColor } from "./ChangeRateLegend";
import { useTranslation } from "react-i18next";

type Company = {
  symbol: string;
  price: number;
  sector: string;
  change: number;
  marketCap: number;
  name: string;
};

function StockHeatmap() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedMarket, setSelectedMarket] = useState("snp500");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { t } = useTranslation();

  const marketOptions = [
    { label: "S&P 500", code: "snp500" },
    { label: "Dow Jones", code: "dowjones" },
    { label: "Nasdaq 100", code: "nasdaq100" },
  ];

  const filterOptions = [
    { label: t("jeonche"), code: "all" },
    { label: t("sekteo"), code: "sector" },
  ];

  const getHeatMapData = async (marketCode: string) => {
    try {
      const response = await apiRequestWithLoading("/dashboard/heatmap-data", {
        method: "POST",
        json: { market: marketCode },
      });
      const formattedData: Company[] = response.heatMapData.map(
        (company: any) => ({
          symbol: company.SYMBOL as string,
          price: parseFloat(company.PRICE as string),
          sector: company.SECTOR as string,
          change: parseFloat(company.CHANGE_VALUE as string),
          marketCap: Number(company.MARKET_CAP),
          name: company.NAME as string,
        })
      );
      setCompanies(formattedData);
    } catch (error) {
      console.error("Failed to fetch heatmap data:", error);
    }
  };

  useEffect(() => {
    getHeatMapData(selectedMarket);
  }, [selectedMarket]);

  const handleMarketChange = (marketCode: string) => {
    setSelectedMarket(marketCode);
  };

  const handleFilterChange = (filterCode: string) => {
    setSelectedFilter(filterCode);
  };

  const filteredCompanies =
    selectedFilter === "sector"
      ? companies.reduce((acc, company) => {
          if (!acc[company.sector]) acc[company.sector] = [];
          acc[company.sector].push(company);
          return acc;
        }, {} as Record<string, Company[]>)
      : { all: companies };

  const maxMarketCap =
    companies.length > 0 ? Math.max(...companies.map((c) => c.marketCap)) : 1;
  const maxBoxSize = 200;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("jusikhiteumaeb")}
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <ButtonGroup>
          {marketOptions.map((option) => (
            <Button
              key={option.code}
              onClick={() => handleMarketChange(option.code)}
              variant={
                selectedMarket === option.code ? "contained" : "outlined"
              }
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup>
          {filterOptions.map((option) => (
            <Button
              key={option.code}
              onClick={() => handleFilterChange(option.code)}
              variant={
                selectedFilter === option.code ? "contained" : "outlined"
              }
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      {selectedFilter === "sector" ? (
        Object.entries(filteredCompanies).map(([sector, sectorCompanies]) => {
          const sectorName = sector === "undefined" ? "Unknown Sector" : sector;
          return (
            <Box key={sector} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {sectorName}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
                  gridAutoFlow: "dense",
                  gap: "2px",
                  width: "100%",
                }}
              >
                {sectorCompanies.map((company) => {
                  const sizeRatio = company.marketCap / maxMarketCap;
                  const boxSize = Math.max(40, sizeRatio * maxBoxSize);
                  const gridSize = Math.max(1, Math.ceil(sizeRatio * 4));

                  return (
                    <Box
                      key={company.symbol}
                      bgcolor={getChangeColor(company.change)}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize={boxSize > 60 ? "0.9rem" : "0.7rem"}
                      fontWeight="bold"
                      borderRadius="4px"
                      textAlign="center"
                      sx={{
                        gridColumn: `span ${gridSize}`,
                        gridRow: `span ${gridSize}`,
                      }}
                    >
                      {company.symbol}
                      <br />
                      {company.change > 0 ? "+" : ""}
                      {company.change}%
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
            gridAutoFlow: "dense",
            gap: "2px",
            width: "100%",
          }}
        >
          {filteredCompanies.all.map((company) => {
            const sizeRatio = company.marketCap / maxMarketCap;
            const boxSize = Math.max(40, sizeRatio * maxBoxSize);
            const gridSize = Math.max(1, Math.ceil(sizeRatio * 4));

            return (
              <Box
                key={company.symbol}
                bgcolor={getChangeColor(company.change)}
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize={boxSize > 60 ? "0.9rem" : "0.7rem"}
                fontWeight="bold"
                borderRadius="4px"
                textAlign="center"
                sx={{
                  gridColumn: `span ${gridSize}`,
                  gridRow: `span ${gridSize}`,
                }}
              >
                {company.symbol}
                <br />
                {company.change > 0 ? "+" : ""}
                {company.change}%
              </Box>
            );
          })}
        </Box>
      )}
      <ChangeRateLegend />
    </Box>
  );
}

export default StockHeatmap;
