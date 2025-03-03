package com.finsight.lab.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.finsight.lab.service.StockStatisticsService;

import jakarta.inject.Inject;

@Component
public class RSIUpdateScheduler {

	private static final Logger logger = LoggerFactory.getLogger(RSIUpdateScheduler.class);

	@Inject
	private StockStatisticsService stockStatisticsService;

	public void updateRSI() {
		try {
			logger.info("Starting scheduled RSI update...");
			stockStatisticsService.updateAllRSI();
			logger.info("Scheduled RSI update completed.");
		} catch (Exception e) {
			logger.error("Error in scheduled RSI update", e);
		}
	}
}