package com.finsight.lab.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.service.FMPService;
import com.finsight.lab.util.MyBatisUtils;
import com.finsight.lab.util.RSIUtil;

import jakarta.inject.Inject;

@Service
public class TechnicalAnalysisService {

	private static final Logger logger = LoggerFactory.getLogger(TechnicalAnalysisService.class);
	@Inject
	private SqlSession sqlSession;

	@Autowired
	private FMPService fmpService;

	private static final String NAMESPACE = "TechnicalAnalysis.";

	public List<Map<String, Object>> selectTickers(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "selectTickers", param);
	}

	public Map<String, Object> generateRSIData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		SqlSession batchSession = MyBatisUtils.getBatchSession();
		int counter = 0;
		String symbol = (String) param.get("symbol");

		try {
			fmpService.fetchHistoricalData(param);
			sqlSession.delete(NAMESPACE + "deleteRSIHistory", param);
			// Fetch closing prices and trade dates in DESC order
			List<Map<String, Object>> priceData = sqlSession.selectList(NAMESPACE + "getClosePrices", param);

			if (priceData.size() < 15) {
				throw new IllegalArgumentException("Not enough data to calculate RSI for " + symbol);
			}

			// Convert data to lists
			List<Double> closePrices = new ArrayList<>();
			List<String> tradeDates = new ArrayList<>();

			for (Map<String, Object> row : priceData) {
				closePrices.add(((BigDecimal) row.get("CLOSE_PRICE")).doubleValue());
				tradeDates.add((String) row.get("DATE")); // Ensure this is using the correct column name
			}

			// Calculate RSI for every date that has 14 prior days of records
			for (int i = 0; i < closePrices.size() - 14; i++) { // 마지막까지 계산 가능하도록 범위 조정
				List<Double> subList = new ArrayList<>(closePrices.subList(i, i + 15)); // ✅ 15개 데이터 추출
				double rsi = RSIUtil.calculateRSI(subList, 14); // ✅ 14일 기간 RSI 계산

				Map<String, Object> rsiData = Map.of("symbol", symbol, "trade_date", tradeDates.get(i), "rsi", rsi);

				counter = MyBatisUtils.batchUpdateWithThreshold(batchSession, NAMESPACE + "batchUpsertRSIHistory",
						rsiData, 500, counter);
			}

			// Flush remaining batch updates
			MyBatisUtils.flushBatch(batchSession);
			result.put("STATUS", ResponseCode.SUCCESS);

		} catch (Exception e) {
			MyBatisUtils.handleExceptionAndClose(batchSession, e);
		} finally {
			MyBatisUtils.closeSession(batchSession);
		}

		return result;
	}
	
	public Map<String, Object> analyzeRSIData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		String symbol = (String) param.get("symbol");

		try {
			// Fetch closing prices and trade dates in DESC order
			List<Map<String, Object>> priceData = sqlSession.selectList(NAMESPACE + "getClosePrices", param);
			
			result.put("STATUS", ResponseCode.SUCCESS);
		} catch (Exception e) {
			
		}

		return result;
	}
}
