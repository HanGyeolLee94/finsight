package com.finsight.lab.service;

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
import com.finsight.lab.service.StockStatisticsService;
import com.finsight.lab.util.DateUtil;

import jakarta.inject.Inject;

@Service
public class TickerService {

	private static final Logger logger = LoggerFactory.getLogger(TickerService.class);
	@Inject
	private SqlSession sqlSession;

	@Autowired
	private FMPService fmpService;
	
	@Autowired
	private StockStatisticsService stockStatisticsService;
	

	private static final String NAMESPACE = "Ticker.";

	public List<Map<String, Object>> selectList(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "selectList", param);
	}

	public Map<String, Object> selectOne(Map<String, Object> param) {
		return sqlSession.selectOne(NAMESPACE + "selectOne", param);
	}

	public int saveList(Map<String, Object> param) {
		// 업데이트된 행 수를 저장할 변수
		int updatedCount = 0;

		List<Map<String, Object>> updates = (List<Map<String, Object>>) param.get("update");

		// 배열 내의 각 항목에 대해 반복하며 업데이트 작업 수행
		for (Map<String, Object> updateParam : updates) {

			// 기존 데이터 존재 여부 확인
			Map<String, Object> existingData = sqlSession.selectOne(NAMESPACE + "selectExist", updateParam);

			if (existingData == null) {
				// 데이터가 없으면 INSERT 실행
				sqlSession.insert(NAMESPACE + "insertOne", updateParam);
			} else {
				// 데이터가 있으면 UPDATE 실행
				updatedCount += sqlSession.update(NAMESPACE + "updateOne", updateParam);
			}
		}

		return updatedCount; // 업데이트된 행 수 반환
	}

	public int getTotalCount(Map<String, Object> param) {
		return sqlSession.selectOne(NAMESPACE + "getTotalCount", param);
	}

	public List<Map<String, Object>> getTickerRecommendations(String query) {
		// Prepare a parameter map
		Map<String, Object> params = Map.of("query", query);
		// Query MyBatis mapper to get ticker recommendations
		return sqlSession.selectList(NAMESPACE + "getTickerRecommendations", params);
	}

	public List<Map<String, Object>> getAssetTypes() {
		return sqlSession.selectList(NAMESPACE + "selectAssetTypes");
	}

	public Map<String, Object> getClosePriceChartData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		processPeriod(param);
		result.put("closePrice", sqlSession.selectList(NAMESPACE + "getDailyClosePricesBySymbol", param));
		return result;
	}

	public Map<String, Object> getPerChartData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		processPeriod(param);
		result.put("per", sqlSession.selectList(NAMESPACE + "getDailyPerBySymbol", param));
		return result;
	}

	public Map<String, Object> getEpsChartData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		processPeriod(param);
		result.put("eps", sqlSession.selectList(NAMESPACE + "getEps", param));
		return result;
	}

	public Map<String, Object> getRatioChartData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		processPeriod(param);
		result.put("ratio", sqlSession.selectList(NAMESPACE + "getRatioChartData", param));
		return result;
	}

	public Map<String, Object> getRevenueChartData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		processPeriod(param);
		result.put("revenue", sqlSession.selectList(NAMESPACE + "getRevenueChartData", param));
		return result;
	}
	
	public Map<String, Object> getFreeCashFlowChartData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		processPeriod(param);
		result.put("freecashflow", sqlSession.selectList(NAMESPACE + "getFreeCashFlowChartData", param));
		return result;
	}
	
	public Map<String, Object> getCashFlowBreakdownChartData(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		processPeriod(param);
		result.put("cashflowbreakdown", sqlSession.selectList(NAMESPACE + "getCashFlowBreakdownChartData", param));
		return result;
	}
	
	public static void processPeriod(Map<String, Object> param) {

        // Retrieve the PERIOD value
        String period = (String) param.get("PERIOD");

        // Calculate the start date
        String startDate = DateUtil.calculateStartDate(period, null);

        // Update the map with the STARTDATE
        param.put("STARTDATE", startDate);
    }

	public Map<String, Object> updateAll(Map<String, Object> param) {

		Map<String, Object> result = new HashMap<>();
		String symbol = (String) param.get("symbol");

		try {
			List<Runnable> tasks = new ArrayList<>();
			// Add tasks with hard-copied parameters for each task
			tasks.add(() -> fmpService.fetchCompanyProfile(symbol));

			tasks.add(() -> {
				Map<String, Object> paramCopy = new HashMap<>(param); // Create a copy
				fmpService.fetchQuote(paramCopy);
			});

			tasks.add(() -> {
				Map<String, Object> paramCopy = new HashMap<>(param); // Create a copy
				fmpService.fetchHistoricalData(paramCopy);
			});

			tasks.add(() -> {
				Map<String, Object> paramCopy = new HashMap<>(param); // Create a copy
				fmpService.fetchHistoricalMarketCap(paramCopy);
			});

			tasks.add(() -> {
				Map<String, Object> paramCopy = new HashMap<>(param); // Create a copy
				paramCopy.put("period", "annual");
				fmpService.fetchIncomeStatement(paramCopy);
			});

			tasks.add(() -> {
				Map<String, Object> paramCopy = new HashMap<>(param); // Create a copy
				paramCopy.put("period", "annual");
				fmpService.fetchBalanceSheet(paramCopy);
			});

			tasks.add(() -> {
				Map<String, Object> paramCopy = new HashMap<>(param); // Create a copy
				paramCopy.put("period", "annual");
				fmpService.fetchCashFlowStatement(paramCopy);
			});
			
			tasks.add(() -> {
	            try {
	                stockStatisticsService.updateRSIForSymbol(symbol);
	                logger.info("RSI updated for symbol: {}", symbol);
	            } catch (Exception e) {
	                logger.error("Error updating RSI for symbol: {}", symbol, e);
	            }
	        });

			// Execute each task with a delay
			for (Runnable task : tasks) {
				try {
					task.run();
				} catch (Exception e) {
					logger.error("Error executing task", e);
				}
			}
			result.put("STATUS", ResponseCode.SUCCESS);
		} catch (Exception e) {
			logger.error("Error fetching or storing stock data from FMP", e);
			result.put("STATUS", ResponseCode.ERROR);
		}

		return result;
	}

	public List<Map<String, Object>> getIncomeStatement(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getIncomeStatement", param);
	}

	public List<Map<String, Object>> getBalanceSheet(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getBalanceSheet", param);
	}

	public List<Map<String, Object>> getCashFlowStatement(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getCashFlowStatement", param);
	}

	public Map<String, Object> fetchStockList(Map<String, Object> param) {

		Map<String, Object> result = new HashMap<>();
		String symbol = (String) param.get("symbol");

		try {
			fmpService.fetchStockList();
			result.put("STATUS", ResponseCode.SUCCESS);
		} catch (Exception e) {
			logger.error("Error fetching or storing stock data from FMP", e);
			result.put("STATUS", ResponseCode.ERROR);
		}

		return result;
	}
}
