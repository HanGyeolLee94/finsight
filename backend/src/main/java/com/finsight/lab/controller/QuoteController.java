package com.finsight.lab.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.QuoteService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/quote")
public class QuoteController {

	@Inject
    private QuoteService service;
	
	@PostMapping("/top-gainers")
	public List<Map<String, Object>> getTopGainerData(@RequestBody Map<String, Object> param) {
	    return service.getTopGainerData(param);
	}
	
	@PostMapping("/top-losers")
	public List<Map<String, Object>> getTopLoserData(@RequestBody Map<String, Object> param) {
	    return service.getTopLoserData(param);
	}
	
	@PostMapping("/snp500")
	public List<Map<String, Object>> getSnp500Data(@RequestBody Map<String, Object> param) {
	    return service.getSnp500Data(param);
	}
}