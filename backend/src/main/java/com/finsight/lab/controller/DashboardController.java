package com.finsight.lab.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.DashboardService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/dashboard")
public class DashboardController {

	@Inject
    private DashboardService service;
	
	@PostMapping ("/data")
	public Map<String, Object> getDashboardData(@RequestBody Map<String, Object> param) {
	    return service.getDashboardData(param);
	}
	
	@PostMapping ("/heatmap-data")
	public Map<String, Object> getHeatMapData(@RequestBody Map<String, Object> param) {
	    return service.getHeatMapData(param);
	}
}