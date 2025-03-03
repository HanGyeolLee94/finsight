package com.finsight.lab.service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.util.MyBatisUtils;

import jakarta.inject.Inject;

@Service
public class FMPService {

	private static final Logger logger = LoggerFactory.getLogger(FMPService.class);

	@Value("${fmp.api.base-url}")
	private String baseUrl;

	@Value("${fmp.api.key}")
	private String apiKey;

	@Inject
	private SqlSession sqlSession;

	private static final String NAMESPACE = "FMP.";

	// Helper method to build URLs with API key
	private String buildUrl(String endpoint) {
		return baseUrl + endpoint + "?apikey=" + apiKey;
	}

	private String buildUrl(String endpoint, Map<String, Object> queryParams) {
		StringBuilder urlBuilder = new StringBuilder(baseUrl)
	            .append(endpoint)
	            .append("?apikey=")
	            .append(apiKey);
		if (queryParams != null && !queryParams.isEmpty()) {
	        queryParams.forEach((key, value) -> {
	            if (!"symbol".equals(key)) { // symbol 키 제외
	                urlBuilder.append("&").append(key).append("=").append(value);
	            }
	        });
	    }
	    return urlBuilder.toString();
	}

	// Fetch stock list from FMP API and store in the database
	public Map<String, Object> fetchStockList() {
		Map<String, Object> result = new HashMap<>();
		RestTemplate restTemplate = new RestTemplate();

		String url = buildUrl("/api/v3/stock/list");
		SqlSession batchSession = MyBatisUtils.getBatchSession();
		int counter = 0;
		// Open a batch session
		try {
			String response = restTemplate.getForObject(url, String.class);
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode stockList = objectMapper.readTree(response);

			for (JsonNode stock : stockList) {
				Map<String, Object> stockData = new HashMap<>();
				stockData.put("SYMBOL", stock.get("symbol").asText());
				stockData.put("NAME", stock.get("name").asText());
				stockData.put("EXCHANGE", stock.get("exchange").asText());
				stockData.put("EXCHANGE_SHORT_NAME", stock.get("exchangeShortName").asText());
				stockData.put("TYPE", stock.get("type").asText());

				counter = MyBatisUtils.batchUpdateWithThreshold(batchSession, NAMESPACE + "upsertStock",
						stockData, 2000, counter);
			}

			// Flush and commit batch session
			MyBatisUtils.flushBatch(batchSession);
			result.put("STATUS", ResponseCode.SUCCESS);
		} catch (Exception e) {
			logger.error("Error fetching or storing stock data from FMP", e);
			result.put("STATUS", ResponseCode.ERROR);
		} finally {
			MyBatisUtils.closeSession(batchSession);
		}

		return result;
	}

