package com.finsight.lab.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.finsight.lab.constants.ResponseCode;

import jakarta.inject.Inject;

@Service
public class RoleService {

	@Inject
	private SqlSession sqlSession;

	private static final String NAMESPACE = "Role.";

	public List<Map<String, Object>> getAllRoles() {
		return sqlSession.selectList(NAMESPACE + "selectRole");
	}

	public List<Map<String, Object>> getRoleMenu(@RequestBody Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "selectRoleMenuPermissions", param);
	}

	public Map<String, Object> saveRoleMenu(Map<String, Object> param) {
	    // 업데이트된 행 수를 저장할 변수
		Map<String, Object> result = new HashMap<>();

	    // param에서 ROLE_ID 추출
	    Object roleId = param.get("ROLE_ID"); // ROLE_ID를 param에서 가져옴

	    if (roleId == null) {
	        throw new IllegalArgumentException("ROLE_ID is missing in the parameters.");
	    }

	    List<Map<String, Object>> updates = (List<Map<String, Object>>) param.get("update");

	    // 배열 내의 각 항목에 대해 반복하며 업데이트 작업 수행
	    for (Map<String, Object> updateParam : updates) {
	        // 각 updateParam에 ROLE_ID 추가
	        updateParam.put("ROLE_ID", roleId);

	        // 기존 데이터 존재 여부 확인
	        Map<String, Object> existingData = sqlSession.selectOne(NAMESPACE + "selectOneRoleMenuPermission",
	                updateParam);

	        if (existingData == null) {
	            // 데이터가 없으면 INSERT 실행
	            sqlSession.insert(NAMESPACE + "insertRoleMenuPermissions", updateParam);
	        } else {
	            // 데이터가 있으면 UPDATE 실행
	            sqlSession.update(NAMESPACE + "updateRoleMenuPermissions", updateParam);
	        }
	    }
	    result.put("STATUS", ResponseCode.SUCCESS);
	    return result; // 업데이트된 행 수 반환
	}
}
