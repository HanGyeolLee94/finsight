package com.finsight.lab.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.PolygonService;

@RestController
@CrossOrigin
@RequestMapping("/api/polygon")
public class PolygonController {

    @Autowired
    private PolygonService service;

    // General method to get tickers with customizable parameters
    @GetMapping("/tickers")
    public Map<String, String> getTickers(
            @RequestParam(value = "active", defaultValue = "true") boolean active,
            @RequestParam(value = "limit", defaultValue = "100") int limit,
            @RequestParam(value = "ticker", required = false) String ticker,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "market", required = false) String market,
            @RequestParam(value = "exchange", required = false) String exchange,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "order", required = false) String order,
            @RequestParam(value = "sort", required = false) String sort) {

        // Create a parameter map to pass to the service
        Map<String, String> params = new HashMap<>();
        params.put("active", String.valueOf(active));
        params.put("limit", String.valueOf(limit));
        if (ticker != null) params.put("ticker", ticker);
        if (type != null) params.put("type", type);
        if (market != null) params.put("market", market);
        if (exchange != null) params.put("exchange", exchange);
        if (date != null) params.put("date", date);
        if (order != null) params.put("order", order);
        if (sort != null) params.put("sort", sort);

        // Pass the param map to the service
        return service.getTickers(params);
    }

    // General method to get all tickers with customizable parameters
    @GetMapping("/all-tickers")
    public Map<String, String> getAllTickers(
            @RequestParam(value = "active", defaultValue = "true") boolean active,
            @RequestParam(value = "limit", defaultValue = "1000") int limit,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "market", required = false) String market,
            @RequestParam(value = "exchange", required = false) String exchange) {

        // Create a parameter map to pass to the service
        Map<String, String> params = new HashMap<>();
        params.put("active", String.valueOf(active));
        params.put("limit", String.valueOf(limit));
        if (type != null) params.put("type", type);
        if (market != null) params.put("market", market);
        if (exchange != null) params.put("exchange", exchange);

        // Pass the param map to the service
        return service.getAllTickers(params);
    }

    @GetMapping("/update-ticker-details")
    public Map<String, String> updateTickerDetails() {
        return service.updateTickerDetails();
    }

    @GetMapping("/ticker-types")
    public Map<String, String> getTickerTypes(
            @RequestParam(value = "locale", defaultValue = "us") String locale,
            @RequestParam(value = "asset_class", defaultValue = "stocks") String assetClass) {

        // Create a parameter map to pass to the service
        Map<String, String> params = new HashMap<>();
        params.put("locale", locale);
        params.put("asset_class", assetClass);

        // Pass the param map to the service
        return service.processAndStoreTickerTypes(params);
    }
    
    @GetMapping("/grouped-daily")
    public Map<String, Object> getGroupedDailyData(@RequestParam("date") String date,
                                                   @RequestParam(value = "adjusted", defaultValue = "true") boolean adjusted) {
        return service.getGroupedDailyData(date, adjusted);
    }

    // For a date range
    @GetMapping("/grouped-daily-range")
    public Map<String, Object> getGroupedDailyDataInRange(
            @RequestParam("start") String startDate,
            @RequestParam("end") String endDate,
            @RequestParam(value = "adjusted", defaultValue = "true") boolean adjusted) {
        return service.getGroupedDailyDataInRange(startDate, endDate, adjusted);
    }
    
    @GetMapping("/daily-open-close")
    public Map<String, Object> getDailyOpenClose(
            @RequestParam("ticker") String ticker,
            @RequestParam("date") String date,
            @RequestParam(value = "adjusted", defaultValue = "true") String adjusted) {
    	Map<String, String> params = new HashMap<>();
        params.put("ticker", ticker);
        params.put("date", date);
        params.put("adjusted", adjusted);

        return service.getDailyOpenClose(params);
    }
    
    @GetMapping("/daily-open-close-range")
    public Map<String, Object> getDailyOpenCloseInRange(
            @RequestParam("ticker") String ticker,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "adjusted", defaultValue = "true") String adjusted) {
        
        return service.getDailyOpenCloseInRange(ticker, startDate, endDate, adjusted);
    }
}
