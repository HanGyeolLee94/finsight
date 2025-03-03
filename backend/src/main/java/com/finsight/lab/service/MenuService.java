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
public class MenuService {

	@Inject
    private SqlSession sqlSession;
	
	private static final String NAMESPACE = "Menu.";


    public List<Map<String, Object>> getAllMenus(Map<String, Object> param) {
        return sqlSession.selectList(NAMESPACE + "selectMenu", param);
    }

    public Map<String, Object> updateTableData(Map<String, Object> param) {
        List<Map<String, Object>> updatedRows = (List<Map<String, Object>>) param.get("update");
        String langCode = (String) param.get("LANG_CODE"); // Retrieve LANG_CODE from the param
        Map<String, Object> result = new HashMap<>();

        // Handle updated rows
        if (updatedRows != null) {
            for (Map<String, Object> row : updatedRows) {
                // Update user-related fields or any other specific fields in the MENU table
            	row.put("LANG_CODE", langCode);
                sqlSession.update(NAMESPACE + "updateMenu", row);
                sqlSession.update(NAMESPACE + "updateMenuName", row);
            }
        }

        result.put("STATUS", ResponseCode.SUCCESS);
        return result;
    }
}
