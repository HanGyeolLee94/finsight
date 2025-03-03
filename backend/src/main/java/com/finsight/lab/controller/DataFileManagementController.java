package com.finsight.lab.controller;

import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.service.DataFileManagementService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/data-file-management")
public class DataFileManagementController {

	@Inject
    private DataFileManagementService service;
	
	@PostMapping("/upload-file")
    public Map<String, Object> uploadFile(@RequestBody Map<String, Object> param) {
        return service.uploadFile(param);
    }
	
	@PostMapping("/upload-history")
	public List<Map<String, Object>> getUploadHistory(@RequestBody Map<String, Object> param) {
	    return service.getUploadHistory(param);
	}
	@PostMapping("/delete-history")
	public Map<String, Object> deleteHistory(@RequestBody Map<String, Object> param) {
	    return service.deleteHistory(param);
	}
	
	
	@PostMapping("/download-file")
	public ResponseEntity<Resource> downloadFile(@RequestBody Map<String, String> requestBody) {
	    String fileName = requestBody.get("fileName");
	    return service.downloadFile(fileName);
	}
}