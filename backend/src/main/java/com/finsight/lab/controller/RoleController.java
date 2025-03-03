package com.finsight.lab.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.RoleService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/role")
public class RoleController {

	@Inject
    private RoleService service;
	
	@PostMapping("/get-all-roles")
	public List<Map<String, Object>> getAllRoles() {
	    return service.getAllRoles();
	}
	
	@PostMapping("/get-role-menu")
	public List<Map<String, Object>> getRoleMenu(@RequestBody Map<String, Object> param) {
	    return service.getRoleMenu(param);
	}
	
	@PostMapping("/save-role-menu")
    public Map<String, Object> saveRoleMenu(@RequestBody Map<String, Object> param) {
        // 성공 여부 반환 (1: 성공, 0: 실패)
        return service.saveRoleMenu(param);
    }

}