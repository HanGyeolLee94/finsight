package com.finsight.lab.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringJoiner;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.util.MyBatisUtils;

import jakarta.inject.Inject;

@Service
public class PolygonService {

	private static final int BATCH_SIZE = 1000;  // Commit every 500 rows
	private static final Logger logger = LoggerFactory.getLogger(PolygonService.class);

    @Inject
    private SqlSession sqlSession;
    
    @Inject
    private SqlSessionFactory sqlSessionFactory;

    private static final String NAMESPACE = "Polygon.";

    private final String API_KEY = "TkAQYRpY8wqXETOM1e2AKfPSvBS2qLO1";
    private final String BASE_URL = "https://api.polygon.io";

    private static final int API_LIMIT = 5; // 5 API calls per minute
    private static final long WAIT_TIME_MS = 60_000 / API_LIMIT; // 12 seconds per request

    // Method to dynamically build the URL with query parameters
    private String buildUrl(String endpoint, Map<String, String> params) {
        StringJoiner queryParams = new StringJoiner("&", "?", "");
        params.forEach((key, value) -> {
            if (value != null && !value.isEmpty()) {
                queryParams.add(key + "=" + value);
            }
        });

        return BASE_URL + endpoint + queryParams.toString() + "&apiKey=" + API_KEY;
    }

    // Fetch tickers from the Polygon API using the dynamically constructed URL
    public Map<String, String> getTickers(Map<String, String> params) {
        String endpoint = "/v3/reference/tickers";
        String url = buildUrl(endpoint, params);
        return getTickers(url); // Reusing the method to avoid code duplication
    }
    // Fetch all tickers using pagination, leveraging getTickers for each page
    public Map<String, String> getAllTickers(Map<String, String> params) {
        String endpoint = "/v3/reference/tickers";
        String url = buildUrl(endpoint, params);

        Map<String, String> result = new HashMap<>();
        boolean hasMoreData = true;
        String nextUrl = url;

        while (hasMoreData && nextUrl != null) {
            try {
                // Reuse the getTickers method to fetch and process each page of data
                Map<String, String> pageResult = getTickers(nextUrl);
                if ("FAIL".equals(pageResult.get("STATUS"))) {
                    return pageResult; // Return immediately if any failure occurs
                }

                // Extract the next URL for pagination
                nextUrl = extractNextUrl(pageResult.get("RESPONSE_BODY")); // Assumes RESPONSE_BODY contains the API response

                // Pause to respect the API rate limit (5 requests per minute)
                Thread.sleep(WAIT_TIME_MS);

                // If no more data to fetch, stop the loop
                hasMoreData = nextUrl != null;

            } catch (InterruptedException e) {
                e.printStackTrace();
                result.put("STATUS", "FAIL");
                return result;
            }
        }

        result.put("STATUS", "SUCCESS");
        return result;
    }

