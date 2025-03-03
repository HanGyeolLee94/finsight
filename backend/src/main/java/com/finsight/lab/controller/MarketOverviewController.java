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

import com.finsight.lab.service.MarketOverviewService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/market-overview")
public class MarketOverviewController {

	@Inject
    private MarketOverviewService service;
	
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
}