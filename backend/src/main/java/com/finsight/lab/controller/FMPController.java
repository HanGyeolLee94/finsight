package com.finsight.lab.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.FMPService;

@RestController
@CrossOrigin
@RequestMapping("/api/fmp")
public class FMPController {

    @Autowired
    private FMPService service;

    @GetMapping("/fetch-stock-list")
    public Map<String, Object> fetchStockList() {
        return service.fetchStockList();
    }
    
    @GetMapping("/fetch-company-profile")
    public Map<String, Object> fetchCompanyProfile(@RequestParam("symbol") String symbol) {
        return service.fetchCompanyProfile(symbol);
    }
    
    @GetMapping("/fetch-historical-data")
    public Map<String, Object> fetchHistoricalData(
            @RequestParam("symbol") String symbol,
            @RequestParam(value = "from", required = false) String from, //2023-10-10
            @RequestParam(value = "to", required = false) String to, //2023-10-10
            @RequestParam(value = "serietype", required = false) String serietype) {
        
        // Build a map with the query parameters
        Map<String, Object> param = new HashMap<>();
        param.put("symbol", symbol);
        if (from != null) param.put("from", from);
        if (to != null) param.put("to", to);
        if (serietype != null) param.put("serietype", serietype);

        // Pass the map to the service
        return service.fetchHistoricalData(param);
    }
    
    @GetMapping("/fetch-quote")
    public Map<String, Object> fetchQuote(
            @RequestParam("symbol") String symbol) {
    	Map<String, Object> param = new HashMap<>();
        param.put("symbol", symbol);
        return service.fetchQuote(param);
    }
    
    @GetMapping("/fetch-historical-market-cap")
    public Map<String, Object> fetchHistoricalMarketCap(
            @RequestParam("symbol") String symbol,
            @RequestParam(value = "from", required = false) String from,
            @RequestParam(value = "to", required = false) String to,
            @RequestParam(value = "limit", required = false) String limit) {

        Map<String, Object> param = new HashMap<>();
        param.put("symbol", symbol);
        if (from != null) param.put("from", from);
        if (to != null) param.put("to", to);
        if (limit != null) param.put("limit", limit);

        return service.fetchHistoricalMarketCap(param);
    }
    
    @GetMapping("/fetch-income-statement")
    public Map<String, Object> fetchIncomeStatement(
            @RequestParam("symbol") String symbol,
            @RequestParam(value = "period", required = false) String period,
            @RequestParam(value = "limit", required = false) String limit) {
        
        Map<String, Object> param = new HashMap<>();
        param.put("symbol", symbol);
        if (period != null) param.put("period", period);
        if (limit != null) param.put("limit", limit);

        return service.fetchIncomeStatement(param);
    }
    
    @GetMapping("/fetch-balance-sheet")
    public Map<String, Object> fetchBalanceSheet(
            @RequestParam("symbol") String symbol,
            @RequestParam(value = "period", required = false) String period,
            @RequestParam(value = "limit", required = false) String limit) {
        
        // Pass the parameters to the service
        Map<String, Object> param = Map.of(
            "symbol", symbol,
            "period", period
        );
        return service.fetchBalanceSheet(param);
    }
    
    
    @GetMapping("/fetch-cash-flow-statement")
    public Map<String, Object> fetchCashFlowStatement(
            @RequestParam("symbol") String symbol,
            @RequestParam(value = "period", required = false) String period,
            @RequestParam(value = "limit", required = false) String limit) {

        Map<String, Object> param = new HashMap<>();
        param.put("symbol", symbol);
        if (period != null) param.put("period", period);
        if (limit != null) param.put("limit", limit);

        return service.fetchCashFlowStatement(param);
    }
}