    // Fetch tickers using the URL and store them in the database
    public Map<String, String> getTickers(String url) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + API_KEY);

        Map<String, String> result = new HashMap<>();
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();
            boolean success = processAndStoreTickers(responseBody);

            result.put("RESPONSE_BODY", responseBody); // Save the response body to extract pagination info later
            result.put("STATUS", success ? "SUCCESS" : "FAIL");
        } else {
            result.put("STATUS", "FAIL");
        }

        return result;
    }

    // Method to extract the next URL (pagination) from the API response
    private String extractNextUrl(String jsonResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);

            // Extracting the next_url or cursor for pagination
            if (rootNode.has("next_url")) {
                return rootNode.get("next_url").asText();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private boolean processAndStoreTickers(String jsonResponse) {
        SqlSession batchSession = null;
        
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);

            JsonNode tickersNode = rootNode.get("results");
            if (tickersNode.isArray()) {
                // 배치 세션 열기
                batchSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
                int rowCount = 0;  // 배치에 추가된 행 수
                Set<String> processedTickers = new HashSet<>(); 

                for (JsonNode tickerJson : tickersNode) {
                    String ticker = tickerJson.get("ticker").asText();
                 // 중복된 티커는 건너뛰기
                    if (processedTickers.contains(ticker)) {
                        continue;
                    }
                    // 조회 작업은 sqlSession으로 처리
                    boolean exists = sqlSession.selectOne(NAMESPACE + "tickerExists", ticker);
                    processedTickers.add(ticker);
                    // JSON 데이터를 Map으로 변환하여 저장
                    Map<String, Object> tickerData = new HashMap<>();
                    Iterator<Map.Entry<String, JsonNode>> fields = tickerJson.fields();
                    while (fields.hasNext()) {
                        Map.Entry<String, JsonNode> field = fields.next();
                        String key = field.getKey().toUpperCase();

                        // 필드에 따라 값 변환
                        if ("active".equals(field.getKey())) {
                            boolean activeValue = field.getValue().asBoolean();
                            tickerData.put(key, activeValue ? 1 : 0);
                        } else if ("last_updated_utc".equals(field.getKey())) {
                            String dateTimeString = field.getValue().asText();
                            String formattedDate = dateTimeString.substring(0, 10);
                            tickerData.put(key, formattedDate);
                        } else {
                            tickerData.put(key, field.getValue().asText());
                        }
                    }

                    // 존재 여부에 따라 업데이트 또는 삽입을 배치 세션에서 처리
                    if (exists) {
                        batchSession.update(NAMESPACE + "updateTicker", tickerData);
                    } else {
                        batchSession.insert(NAMESPACE + "insertTicker", tickerData);
                    }

                    rowCount++;

                    // BATCH_SIZE만큼 쌓일 때마다 flush 처리
                    if (rowCount % BATCH_SIZE == 0) {
                        MyBatisUtils.flushBatch(batchSession);  // 배치 플러시 처리
                    }
                }

                // 남은 작업 flush 처리
                if (rowCount % BATCH_SIZE != 0) {
                    MyBatisUtils.flushBatch(batchSession);  // 남은 배치 플러시 처리
                }

                batchSession.commit();  // 트랜잭션 커밋
                return true;
            }
        } catch (Exception e) {
            // 예외 발생 시 롤백 및 세션 종료
            MyBatisUtils.handleExceptionAndClose(batchSession, e);
        } finally {
            // 세션 종료
            MyBatisUtils.closeSession(batchSession);
        }
        return false;
    }
    // Process ticker details and store in the database
    public Map<String, String> updateTickerDetails() {
        Map<String, String> result = new HashMap<>();
        try {
            // Fetch tickers that are not present in POLYGON_TICKER_DETAIL or have not been updated in the last month
            List<String> tickers = sqlSession.selectList(NAMESPACE + "getOutdatedOrMissingTickers");

            if (tickers.isEmpty()) {
                result.put("STATUS", "SUCCESS");
                return result;
            }

            for (String ticker : tickers) {
                String detailResponse = fetchTickerDetail(ticker);
                if (detailResponse != null) {
                    boolean success = processAndStoreTickerDetails(ticker, detailResponse);
                    if (!success) {
                        result.put("STATUS", "FAIL");
                        return result;
                    }
                } else {
                    result.put("STATUS", "FAIL");
                    return result;
                }

                try {
                    // Pause to respect the API rate limit (5 requests per minute)
                    Thread.sleep(WAIT_TIME_MS);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    result.put("STATUS", "FAIL");
                    return result;
                }
            }

            // If all tickers were processed successfully
            result.put("STATUS", "SUCCESS");

        } catch (Exception e) {
            result.put("STATUS", "FAIL");
        }

        return result;
    }

    // Process and store ticker details
    private boolean processAndStoreTickerDetails(String ticker, String jsonResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);

            JsonNode resultsNode = rootNode.get("results");
            if (resultsNode != null) {
                Map<String, Object> tickerDetailData = new HashMap<>();

                Iterator<Map.Entry<String, JsonNode>> fields = resultsNode.fields();
                while (fields.hasNext()) {
                    Map.Entry<String, JsonNode> field = fields.next();
                    String key = field.getKey().toUpperCase();
                    tickerDetailData.put(key, field.getValue().asText());
                }

                // Insert or update the details in the database
                boolean exists = sqlSession.selectOne(NAMESPACE + "tickerDetailExists", ticker);
                if (exists) {
                    sqlSession.update(NAMESPACE + "updateTickerDetail", tickerDetailData);
                } else {
                    sqlSession.insert(NAMESPACE + "insertTickerDetail", tickerDetailData);
                }

                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // Fetch detailed ticker data from Polygon API
    private String fetchTickerDetail(String ticker) {
        String apiUrl = BASE_URL + "/v3/reference/tickers/" + ticker + "?apiKey=" + API_KEY;

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + API_KEY);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody(); // Return the detailed data JSON
            } else {
                System.out.println("Failed to fetch ticker detail for: " + ticker);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // Return null if there was an error or failure
    }

    // Process and store ticker types dynamically from the API
    public Map<String, String> processAndStoreTickerTypes(Map<String, String> params) {
        Map<String, String> result = new HashMap<>();

        try {
            String endpoint = "/v3/reference/tickers/types";
            String url = buildUrl(endpoint, params); // Build URL with params

            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> tickerTypes = (List<Map<String, Object>>) response.get("results");

            if (tickerTypes == null || tickerTypes.isEmpty()) {
                result.put("STATUS", "NO_DATA");
                return result;
            }

            // Process and store ticker types in the database
            for (Map<String, Object> tickerType : tickerTypes) {
                // Convert keys to uppercase
                Map<String, Object> upperCaseTickerType = new HashMap<>();
                for (Map.Entry<String, Object> entry : tickerType.entrySet()) {
                    upperCaseTickerType.put(entry.getKey().toUpperCase(), entry.getValue());
                }

                // Check if the ticker type exists, then insert or update accordingly
                int count = sqlSession.selectOne(NAMESPACE + "checkTickerTypeExists", upperCaseTickerType);
                if (count > 0) {
                    sqlSession.update(NAMESPACE + "updateTickerType", upperCaseTickerType);
                } else {
                    sqlSession.insert(NAMESPACE + "insertTickerType", upperCaseTickerType);
                }
            }

            result.put("STATUS", "SUCCESS");
        } catch (Exception e) {
            e.printStackTrace();
            result.put("STATUS", "FAIL");
        }

        return result;
    }
    
    public Map<String, Object> getGroupedDailyData(String date, boolean adjusted) {
        String endpoint = "/v2/aggs/grouped/locale/us/market/stocks/" + date;
        Map<String, String> params = new HashMap<>();
        params.put("adjusted", String.valueOf(adjusted));

        // Build the complete URL
        String url = buildUrl(endpoint, params);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        Map<String, Object> result = new HashMap<>();
        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();
            boolean success = processAndStoreGroupedDailyData(responseBody);
            result.put("STATUS", success ? "SUCCESS" : "FAIL");
        } else {
            result.put("STATUS", "FAIL");
        }

        return result;
    }


    private boolean processAndStoreGroupedDailyData(String jsonResponse) {
        SqlSession batchSession = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);

            JsonNode resultsNode = rootNode.get("results");
            if (resultsNode.isArray()) {
                batchSession = sqlSessionFactory.openSession(ExecutorType.BATCH);  // BATCH 모드로 세션 열기
                int rowCount = 0;  // 배치에 추가된 행 수
                Set<String> processedTickers = new HashSet<>(); 
                for (JsonNode result : resultsNode) {
                    Map<String, Object> groupedData = new HashMap<>();  // JSON 데이터를 매핑할 Map

                    if (result.has("T")) {
                    	String ticker = result.get("T").asText();
                    	if (processedTickers.contains(ticker)) {
                            continue;
                        }
                        groupedData.put("TICKER", ticker);
                        processedTickers.add(ticker);
                    }

                    if (result.has("t")) {
                        long timestamp = result.get("t").asLong();
                        LocalDateTime dateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.of("America/New_York"));
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                        String formattedDate = dateTime.format(formatter);
                        groupedData.put("TRADE_DATE", formattedDate);
                    }

                    // 나머지 JSON 필드 처리
                    if (result.has("c")) groupedData.put("CLOSE_PRICE", result.get("c").asDouble());
                    if (result.has("h")) groupedData.put("HIGH_PRICE", result.get("h").asDouble());
                    if (result.has("l")) groupedData.put("LOW_PRICE", result.get("l").asDouble());
                    if (result.has("o")) groupedData.put("OPEN_PRICE", result.get("o").asDouble());
                    if (result.has("n")) groupedData.put("NUMBER_OF_TRANSACTIONS", result.get("n").asInt());
                    if (result.has("v")) groupedData.put("TRADING_VOLUME", result.get("v").asDouble());
                    if (result.has("vw")) groupedData.put("VOLUME_WEIGHTED_AVERAGE_PRICE", result.get("vw").asDouble());

                    // 데이터베이스에 해당 데이터가 존재하는지 확인
                    boolean exists = sqlSession.selectOne(NAMESPACE + "groupedDataExists", groupedData);

                    // 데이터가 존재하지 않을 경우에만 삽입
                    if (!exists) {
                        batchSession.insert(NAMESPACE + "insertGroupedData", groupedData);
                        rowCount++;

                        if (rowCount % BATCH_SIZE == 0) {
                            MyBatisUtils.flushBatch(batchSession);  // 배치 플러시 처리
                        }
                    }
                }

                if (rowCount % BATCH_SIZE == 0) {
                    MyBatisUtils.flushBatch(batchSession);  // 배치 플러시 처리
                }

                batchSession.commit();  // 트랜잭션 커밋
                return true;  // 성공
            }
        } catch (Exception e) {
        	MyBatisUtils.handleExceptionAndClose(batchSession, e);
        } finally {
        	MyBatisUtils.closeSession(batchSession);
        }
        return false;
    }
    
    public Map<String, Object> getGroupedDailyDataInRange(String startDate, String endDate, boolean adjusted) {
        Map<String, Object> result = new HashMap<>();

        try {
            LocalDate start = LocalDate.parse(startDate);  // Parse start date
            LocalDate end = LocalDate.parse(endDate);      // Parse end date

            if (start.isAfter(end)) {
                result.put("STATUS", "FAIL");
                result.put("ERROR", "Start date must be before end date.");
                return result;
            }

            // Iterate over the date range (inclusive)
            LocalDate currentDate = start;
            while (!currentDate.isAfter(end)) {
                String formattedDate = currentDate.toString();

                // Fetch grouped daily data for the current date
                Map<String, Object> dailyData = getGroupedDailyData(formattedDate, adjusted);
                result.put(formattedDate, dailyData);

                // Sleep for the wait time to respect the API rate limit
                Thread.sleep(WAIT_TIME_MS);

                // Move to the next date
                currentDate = currentDate.plusDays(1);
            }

            result.put("STATUS", "SUCCESS");
        } catch (Exception e) {
            logger.error("Error while fetching grouped daily data for date range", e);
            result.put("STATUS", "FAIL");
            result.put("ERROR", e.getMessage());
        }

        return result;
    }
    
    public Map<String, Object> getDailyOpenClose(Map<String, String> params) {
    	String ticker = params.get("ticker");
    	String date = params.get("date");
    	
    	//String ticker, String date, boolean adjusted
    	String endpoint = "/v1/open-close/" + ticker + "/" + date;

        // Build the complete URL
        String url = buildUrl(endpoint, params);

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> result = new HashMap<>();
        try {
            // Make the API call to Polygon
            String response = restTemplate.getForObject(url, String.class);
            
            if (response != null) {
                result.put("STATUS", ResponseCode.SUCCESS);

                // Parse response JSON to map and store in the database
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(response);
                
                Map<String, Object> record = new HashMap<>();
                record.put("SYMBOL", jsonNode.get("symbol").asText());
                record.put("TRADE_DATE", jsonNode.get("from").asText());
                record.put("AFTER_HOURS", jsonNode.has("afterHours") ? jsonNode.get("afterHours").asDouble() : null);
                record.put("CLOSE_PRICE", jsonNode.has("close") ? jsonNode.get("close").asDouble() : null);
                record.put("HIGH_PRICE", jsonNode.has("high") ? jsonNode.get("high").asDouble() : null);
                record.put("LOW_PRICE", jsonNode.has("low") ? jsonNode.get("low").asDouble() : null);
                record.put("OPEN_PRICE", jsonNode.has("open") ? jsonNode.get("open").asDouble() : null);
                record.put("PRE_MARKET", jsonNode.has("preMarket") ? jsonNode.get("preMarket").asDouble() : null);
                record.put("STATUS", jsonNode.get("status").asText());
                record.put("VOLUME", jsonNode.has("volume") ? jsonNode.get("volume").asLong() : null);

                // Check if the data already exists in the database
                boolean exists = sqlSession.selectOne(NAMESPACE + "dailyOpenCloseExists", record);
                if (!exists) {
                    sqlSession.insert(NAMESPACE + "insertDailyOpenClose", record);
                } else {
                    logger.info("Record already exists for SYMBOL: " + ticker + ", TRADE_DATE: " + date);
                }
            } else {
                result.put("STATUS", ResponseCode.ERROR);
                logger.error("Empty response received from Polygon API.");
            }
        } catch (Exception e) {
            logger.error("Error fetching or storing daily open-close data", e);
            result.put("STATUS", ResponseCode.ERROR);
        }

        return result;
    }

    public Map<String, Object> getDailyOpenCloseInRange(String ticker, String startDate, String endDate, String adjusted) {
        Map<String, Object> result = new HashMap<>();
        result.put("STATUS", ResponseCode.SUCCESS);
        
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            if (start.isAfter(end)) {
                result.put("STATUS", ResponseCode.ERROR);
                result.put("MESSAGE", "Start date must be before end date.");
                return result;
            }

            List<Map<String, Object>> dataList = new ArrayList<>();
            LocalDate currentDate = start;
            
            while (!currentDate.isAfter(end)) {
                String dateString = currentDate.toString();

                // Prepare parameters for the single date
                Map<String, String> params = new HashMap<>();
                params.put("ticker", ticker);
                params.put("date", dateString);
                params.put("adjusted", adjusted);

                // Fetch data for the single date
                getDailyOpenClose(params);
                
                // Respect API rate limits if necessary
                Thread.sleep(WAIT_TIME_MS);
                
                // Move to the next day
                currentDate = currentDate.plusDays(1);
            }

        } catch (Exception e) {
            logger.error("Error fetching daily open-close data for date range", e);
            result.put("STATUS", ResponseCode.ERROR);
            result.put("MESSAGE", e.getMessage());
        }

        return result;
    }
}
