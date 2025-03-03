package com.finsight.lab.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.finsight.lab.util.MyBatisUtils;
import com.finsight.lab.util.RSIUtil;

import jakarta.inject.Inject;

@Service
public class StockStatisticsService {

	private static final Logger logger = LoggerFactory.getLogger(StockStatisticsService.class);
	private static final String NAMESPACE = "StockStatistics.";

	@Inject
	private SqlSession sqlSession;

	public void updateAllRSI() {
		logger.info("Starting batch RSI calculation for all stocks...");

		// 1. 모든 심볼 가져오기
		List<String> symbols = sqlSession.selectList(NAMESPACE + "getAllSymbols");

		SqlSession batchSession = MyBatisUtils.getBatchSession();
		int counter = 0;

		try {
			for (String symbol : symbols) {
				List<Map<String, Object>> priceData = sqlSession.selectList(NAMESPACE + "getStockPrices", symbol);

				// BigDecimal -> double 변환
				List<Double> closePrices = priceData.stream()
						.map(row -> ((BigDecimal) row.get("CLOSE_PRICE")).doubleValue()).toList();

				if (closePrices.size() >= 15) {
					// 2. RSI 계산
					double rsi = RSIUtil.calculateRSI(closePrices, 14);
					logger.info("RSI for {}: {}", symbol, rsi);

					// 3. 개별 배치 UPDATE 수행
					Map<String, Object> rsiData = Map.of("symbol", symbol, "rsi", rsi);
					counter = MyBatisUtils.batchUpdateWithThreshold(batchSession, NAMESPACE + "batchUpsertRSI", rsiData,
							500, counter);
				}
			}

			// 4. 남은 배치 커밋
			MyBatisUtils.flushBatch(batchSession);
			logger.info("Batch RSI update completed for {} stocks.", symbols.size());

		} catch (Exception e) {
			MyBatisUtils.handleExceptionAndClose(batchSession, e);
		} finally {
			MyBatisUtils.closeSession(batchSession);
		}
	}

	public void updateRSIForSymbol(String symbol) {
		logger.info("Updating RSI for symbol: {}", symbol);

		try {
			// 1. 해당 심볼의 최근 15개 종가 가져오기
			List<Map<String, Object>> priceData = sqlSession.selectList(NAMESPACE + "getStockPrices", symbol);

			// 2. BigDecimal → double 변환
			List<Double> closePrices = priceData.stream()
					.map(row -> ((BigDecimal) row.get("CLOSE_PRICE")).doubleValue()).toList();

			if (closePrices.size() >= 15) {
				// 3. RSI 계산
				double rsi = RSIUtil.calculateRSI(closePrices, 14);
				logger.info("Computed RSI for {}: {}", symbol, rsi);

				// 4. 단일 UPDATE 실행 (배치 X)
				Map<String, Object> rsiData = Map.of("symbol", symbol, "rsi", rsi);
				sqlSession.update(NAMESPACE + "batchUpsertRSI", rsiData);

				logger.info("RSI update completed for symbol: {}", symbol);
			} else {
				logger.warn("Insufficient data for RSI calculation for symbol: {}", symbol);
			}
		} catch (Exception e) {
			logger.error("Error updating RSI for symbol: {}", symbol, e);
		}
	}

}
