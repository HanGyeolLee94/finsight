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

import com.finsight.lab.service.TechnicalAnalysisService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/technical-analysis")
public class TechnicalAnalysisController {

	@Inject
    private TechnicalAnalysisService service;
	
	@PostMapping("/tickers")
	public List<Map<String, Object>> selectTickers(@RequestBody Map<String, Object> param) {
	    return service.selectTickers(param);
	}
	
	@PostMapping("/rsi/generate")
	public Map<String, Object> generateRSIData(@RequestBody Map<String, Object> param) {
	    return service.generateRSIData(param);
	}
	
	@PostMapping("/rsi/analyze")
	public Map<String, Object> analyzeRSIData(@RequestBody Map<String, Object> param) {
	    return service.analyzeRSIData(param);
	}

}