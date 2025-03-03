package com.finsight.lab.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Component
public class DynamicScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DynamicScheduler.class);

    private final TaskScheduler taskScheduler;
    private final ApplicationContext applicationContext;
    private final ConcurrentHashMap<String, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public DynamicScheduler(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
        ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
        threadPoolTaskScheduler.setPoolSize(5);
        threadPoolTaskScheduler.initialize();
        this.taskScheduler = threadPoolTaskScheduler;
    }

    public void registerTask(String taskName, String className, String methodName, String cronExpression) {
        try {
            // Get the Spring-managed bean
            Object bean = applicationContext.getBean(Class.forName(className));
            Method method = bean.getClass().getMethod(methodName);

            // Runnable to invoke the method on the Spring-managed bean
            Runnable task = () -> {
                try {
                    method.invoke(bean);
                    logger.info("Executed method {} in class {}", methodName, className);
                } catch (Exception e) {
                    logger.error("Error executing method {} in class {}", methodName, className, e);
                }
            };

            // Schedule the task and store the ScheduledFuture
            ScheduledFuture<?> future = taskScheduler.schedule(task, new CronTrigger(cronExpression));
            scheduledTasks.put(taskName, future);

            logger.info("Task '{}' registered: {}.{} with cron {}", taskName, className, methodName, cronExpression);

        } catch (Exception e) {
            logger.error("Error registering task for {}.{}: {}", className, methodName, e.getMessage(), e);
        }
    }

    public void removeTask(String taskName) {
        ScheduledFuture<?> future = scheduledTasks.get(taskName);
        if (future != null) {
            future.cancel(false); // Cancel the task (false means don't interrupt if running)
            scheduledTasks.remove(taskName);
            logger.info("Task '{}' removed successfully.", taskName);
        } else {
            logger.warn("No task found with name '{}'.", taskName);
        }
    }
}
