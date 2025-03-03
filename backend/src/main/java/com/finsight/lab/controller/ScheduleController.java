package com.finsight.lab.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.finsight.lab.scheduler.DynamicScheduler;
import com.finsight.lab.service.ScheduleService;

import jakarta.inject.Inject;

@RestController
@CrossOrigin
@RequestMapping("/schedule")
public class ScheduleController {

	@Inject
    private ScheduleService service;
	
    private final DynamicScheduler dynamicScheduler;

    public ScheduleController(DynamicScheduler dynamicScheduler) {
        this.dynamicScheduler = dynamicScheduler;
    }

    @PostMapping("/select-list")
	public List<Map<String, Object>> selectList(@RequestBody Map<String, Object> param) {
	    return service.selectList(param);
	}
    
    // Register a new task
    @PostMapping("/register")
    public String registerTask(@RequestParam String taskName,
                               @RequestParam String className,
                               @RequestParam String methodName,
                               @RequestParam String cronExpression) {
        dynamicScheduler.registerTask(taskName, className, methodName, cronExpression);
        return "Task '" + taskName + "' registered with cron: " + cronExpression;
    }

    // Remove an existing task
    @DeleteMapping("/remove")
    public String removeTask(@RequestParam String taskName) {
        dynamicScheduler.removeTask(taskName);
        return "Task '" + taskName + "' removed.";
    }
    
    @PostMapping("/manual-call")
    public Map<String, Object> manualCall(@RequestBody Map<String, Object> param) {
    	return service.executeManualCall(param);
    }
    
    @PostMapping("/save")
	public Map<String, Object> saveScheduleData(@RequestBody Map<String, Object> param) {
	    return service.saveScheduleData(param);
	}
}