	public Map<String, Object> fetchCompanyProfile(String symbol) {
		Map<String, Object> result = new HashMap<>();
		RestTemplate restTemplate = new RestTemplate();

		String url = buildUrl("/api/v3/profile/" + symbol);
		SqlSession batchSession = MyBatisUtils.getBatchSession();

		try {
			String response = restTemplate.getForObject(url, String.class);
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode profile = objectMapper.readTree(response).get(0); // Assuming a single object in the array

			if (profile != null) {
				Map<String, Object> profileData = new HashMap<>();
				profileData.put("SYMBOL", profile.get("symbol").asText());
				profileData.put("PRICE", profile.get("price").asDouble());
				profileData.put("BETA", profile.get("beta").asDouble());
				profileData.put("VOL_AVG", profile.get("volAvg").asLong());
				profileData.put("MKT_CAP", profile.get("mktCap").asLong());
				profileData.put("LAST_DIV", profile.get("lastDiv").asDouble());
				profileData.put("PRICE_RANGE", profile.get("range").asText());
				profileData.put("CHANGES", profile.get("changes").asDouble());
				profileData.put("COMPANY_NAME", profile.get("companyName").asText());
				profileData.put("CURRENCY", profile.get("currency").asText());
				profileData.put("CIK", profile.get("cik").asText());
				profileData.put("ISIN", profile.get("isin").asText());
				profileData.put("CUSIP", profile.get("cusip").asText());
				profileData.put("EXCHANGE", profile.get("exchange").asText());
				profileData.put("EXCHANGE_SHORT_NAME", profile.get("exchangeShortName").asText());
				profileData.put("INDUSTRY", profile.get("industry").asText());
				profileData.put("WEBSITE", profile.get("website").asText());
				profileData.put("DESCRIPTION", profile.get("description").asText());
				profileData.put("CEO", profile.get("ceo").asText());
				profileData.put("SECTOR", profile.get("sector").asText());
				profileData.put("COUNTRY", profile.get("country").asText());
				profileData.put("FULL_TIME_EMPLOYEES", profile.get("fullTimeEmployees").asText());
				profileData.put("PHONE", profile.get("phone").asText());
				profileData.put("ADDRESS", profile.get("address").asText());
				profileData.put("CITY", profile.get("city").asText());
				profileData.put("STATE", profile.get("state").asText());
				profileData.put("ZIP", profile.get("zip").asText());
				profileData.put("DCF_DIFF", profile.get("dcfDiff").asDouble());
				profileData.put("DCF", profile.get("dcf").asDouble());
				profileData.put("IMAGE", profile.get("image").asText());
				profileData.put("IPO_DATE", profile.get("ipoDate").asText());
				profileData.put("DEFAULT_IMAGE", profile.get("defaultImage").asBoolean());
				profileData.put("IS_ETF", profile.get("isEtf").asBoolean());
				profileData.put("IS_ACTIVELY_TRADING", profile.get("isActivelyTrading").asBoolean());
				profileData.put("IS_ADR", profile.get("isAdr").asBoolean());
				profileData.put("IS_FUND", profile.get("isFund").asBoolean());

				batchSession.update(NAMESPACE + "upsertCompanyProfile", profileData);
			}

			// Flush and commit batch session
			MyBatisUtils.flushBatch(batchSession);
			result.put("STATUS", ResponseCode.SUCCESS);
		} catch (Exception e) {
			logger.error("Error fetching or storing company profile data for symbol: " + symbol, e);
			result.put("STATUS", ResponseCode.ERROR);
		} finally {
			MyBatisUtils.closeSession(batchSession);
		}

		return result;
	}

	public Map<String, Object> fetchHistoricalData(Map<String, Object> param) {
		// Define the API endpoint
		String symbol = (String) param.get("symbol");
		String endpoint = "/api/v3/historical-price-full/" + symbol;
		Map<String, Object> result = new HashMap<>();

		// Build the URL with query parameters
		String url = buildUrl(endpoint, param);
		SqlSession batchSession = MyBatisUtils.getBatchSession();
		int counter = 0;
		// Fetch data from API
		RestTemplate restTemplate = new RestTemplate();
		Map<String, Object> response = restTemplate.getForObject(url, Map.class);

		// Process and store data if present
		if (response != null && response.containsKey("historical")) {

			try {
				List<Map<String, Object>> historicalData = (List<Map<String, Object>>) response.get("historical");

				for (Map<String, Object> data : historicalData) {
					Map<String, Object> paramMap = new HashMap<>();
					paramMap.put("SYMBOL", symbol);
					paramMap.put("DATE", data.get("date"));
					paramMap.put("OPEN_PRICE", data.get("open"));
					paramMap.put("HIGH_PRICE", data.get("high"));
					paramMap.put("LOW_PRICE", data.get("low"));
					paramMap.put("CLOSE_PRICE", data.get("close"));
					paramMap.put("ADJ_CLOSE", data.get("adjClose"));
					paramMap.put("VOLUME", data.get("volume"));
					paramMap.put("UNADJUSTED_VOLUME", data.get("unadjustedVolume"));
					paramMap.put("PRICE_CHANGE", data.get("change"));
					paramMap.put("CHANGE_PERCENT", data.get("changePercent"));
					paramMap.put("VWAP", data.get("vwap"));
					paramMap.put("LABEL", data.get("label"));
					paramMap.put("CHANGE_OVER_TIME", data.get("changeOverTime"));

					// Use batch update with threshold
					counter = MyBatisUtils.batchUpdateWithThreshold(batchSession, NAMESPACE + "upsertHistoricalData",
							paramMap, 500, counter);
				}
				// Flush and commit batch session
				MyBatisUtils.flushBatch(batchSession);
				result.put("STATUS", ResponseCode.SUCCESS);
			} catch (Exception e) {
				logger.error("Error fetching or storing company profile data for symbol: " + symbol, e);
				result.put("STATUS", ResponseCode.ERROR);
			} finally {
				MyBatisUtils.closeSession(batchSession);
			}

		}
		return result; // Returning the API response for client reference
	}

