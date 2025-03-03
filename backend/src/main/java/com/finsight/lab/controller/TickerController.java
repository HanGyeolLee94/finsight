package com.finsight.lab.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.TickerService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/ticker")
public class TickerController {

	@Inject
    private TickerService service;
	
	@PostMapping("/select-list")
	public List<Map<String, Object>> selectList(@RequestBody Map<String, Object> param) {
	    return service.selectList(param);
	}
	
	@PostMapping("/select-one")
	public Map<String, Object> selectOne(@RequestBody Map<String, Object> param) {
	    return service.selectOne(param);
	}

	
	@PostMapping("/save-list")
    public int saveList(@RequestBody Map<String, Object> param) {
        return service.saveList(param);
    }

	@PostMapping("/get-total-count")
	public int getTotalCount(@RequestBody Map<String, Object> param) {
	    return service.getTotalCount(param);
	}
	@GetMapping("/recommendations")
    public List<Map<String, Object>> getTickerRecommendations(@RequestParam("q") String query) {
        // Call the service layer to fetch ticker recommendations
        return service.getTickerRecommendations(query);
    }
	
	@GetMapping("/asset-types")
	public List<Map<String, Object>> getAllRoles() {
	    return service.getAssetTypes();
	}

	@PostMapping("/close-price-chart-data")
	public Map<String, Object> getClosePriceChartData(@RequestBody Map<String, Object> param) {
	    return service.getClosePriceChartData(param);
	}
	
	@PostMapping("/per-chart-data")
	public Map<String, Object> getPerChartData(@RequestBody Map<String, Object> param) {
	    return service.getPerChartData(param);
	}
	
	@PostMapping("/eps-chart-data")
	public Map<String, Object> getEpsChartData(@RequestBody Map<String, Object> param) {
	    return service.getEpsChartData(param);
	}
	
	@PostMapping("/ratio-chart-data")
	public Map<String, Object> getRatioChartData(@RequestBody Map<String, Object> param) {
	    return service.getRatioChartData(param);
	}
	
	@PostMapping("/revenue-chart-data")
	public Map<String, Object> getRevenueChartData(@RequestBody Map<String, Object> param) {
	    return service.getRevenueChartData(param);
	}
	
	@PostMapping("/freecashflow-chart-data")
	public Map<String, Object> getFreeCashFlowChartData(@RequestBody Map<String, Object> param) {
	    return service.getFreeCashFlowChartData(param);
	}
	
	@PostMapping("/cashflowbreakdown-chart-data")
	public Map<String, Object> getCashFlowBreakdownChartData(@RequestBody Map<String, Object> param) {
	    return service.getCashFlowBreakdownChartData(param);
	}
	
	@PostMapping("/update-all")
	public Map<String, Object> updateAll(@RequestBody Map<String, Object> param) {
	    return service.updateAll(param);
	}
	
	@PostMapping("/get-income-statement")
	public List<Map<String, Object>> getIncomeStatement(@RequestBody Map<String, Object> param) {
	    return service.getIncomeStatement(param);
	}
	
	@PostMapping("/get-balance-sheet")
	public List<Map<String, Object>> getBalanceSheet(@RequestBody Map<String, Object> param) {
	    return service.getBalanceSheet(param);
	}
	
	@PostMapping("/get-cash-flow-statement")
	public List<Map<String, Object>> getCashFlowStatement(@RequestBody Map<String, Object> param) {
	    return service.getCashFlowStatement(param);
	}
	
	@PostMapping("/fetch-stock-list")
	public Map<String, Object> fetchStockList(@RequestBody Map<String, Object> param) {
	    return service.fetchStockList(param);
	}
}