package com.finsight.lab.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.service.QuoteService;

import jakarta.inject.Inject;

@Service
public class DashboardService {

	private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

	@Inject
	private QuoteService quoteService;

	// private static final String NAMESPACE = "Quote.";

	public Map<String, Object> getHeatMapData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		try {
			result.put("heatMapData", quoteService.getHeatMapData(param));
		} catch (Exception e) {
			logger.error("Error retrieving dashboard data: {}", e.getMessage());
			result.put("STATUS", ResponseCode.ERROR);
			result.put("MESSAGE", "Failed to retrieve dashboard data.");
		}

		return result;
	}
	
	public Map<String, Object> getDashboardData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();

		try {
			// Fetch top gainers, top losers, and S&P 500 data
			result.put("topGainers", quoteService.getTopGainerData(param));
			result.put("topLosers", quoteService.getTopLoserData(param));
			result.put("snp500", quoteService.getSnp500Data(param));

			// Create specific parameters for each index
			Map<String, Object> snp500Param = new HashMap<>(param);
			snp500Param.put("INDEX_CODE", "SNP500");
			snp500Param.put("LIMIT", 30);

			Map<String, Object> nasdaqParam = new HashMap<>(param);
			nasdaqParam.put("INDEX_CODE", "NASDAQ");
			nasdaqParam.put("LIMIT", 30);

			Map<String, Object> dowJonesParam = new HashMap<>(param);
			dowJonesParam.put("INDEX_CODE", "DJI");
			dowJonesParam.put("LIMIT", 30);

			// Transform and add index data to the result
			result.put("snp500Index", transformIndexData("S&P 500", quoteService.getIndexData(snp500Param)));
			result.put("nasdaqIndex", transformIndexData("Nasdaq", quoteService.getIndexData(nasdaqParam)));
			result.put("dowJonesIndex", transformIndexData("Dow Jones", quoteService.getIndexData(dowJonesParam)));

			result.put("snp500_sector_company_count", quoteService.getSnp500SectorCompanyCount());

		} catch (Exception e) {
			logger.error("Error retrieving dashboard data: {}", e.getMessage());
			result.put("STATUS", ResponseCode.ERROR);
			result.put("MESSAGE", "Failed to retrieve dashboard data.");
		}

		return result;
	}

	private Map<String, Object> transformIndexData(String title, List<Map<String, Object>> rawData) {
		Map<String, Object> formattedData = new HashMap<>();

		// Extract xAxisData and values
		List<String> xAxisData = rawData.stream().map(record -> record.get("DATE").toString())
				.collect(Collectors.toList());

		List<Double> values = rawData.stream().map(record -> ((Number) record.get("CLOSE_VALUE")).doubleValue())
				.collect(Collectors.toList());

		String trend = calculateTrend(values);
		String trendValue = calculateTrendValue(values);

		// Add data to formattedData map
		formattedData.put("title", title);
		formattedData.put("value",
				rawData.isEmpty() ? "N/A" : rawData.get(rawData.size() - 1).get("CLOSE_VALUE").toString());
		formattedData.put("trend", trend);
		formattedData.put("trend_value", trendValue);
		formattedData.put("data", Map.of("xAxisData", xAxisData, "values", values));

		return formattedData;
	}

	private String calculateTrend(List<Double> data) {
		if (data.size() < 2) // 데이터가 2개 미만이면 트렌드를 계산할 수 없음
			return "neutral";
		double recentValue = data.get(data.size() - 1); // 가장 최근 값 (마지막 값)
		double previousValue = data.get(data.size() - 2); // 최근 이전 값 (뒤에서 두 번째 값)
		return recentValue > previousValue ? "up" : recentValue < previousValue ? "down" : "neutral";
	}

	private String calculateTrendValue(List<Double> data) {
		if (data.size() < 2) // 데이터가 2개 미만이면 변화율 계산 불가
			return "0%";
		double recentValue = data.get(data.size() - 1); // 가장 최근 값 (마지막 값)
		double previousValue = data.get(data.size() - 2); // 최근 이전 값 (뒤에서 두 번째 값)
		double change = ((recentValue - previousValue) / previousValue) * 100; // 변화율 계산
		return String.format("%.2f%%", change);
	}

}