	public Map<String, Object> fetchQuote(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		// Define the API endpoint
		String symbol = (String) param.get("symbol");
		String endpoint = "/api/v3/quote/" + symbol;
		RestTemplate restTemplate = new RestTemplate();
		String url = buildUrl(endpoint);

		SqlSession batchSession = MyBatisUtils.getBatchSession();
		try {
			String response = restTemplate.getForObject(url, String.class);
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode quoteData = objectMapper.readTree(response).get(0);

			if (quoteData != null) {
				Map<String, Object> data = new HashMap<>();
				data.put("SYMBOL", quoteData.get("symbol").asText());
				data.put("NAME", quoteData.get("name").asText());
				data.put("PRICE", quoteData.get("price").asDouble());
				data.put("CHANGES_PERCENTAGE", quoteData.get("changesPercentage").asDouble());
				data.put("CHANGE_VALUE", quoteData.get("change").asDouble());
				data.put("DAY_LOW", quoteData.get("dayLow").asDouble());
				data.put("DAY_HIGH", quoteData.get("dayHigh").asDouble());
				data.put("YEAR_HIGH", quoteData.get("yearHigh").asDouble());
				data.put("YEAR_LOW", quoteData.get("yearLow").asDouble());
				data.put("MARKET_CAP", quoteData.get("marketCap").asLong());
				data.put("PRICE_AVG_50", quoteData.get("priceAvg50").asDouble());
				data.put("PRICE_AVG_200", quoteData.get("priceAvg200").asDouble());
				data.put("EXCHANGE", quoteData.get("exchange").asText());
				data.put("VOLUME", quoteData.get("volume").asLong());
				data.put("AVG_VOLUME", quoteData.get("avgVolume").asLong());
				data.put("OPEN_PRICE", quoteData.get("open").asDouble());
				data.put("PREVIOUS_CLOSE", quoteData.get("previousClose").asDouble());
				data.put("EPS", quoteData.get("eps").asDouble());
				data.put("PE", quoteData.get("pe").asDouble());
				 // Convert the earnings announcement date to MariaDB-compatible format
                String earningsAnnouncement = quoteData.get("earningsAnnouncement").asText();
                data.put("EARNINGS_ANNOUNCEMENT", convertToDateTimeFormat(earningsAnnouncement));
				data.put("SHARES_OUTSTANDING", quoteData.get("sharesOutstanding").asLong());
				data.put("TIMESTAMP", quoteData.get("timestamp").asLong());

				batchSession.update(NAMESPACE + "upsertQuoteData", data);
			}

			MyBatisUtils.flushBatch(batchSession);
			result.put("STATUS", ResponseCode.SUCCESS);
		} catch (Exception e) {
			logger.error("Error fetching or storing quote data", e);
			result.put("STATUS", ResponseCode.ERROR);
		} finally {
			MyBatisUtils.closeSession(batchSession);
		}

		return result;
	}
	
