package com.finsight.lab.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

import com.finsight.lab.constants.ResponseCode;
import com.finsight.lab.util.PasswordUtil;

import jakarta.inject.Inject;

@Service
public class UserInfoService {

	@Inject
	private SqlSession sqlSession;
	private static final String NAMESPACE = "UserInfoMapper.";

	public List<Map<String, Object>> getAllUsers(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getAllUsers", param);
	}

	public Map<String, Object> getUserById(int userId) {
		return sqlSession.selectOne(NAMESPACE + "findById", userId);
	}

	public int insertUser(Map<String, Object> param) {
		return sqlSession.insert(NAMESPACE + "insertUser", param);
	}

	public Map<String, Object> updateUser(Map<String, Object> param) {
	    List<Map<String, Object>> addedRows = (List<Map<String, Object>>) param.get("add");
	    List<Map<String, Object>> deletedRows = (List<Map<String, Object>>) param.get("delete");
	    List<Map<String, Object>> updatedRows = (List<Map<String, Object>>) param.get("update");
	    Map<String, Object> result = new HashMap<>();

	    List<Map<String, String>> newPasswords = new ArrayList<>();

	    // Handle added rows
	    if (addedRows != null) {
	        for (Map<String, Object> row : addedRows) {
	            String newPassword = PasswordUtil.generateRandomPassword();
	            String hashedPassword = PasswordUtil.hashPassword(newPassword);
	            row.put("PASSWORD_HASH", hashedPassword);

	            Map<String, String> passwordInfo = new HashMap<>();
	            passwordInfo.put("EMAIL", row.get("EMAIL").toString());
	            passwordInfo.put("PASSWORD", newPassword);
	            newPasswords.add(passwordInfo);

	            sqlSession.insert(NAMESPACE + "insertUser", row);
	        }
	    }

	    // Handle deleted rows
	    if (deletedRows != null) {
	        for (Map<String, Object> row : deletedRows) {
	            sqlSession.delete(NAMESPACE + "deleteUser", row);
	        }
	    }

	    // Handle updated rows
	    if (updatedRows != null) {
	        for (Map<String, Object> row : updatedRows) {
	            sqlSession.update(NAMESPACE + "updateUser", row);
	        }
	    }

	    result.put("STATUS", ResponseCode.SUCCESS);
	    result.put("newPasswords", newPasswords);
	    return result;
	}

	public int deleteUser(Map<String, Object> param) {
		return sqlSession.delete(NAMESPACE + "deleteUser", param);
	}

	public Map<String, Object> getDefaultPage(Map<String, Object> param) {
		Map<String, Object> response = new HashMap<>();
		String defaultPage = sqlSession.selectOne(NAMESPACE + "getDefaultPage", param);
		response.put("defaultPage", defaultPage);
		return response;
	}

	public Map<String, Object> setDefaultPage(Map<String, Object> param) {
	    Map<String, Object> response = new HashMap<>();
	    try {
	        // Update the DEFAULT_PAGE in USER_INFO
	        int rowsAffected = sqlSession.update(NAMESPACE + "setDefaultPage", param);

	        if (rowsAffected > 0) {
	            // After a successful update, retrieve the PATH of the new DEFAULT_PAGE
	            String defaultPagePath = sqlSession.selectOne(NAMESPACE + "getDefaultPagePath", param);

	            // If the PATH is retrieved successfully, include it in the response
	            response.put("code", ResponseCode.SUCCESS.getCode());
	            response.put("defaultPagePath", defaultPagePath);
	        } else {
	            response.put("code", ResponseCode.ERROR.getCode());
	        }
	    } catch (Exception e) {
	        response.put("code", ResponseCode.ERROR.getCode());
	        response.put("message", "An error occurred while setting the default page.");
	    }
	    return response;
	}

}
