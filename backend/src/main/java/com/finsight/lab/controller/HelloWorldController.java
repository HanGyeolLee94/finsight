package com.finsight.lab.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
//cors 설정 : https://dev-pengun.tistory.com/entry/Spring-Boot-CORS-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0
@RestController
@CrossOrigin
public class HelloWorldController {

    @GetMapping("/api/hello")
    public String test() {
    	return "Hello, world!";
    }
}