	public static String convertToDateTimeFormat(String isoDate) {
        try {
            // Parse the ISO 8601 date format
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(isoDate, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ"));
            
            // Convert to LocalDateTime and format as required for MariaDB
            LocalDateTime localDateTime = zonedDateTime.toLocalDateTime();
            return localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } catch (Exception e) {
            e.printStackTrace();
            return null; // or handle the error as needed
        }
    }
	
	public Map<String, Object> fetchHistoricalMarketCap(Map<String, Object> param) {
        String symbol = (String) param.get("symbol");
        String endpoint = "/api/v3/historical-market-capitalization/" + symbol;
        Map<String, Object> result = new HashMap<>();
        int counter = 0;
        // Build the URL with query parameters
        String url = buildUrl(endpoint, param);
        SqlSession batchSession = MyBatisUtils.getBatchSession();

        try {
            RestTemplate restTemplate = new RestTemplate();
            List<Map<String, Object>> marketCapData = restTemplate.getForObject(url, List.class);

            for (Map<String, Object> data : marketCapData) {
                Map<String, Object> paramMap = new HashMap<>();
                paramMap.put("SYMBOL", symbol);
                paramMap.put("DATE", data.get("date"));
                paramMap.put("MARKET_CAP", data.get("marketCap"));

                counter = MyBatisUtils.batchUpdateWithThreshold(batchSession, NAMESPACE + "upsertHistoricalMarketCap",
						paramMap, 500, counter);
            }

            MyBatisUtils.flushBatch(batchSession);
            result.put("STATUS", ResponseCode.SUCCESS);
        } catch (Exception e) {
            logger.error("Error fetching or storing historical market cap data for symbol: " + symbol, e);
            result.put("STATUS", ResponseCode.ERROR);
        } finally {
            MyBatisUtils.closeSession(batchSession);
        }

        return result;
    }
	
	public Map<String, Object> fetchIncomeStatement(Map<String, Object> param) {
	    Map<String, Object> result = new HashMap<>();
	    RestTemplate restTemplate = new RestTemplate();

	    String symbol = (String) param.get("symbol");
	    String endpoint = "/api/v3/income-statement/" + symbol;
	    String url = buildUrl(endpoint, param);
	    
	    SqlSession batchSession = MyBatisUtils.getBatchSession();

	    try {
	        String response = restTemplate.getForObject(url, String.class);
	        ObjectMapper objectMapper = new ObjectMapper();
	        JsonNode incomeStatements = objectMapper.readTree(response);

	        for (JsonNode incomeStatement : incomeStatements) {
	            Map<String, Object> incomeData = new HashMap<>();
	            incomeData.put("SYMBOL", symbol);
	            incomeData.put("FILLING_DATE", incomeStatement.get("fillingDate").asText());
	            incomeData.put("DATE", incomeStatement.get("date").asText());
	            incomeData.put("REPORTED_CURRENCY", incomeStatement.get("reportedCurrency").asText());
	            incomeData.put("CIK", incomeStatement.get("cik").asText());
	            incomeData.put("ACCEPTED_DATE", incomeStatement.get("acceptedDate").asText());
	            incomeData.put("CALENDAR_YEAR", incomeStatement.get("calendarYear").asText());
	            incomeData.put("PERIOD", incomeStatement.get("period").asText());
	            incomeData.put("REVENUE", incomeStatement.get("revenue").asLong());
	            incomeData.put("COST_OF_REVENUE", incomeStatement.get("costOfRevenue").asLong());
	            incomeData.put("GROSS_PROFIT", incomeStatement.get("grossProfit").asLong());
	            incomeData.put("GROSS_PROFIT_RATIO", incomeStatement.get("grossProfitRatio").asDouble());
	            incomeData.put("RESEARCH_AND_DEVELOPMENT_EXPENSES", incomeStatement.get("researchAndDevelopmentExpenses").asLong());
	            incomeData.put("GENERAL_AND_ADMINISTRATIVE_EXPENSES", incomeStatement.get("generalAndAdministrativeExpenses").asLong());
	            incomeData.put("SELLING_AND_MARKETING_EXPENSES", incomeStatement.get("sellingAndMarketingExpenses").asLong());
	            incomeData.put("SELLING_GENERAL_AND_ADMINISTRATIVE_EXPENSES", incomeStatement.get("sellingGeneralAndAdministrativeExpenses").asLong());
	            incomeData.put("OTHER_EXPENSES", incomeStatement.get("otherExpenses").asLong());
	            incomeData.put("OPERATING_EXPENSES", incomeStatement.get("operatingExpenses").asLong());
	            incomeData.put("COST_AND_EXPENSES", incomeStatement.get("costAndExpenses").asLong());
	            incomeData.put("INTEREST_INCOME", incomeStatement.get("interestIncome").asLong());
	            incomeData.put("INTEREST_EXPENSE", incomeStatement.get("interestExpense").asLong());
	            incomeData.put("DEPRECIATION_AND_AMORTIZATION", incomeStatement.get("depreciationAndAmortization").asLong());
	            incomeData.put("EBITDA", incomeStatement.get("ebitda").asLong());
	            incomeData.put("EBITDARATIO", incomeStatement.get("ebitdaratio").asDouble());
	            incomeData.put("OPERATING_INCOME", incomeStatement.get("operatingIncome").asLong());
	            incomeData.put("OPERATING_INCOME_RATIO", incomeStatement.get("operatingIncomeRatio").asDouble());
	            incomeData.put("TOTAL_OTHER_INCOME_EXPENSES_NET", incomeStatement.get("totalOtherIncomeExpensesNet").asLong());
	            incomeData.put("INCOME_BEFORE_TAX", incomeStatement.get("incomeBeforeTax").asLong());
	            incomeData.put("INCOME_BEFORE_TAX_RATIO", incomeStatement.get("incomeBeforeTaxRatio").asDouble());
	            incomeData.put("INCOME_TAX_EXPENSE", incomeStatement.get("incomeTaxExpense").asLong());
	            incomeData.put("NET_INCOME", incomeStatement.get("netIncome").asLong());
	            incomeData.put("NET_INCOME_RATIO", incomeStatement.get("netIncomeRatio").asDouble());
	            incomeData.put("EPS", incomeStatement.get("eps").asDouble());
	            incomeData.put("EPS_DILUTED", incomeStatement.get("epsdiluted").asDouble());
	            incomeData.put("WEIGHTED_AVERAGE_SHS_OUT", incomeStatement.get("weightedAverageShsOut").asLong());
	            incomeData.put("WEIGHTED_AVERAGE_SHS_OUT_DIL", incomeStatement.get("weightedAverageShsOutDil").asLong());
	            incomeData.put("LINK", incomeStatement.get("link").asText());
	            incomeData.put("FINAL_LINK", incomeStatement.get("finalLink").asText());

	            batchSession.update(NAMESPACE + "upsertIncomeStatement", incomeData);
	        }

	        MyBatisUtils.flushBatch(batchSession);
	        result.put("STATUS", ResponseCode.SUCCESS);
	    } catch (Exception e) {
	        logger.error("Error fetching or storing income statement for symbol: " + symbol, e);
	        result.put("STATUS", ResponseCode.ERROR);
	    } finally {
	        MyBatisUtils.closeSession(batchSession);
	    }

	    return result;
	}
	
	 public Map<String, Object> fetchBalanceSheet(Map<String, Object> param) {
	        String symbol = (String)param.get("symbol");
	        String endpoint = "/api/v3/balance-sheet-statement/" + symbol;
	        Map<String, Object> result = new HashMap<>();
	        SqlSession batchSession = MyBatisUtils.getBatchSession();

	        try {
	            // Fetch data from API
	            String url = buildUrl(endpoint, param);
	            RestTemplate restTemplate = new RestTemplate();
	            String response = restTemplate.getForObject(url, String.class);

	            ObjectMapper objectMapper = new ObjectMapper();
	            JsonNode balanceSheets = objectMapper.readTree(response);

	            for (JsonNode balanceSheet : balanceSheets) {
	                Map<String, Object> data = new HashMap<>();
	                data.put("SYMBOL", symbol);
	                data.put("CALENDAR_YEAR", balanceSheet.get("calendarYear").asText());
	                data.put("PERIOD", balanceSheet.get("period").asText());
	                data.put("FILLING_DATE", balanceSheet.get("fillingDate").asText());
	                data.put("ACCEPTED_DATE", balanceSheet.get("acceptedDate").asText());
	                data.put("REPORTED_CURRENCY", balanceSheet.get("reportedCurrency").asText());
	                data.put("CASH_AND_CASH_EQUIVALENTS", balanceSheet.get("cashAndCashEquivalents").asLong());
	                data.put("SHORT_TERM_INVESTMENTS", balanceSheet.get("shortTermInvestments").asLong());
	                data.put("CASH_AND_SHORT_TERM_INVESTMENTS", balanceSheet.get("cashAndShortTermInvestments").asLong());
	                data.put("NET_RECEIVABLES", balanceSheet.get("netReceivables").asLong());
	                data.put("INVENTORY", balanceSheet.get("inventory").asLong());
	                data.put("OTHER_CURRENT_ASSETS", balanceSheet.get("otherCurrentAssets").asLong());
	                data.put("TOTAL_CURRENT_ASSETS", balanceSheet.get("totalCurrentAssets").asLong());
	                data.put("PROPERTY_PLANT_EQUIPMENT_NET", balanceSheet.get("propertyPlantEquipmentNet").asLong());
	                data.put("GOODWILL", balanceSheet.get("goodwill").asLong());
	                data.put("INTANGIBLE_ASSETS", balanceSheet.get("intangibleAssets").asLong());
	                data.put("GOODWILL_AND_INTANGIBLE_ASSETS", balanceSheet.get("goodwillAndIntangibleAssets").asLong());
	                data.put("LONG_TERM_INVESTMENTS", balanceSheet.get("longTermInvestments").asLong());
	                data.put("TAX_ASSETS", balanceSheet.get("taxAssets").asLong());
	                data.put("OTHER_NON_CURRENT_ASSETS", balanceSheet.get("otherNonCurrentAssets").asLong());
	                data.put("TOTAL_NON_CURRENT_ASSETS", balanceSheet.get("totalNonCurrentAssets").asLong());
	                data.put("OTHER_ASSETS", balanceSheet.get("otherAssets").asLong());
	                data.put("TOTAL_ASSETS", balanceSheet.get("totalAssets").asLong());
	                data.put("ACCOUNT_PAYABLES", balanceSheet.get("accountPayables").asLong());
	                data.put("SHORT_TERM_DEBT", balanceSheet.get("shortTermDebt").asLong());
	                data.put("TAX_PAYABLES", balanceSheet.get("taxPayables").asLong());
	                data.put("DEFERRED_REVENUE", balanceSheet.get("deferredRevenue").asLong());
	                data.put("OTHER_CURRENT_LIABILITIES", balanceSheet.get("otherCurrentLiabilities").asLong());
	                data.put("TOTAL_CURRENT_LIABILITIES", balanceSheet.get("totalCurrentLiabilities").asLong());
	                data.put("LONG_TERM_DEBT", balanceSheet.get("longTermDebt").asLong());
	                data.put("DEFERRED_REVENUE_NON_CURRENT", balanceSheet.get("deferredRevenueNonCurrent").asLong());
	                data.put("DEFERRED_TAX_LIABILITIES_NON_CURRENT", balanceSheet.get("deferredTaxLiabilitiesNonCurrent").asLong());
	                data.put("OTHER_NON_CURRENT_LIABILITIES", balanceSheet.get("otherNonCurrentLiabilities").asLong());
	                data.put("TOTAL_NON_CURRENT_LIABILITIES", balanceSheet.get("totalNonCurrentLiabilities").asLong());
	                data.put("OTHER_LIABILITIES", balanceSheet.get("otherLiabilities").asLong());
	                data.put("CAPITAL_LEASE_OBLIGATIONS", balanceSheet.get("capitalLeaseObligations").asLong());
	                data.put("TOTAL_LIABILITIES", balanceSheet.get("totalLiabilities").asLong());
	                data.put("PREFERRED_STOCK", balanceSheet.get("preferredStock").asLong());
	                data.put("COMMON_STOCK", balanceSheet.get("commonStock").asLong());
	                data.put("RETAINED_EARNINGS", balanceSheet.get("retainedEarnings").asLong());
	                data.put("ACCUMULATED_OTHER_COMPREHENSIVE_INCOME_LOSS", balanceSheet.get("accumulatedOtherComprehensiveIncomeLoss").asLong());
	                data.put("OTHER_TOTAL_STOCKHOLDERS_EQUITY", balanceSheet.get("othertotalStockholdersEquity").asLong());
	                data.put("TOTAL_STOCKHOLDERS_EQUITY", balanceSheet.get("totalStockholdersEquity").asLong());
	                data.put("TOTAL_EQUITY", balanceSheet.get("totalEquity").asLong());
	                data.put("TOTAL_LIABILITIES_AND_STOCKHOLDERS_EQUITY", balanceSheet.get("totalLiabilitiesAndStockholdersEquity").asLong());
	                data.put("MINORITY_INTEREST", balanceSheet.get("minorityInterest").asLong());
	                data.put("TOTAL_LIABILITIES_AND_TOTAL_EQUITY", balanceSheet.get("totalLiabilitiesAndTotalEquity").asLong());
	                data.put("TOTAL_INVESTMENTS", balanceSheet.get("totalInvestments").asLong());
	                data.put("TOTAL_DEBT", balanceSheet.get("totalDebt").asLong());
	                data.put("NET_DEBT", balanceSheet.get("netDebt").asLong());
	                data.put("LINK", balanceSheet.get("link").asText());
	                data.put("FINAL_LINK", balanceSheet.get("finalLink").asText());

	                batchSession.update(NAMESPACE + "upsertBalanceSheet", data);
	            }

	            MyBatisUtils.flushBatch(batchSession);
	            result.put("STATUS", ResponseCode.SUCCESS);
	        } catch (Exception e) {
	            logger.error("Error fetching or storing balance sheet for symbol: " + symbol, e);
	            result.put("STATUS", ResponseCode.ERROR);
	        } finally {
	            MyBatisUtils.closeSession(batchSession);
	        }

	        return result;
	    }
	 public Map<String, Object> fetchCashFlowStatement(Map<String, Object> param) {
	        Map<String, Object> result = new HashMap<>();
	        String symbol = (String) param.get("symbol");

	        String endpoint = "/api/v3/cash-flow-statement/" + symbol;
	        String url = buildUrl(endpoint, param);

	        RestTemplate restTemplate = new RestTemplate();
	        SqlSession batchSession = MyBatisUtils.getBatchSession();

	        try {
	            String response = restTemplate.getForObject(url, String.class);
	            ObjectMapper objectMapper = new ObjectMapper();
	            JsonNode cashFlowStatements = objectMapper.readTree(response);

	            for (JsonNode cashFlow : cashFlowStatements) {
	                Map<String, Object> data = new HashMap<>();
	                data.put("SYMBOL", symbol);
	                data.put("DATE", cashFlow.get("date").asText());
	                data.put("REPORTED_CURRENCY", cashFlow.get("reportedCurrency").asText());
	                data.put("CIK", cashFlow.get("cik").asText());
	                data.put("FILLING_DATE", cashFlow.get("fillingDate").asText());
	                data.put("ACCEPTED_DATE", cashFlow.get("acceptedDate").asText());
	                data.put("CALENDAR_YEAR", cashFlow.get("calendarYear").asText());
	                data.put("PERIOD", cashFlow.get("period").asText());
	                data.put("NET_INCOME", cashFlow.get("netIncome").asLong());
	                data.put("DEPRECIATION_AND_AMORTIZATION", cashFlow.get("depreciationAndAmortization").asLong());
	                data.put("DEFERRED_INCOME_TAX", cashFlow.get("deferredIncomeTax").asLong());
	                data.put("STOCK_BASED_COMPENSATION", cashFlow.get("stockBasedCompensation").asLong());
	                data.put("CHANGE_IN_WORKING_CAPITAL", cashFlow.get("changeInWorkingCapital").asLong());
	                data.put("ACCOUNTS_RECEIVABLES", cashFlow.get("accountsReceivables").asLong());
	                data.put("INVENTORY", cashFlow.get("inventory").asLong());
	                data.put("ACCOUNTS_PAYABLES", cashFlow.get("accountsPayables").asLong());
	                data.put("OTHER_WORKING_CAPITAL", cashFlow.get("otherWorkingCapital").asLong());
	                data.put("OTHER_NON_CASH_ITEMS", cashFlow.get("otherNonCashItems").asLong());
	                data.put("NET_CASH_PROVIDED_BY_OPERATING_ACTIVITIES", cashFlow.get("netCashProvidedByOperatingActivities").asLong());
	                data.put("INVESTMENTS_IN_PROPERTY_PLANT_AND_EQUIPMENT", cashFlow.get("investmentsInPropertyPlantAndEquipment").asLong());
	                data.put("ACQUISITIONS_NET", cashFlow.get("acquisitionsNet").asLong());
	                data.put("PURCHASES_OF_INVESTMENTS", cashFlow.get("purchasesOfInvestments").asLong());
	                data.put("SALES_MATURITIES_OF_INVESTMENTS", cashFlow.get("salesMaturitiesOfInvestments").asLong());
	                data.put("OTHER_INVESTING_ACTIVITIES", cashFlow.get("otherInvestingActivites").asLong());
	                data.put("NET_CASH_USED_FOR_INVESTING_ACTIVITIES", cashFlow.get("netCashUsedForInvestingActivites").asLong());
	                data.put("DEBT_REPAYMENT", cashFlow.get("debtRepayment").asLong());
	                data.put("COMMON_STOCK_ISSUED", cashFlow.get("commonStockIssued").asLong());
	                data.put("COMMON_STOCK_REPURCHASED", cashFlow.get("commonStockRepurchased").asLong());
	                data.put("DIVIDENDS_PAID", cashFlow.get("dividendsPaid").asLong());
	                data.put("OTHER_FINANCING_ACTIVITIES", cashFlow.get("otherFinancingActivites").asLong());
	                data.put("NET_CASH_USED_PROVIDED_BY_FINANCING_ACTIVITIES", cashFlow.get("netCashUsedProvidedByFinancingActivities").asLong());
	                data.put("EFFECT_OF_FOREX_CHANGES_ON_CASH", cashFlow.get("effectOfForexChangesOnCash").asLong());
	                data.put("NET_CHANGE_IN_CASH", cashFlow.get("netChangeInCash").asLong());
	                data.put("CASH_AT_END_OF_PERIOD", cashFlow.get("cashAtEndOfPeriod").asLong());
	                data.put("CASH_AT_BEGINNING_OF_PERIOD", cashFlow.get("cashAtBeginningOfPeriod").asLong());
	                data.put("OPERATING_CASH_FLOW", cashFlow.get("operatingCashFlow").asLong());
	                data.put("CAPITAL_EXPENDITURE", cashFlow.get("capitalExpenditure").asLong());
	                data.put("FREE_CASH_FLOW", cashFlow.get("freeCashFlow").asLong());
	                data.put("LINK", cashFlow.get("link").asText());
	                data.put("FINAL_LINK", cashFlow.get("finalLink").asText());

	                batchSession.update(NAMESPACE + "upsertCashFlowStatement", data);
	            }

	            MyBatisUtils.flushBatch(batchSession);
	            result.put("STATUS", "SUCCESS");
	        } catch (Exception e) {
	            logger.error("Error fetching or storing cash flow statement for symbol: " + symbol, e);
	            result.put("STATUS", "ERROR");
	        } finally {
	            MyBatisUtils.closeSession(batchSession);
	        }

	        return result;
	    }
	 
}
