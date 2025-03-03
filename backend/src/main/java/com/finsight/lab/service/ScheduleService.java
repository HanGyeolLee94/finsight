package com.finsight.lab.service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.util.PasswordUtil;

import jakarta.inject.Inject;

@Service
public class ScheduleService {
	@Autowired
	private ApplicationContext applicationContext; // Inject ApplicationContext

	private static final Logger logger = LoggerFactory.getLogger(ScheduleService.class);
	@Inject
	private SqlSession sqlSession;

	private static final String NAMESPACE = "Schedule.";

	public List<Map<String, Object>> selectList(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "selectList", param);
	}

	public int saveList(Map<String, Object> param) {
		// 업데이트된 행 수를 저장할 변수
		int updatedCount = 0;

		List<Map<String, Object>> updates = (List<Map<String, Object>>) param.get("update");

		// 배열 내의 각 항목에 대해 반복하며 업데이트 작업 수행
		for (Map<String, Object> updateParam : updates) {

			// 기존 데이터 존재 여부 확인
			Map<String, Object> existingData = sqlSession.selectOne(NAMESPACE + "selectExist", updateParam);

			if (existingData == null) {
				// 데이터가 없으면 INSERT 실행
				sqlSession.insert(NAMESPACE + "insertOne", updateParam);
			} else {
				// 데이터가 있으면 UPDATE 실행
				updatedCount += sqlSession.update(NAMESPACE + "updateOne", updateParam);
			}
		}

		return updatedCount; // 업데이트된 행 수 반환
	}

	public int getTotalCount(Map<String, Object> param) {
		return sqlSession.selectOne(NAMESPACE + "getTotalCount", param);
	}

	public Map<String, Object> executeManualCall(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<>();
		String scheduleId = (String) param.get("SCHEDULE_ID");

		try {
			// Fetch the schedule details
			Map<String, Object> schedule = sqlSession.selectOne(NAMESPACE + "selectScheduleById", scheduleId);
			if (schedule == null) {
				logger.error("Schedule ID " + scheduleId + " not found.");
				result.put("STATUS", "FAILURE");
				result.put("MESSAGE", "Schedule not found.");
				return result;
			}

			// Extract required details
			String className = (String) schedule.get("CLASS_NAME");
			String methodName = (String) schedule.get("METHOD_NAME");

			// Dynamically invoke the method
			Object bean = applicationContext.getBean(Class.forName(className));
			Method method = bean.getClass().getMethod(methodName);

			method.invoke(bean); // Manually execute the task

			logger.info("Manually executed method {} in class {}", methodName, className);

			result.put("STATUS", "SUCCESS");
			result.put("MESSAGE", "Task executed successfully.");
		} catch (Exception e) {
			logger.error("Error executing manual call for schedule ID: " + scheduleId, e);
			result.put("STATUS", "FAILURE");
			result.put("MESSAGE", e.getMessage());
		}

		return result;
	}
	
	public Map<String, Object> saveScheduleData(Map<String, Object> param) {
	    List<Map<String, Object>> addedRows = (List<Map<String, Object>>) param.get("add");
	    List<Map<String, Object>> deletedRows = (List<Map<String, Object>>) param.get("delete");
	    List<Map<String, Object>> updatedRows = (List<Map<String, Object>>) param.get("update");
	    Map<String, Object> result = new HashMap<>();

	    // Handle added rows
	    if (addedRows != null) {
	        for (Map<String, Object> row : addedRows) {
	            sqlSession.insert(NAMESPACE + "insertSchedule", row);
	        }
	    }

	    // Handle deleted rows
	    if (deletedRows != null) {
	        for (Map<String, Object> row : deletedRows) {
	            sqlSession.delete(NAMESPACE + "deleteSchedule", row);
	        }
	    }

	    // Handle updated rows
	    if (updatedRows != null) {
	        for (Map<String, Object> row : updatedRows) {
	            sqlSession.update(NAMESPACE + "updateSchedule", row);
	        }
	    }

	    result.put("STATUS", ResponseCode.SUCCESS);
	    return result;
	}
}
