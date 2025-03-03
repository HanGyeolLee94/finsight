package com.finsight.lab.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.MenuService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/menu")
public class MenuController {

	@Inject
    private MenuService service;
	
	@PostMapping("/get-all-menus")
	public List<Map<String, Object>> getAllMenus(@RequestBody Map<String, Object> param) {
	    return service.getAllMenus(param);
	}
	
	@PostMapping("/update-table-data")
	public Map<String, Object> updateTableData(@RequestBody Map<String, Object> param) {
	    return service.updateTableData(param);
	}

}