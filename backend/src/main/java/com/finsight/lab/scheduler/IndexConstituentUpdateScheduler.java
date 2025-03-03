package com.finsight.lab.scheduler;

import java.util.List;

import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.finsight.lab.service.FMPService;

import jakarta.inject.Inject;

@Component
public class IndexConstituentUpdateScheduler {

	private static final Logger logger = LoggerFactory.getLogger(IndexConstituentUpdateScheduler.class);

	@Inject
	private SqlSession sqlSession;

	private static final String NAMESPACE = "IndexConstituentUpdate.";

	@Autowired
	private FMPService fmpService;

	public void update() {
		try {
			List<Map<String, Object>> outdatedSymbols = sqlSession.selectList(NAMESPACE + "getOutdatedSymbols");

			if (!outdatedSymbols.isEmpty()) {
				logger.info("Found {} outdated symbols", outdatedSymbols.size());
				for (Map<String, Object> map : outdatedSymbols) {
					String symbol = (String) map.get("SYMBOL");
					logger.info("Outdated Symbol: {}", symbol);
					// Add a lowercase key to the existing map
					map.put("symbol", symbol);
					// Pass the updated map to fetchQuote
					fmpService.fetchQuote(map);
					fmpService.fetchCompanyProfile(symbol);
				}
			} else {
				logger.info("No outdated symbols found.");
			}

			logger.info("Completed task: Update S&P 500 list");
		} catch (Exception e) {
			logger.error("Error in task: Update S&P 500 list", e);
		}
	}
}
