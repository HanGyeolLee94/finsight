package com.finsight.lab.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.UserInfoService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/user-info")
public class UserInfoController {

	@Inject
    private UserInfoService service;
	
	@PostMapping("/select-users")
	public List<Map<String, Object>> getAllUsers(@RequestBody Map<String, Object> param) {
	    return service.getAllUsers(param);
	}
	
	@PostMapping("/save-table")
	public Map<String, Object> saveTableData(@RequestBody Map<String, Object> param) {
	    return service.updateUser(param);
	}
	
	@PostMapping("/get-default-page")
	public Map<String, Object> getDefaultPage(@RequestBody Map<String, Object> param) {
	    return service.getDefaultPage(param);
	}
	
	@PostMapping("/set-default-page")
	public Map<String, Object> setDefaultPage(@RequestBody Map<String, Object> param) {
	    return service.setDefaultPage(param);
	}
}