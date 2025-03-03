package com.finsight.lab.scheduler;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Map;

@Service
public class SchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(SchedulerService.class);

    private final SqlSession sqlSession;
    private final DynamicScheduler dynamicScheduler;

    public SchedulerService(SqlSession sqlSession, DynamicScheduler dynamicScheduler) {
        this.sqlSession = sqlSession;
        this.dynamicScheduler = dynamicScheduler;
    }

    @PostConstruct
    public void initializeSchedulers() {
        // Fetch all enabled schedulers from the database
        List<Map<String, Object>> schedulers = sqlSession.selectList("SchedulerMapper.getAllEnabledSchedulers");

        for (Map<String, Object> scheduler : schedulers) {
            try {
                String className = (String) scheduler.get("CLASS_NAME");
                String methodName = (String) scheduler.get("METHOD_NAME");
                String cronExpression = (String) scheduler.get("CRON_EXPRESSION");
                String enabled = (String) scheduler.get("ENABLED");

                if ("Y".equals(enabled)) {
                    logger.info("Registering scheduler: {}.{} with cron {}", className, methodName, cronExpression);
                    dynamicScheduler.registerTask(className + "." + methodName, className, methodName, cronExpression);
                } else {
                    logger.info("Skipping disabled scheduler: {}.{}", className, methodName);
                }
            } catch (Exception e) {
                logger.error("Error initializing scheduler: {}", scheduler, e);
            }
        }
    }
}
