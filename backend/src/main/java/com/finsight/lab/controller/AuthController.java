package com.finsight.lab.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finsight.lab.service.AuthService;
import com.finsight.lab.util.AuthUtil;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> param) {
        Map<String, Object> response = authService.login(param);

        return response;
    }
    
    @PostMapping("/signup")
    public Map<String, Object> signUp(@RequestBody Map<String, Object> param) {
        Map<String, Object> response = authService.signUp(param);

        return response;
    }
    
    @PostMapping("/send-new-password")
    public Map<String, Object> sendNewPassword(@RequestBody Map<String, String> param) {
    	Map<String, Object> response = authService.resetPasswordAndNotify(param);
        return response;
    }
    
    @PostMapping("/get-menu-permissions")
    public List<Map<String, Object>> getMenuPermissions(@RequestBody Map<String, Object> param) {

        return authService.getMenuPermissions(param);
    }
    
    @PostMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody Map<String, Object> param) {
    	Map<String, Object> response = authService.changePassword(param);

        return response;
    }
}
