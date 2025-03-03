package com.finsight.lab.scheduler;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finsight.lab.util.MyBatisUtils;

import jakarta.inject.Inject;

@Component
public class IndexDataUpdateScheduler {

	@Inject
	private SqlSession sqlSession;

	private static final String NAMESPACE = "IndexDataUpdate.";

	public static void main(String[] args) {
		new IndexDataUpdateScheduler().fetchIndexData();
	}

	public void fetchIndexData() {
		try {
			// Define the tickers for all the indices
			String[] tickers = { "^GSPC", "^IXIC", "^DJI" }; // S&P 500, NASDAQ, Dow Jones
			String[] indexCodes = { "SNP500", "NASDAQ", "DJI" }; // Corresponding codes for the indices

			for (int i = 0; i < tickers.length; i++) {
				String ticker = tickers[i];
				String indexCode = indexCodes[i];

				// Check if data exists in the table for the current index
				Map<String, Object> paramMap = new HashMap<>();
				paramMap.put("INDEX_CODE", indexCode);
				Integer dataCount = sqlSession.selectOne(NAMESPACE + "checkIndexDataExists", paramMap);

				// Determine the period based on the presence of data
				String period = (dataCount == null || dataCount == 0) ? "max" : "1mo";

				// Get the current working directory dynamically
				String projectDir = System.getProperty("user.dir");

				// Construct the Python script path dynamically
				String scriptPath = projectDir + File.separator + "script" + File.separator + "python" + File.separator
						+ "fetch_sp500_index.py";

				// Command to execute the Python script with the selected period and ticker
				ProcessBuilder processBuilder = new ProcessBuilder("python", scriptPath, ticker, period);

				// Start the process
				Process process = processBuilder.start();

				// Capture the output from the Python script
				BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
				StringBuilder jsonOutput = new StringBuilder();
				String line;

				// Read all lines of output
				while ((line = reader.readLine()) != null) {
					jsonOutput.append(line);
				}

				// Check if JSON output is empty
				if (jsonOutput.length() == 0) {
					throw new RuntimeException("No JSON output received from the Python script.");
				}

				// Print raw JSON output for debugging
				System.out.println("Raw JSON output for " + indexCode + ":");
				System.out.println(jsonOutput);

				// Parse the JSON output into a List of Maps
				ObjectMapper objectMapper = new ObjectMapper();
				List<Map<String, Object>> indexData = objectMapper.readValue(jsonOutput.toString(),
						new TypeReference<List<Map<String, Object>>>() {
						});
				SqlSession batchSession = MyBatisUtils.getBatchSession();
				int[] counter = { 0 }; // Use an array to make counter mutable

				// Insert each record into the database
				indexData.forEach(record -> {
					Map<String, Object> dataMap = new HashMap<>();
					dataMap.put("INDEX_CODE", indexCode); // Dynamic code for the current index
					dataMap.put("DATE", record.get("Date"));
					dataMap.put("OPEN_VALUE", record.get("Open"));
					dataMap.put("HIGH_VALUE", record.get("High"));
					dataMap.put("LOW_VALUE", record.get("Low"));
					dataMap.put("CLOSE_VALUE", record.get("Close"));
					dataMap.put("VOLUME", record.get("Volume"));
					dataMap.put("DIVIDENDS", record.get("Dividends"));
					dataMap.put("STOCK_SPLITS", record.get("Stock Splits"));

					try {
						// Batch update with threshold
						counter[0] = MyBatisUtils.batchUpdateWithThreshold(batchSession, NAMESPACE + "upsertIndexData",
								dataMap, 2000, counter[0]);
					} catch (Exception e) {
						System.err
								.println("Failed to insert data for " + indexCode + " on date: " + record.get("Date"));
						e.printStackTrace();
					}
				});

				MyBatisUtils.flushBatch(batchSession);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
