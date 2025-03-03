package com.finsight.lab.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.finsight.lab.service.FMPService;

import jakarta.inject.Inject;

@Service
public class MarketOverviewService {

	private static final Logger logger = LoggerFactory.getLogger(MarketOverviewService.class);
	@Inject
	private SqlSession sqlSession;

	@Autowired
	private FMPService fmpService;

	private static final String NAMESPACE = "MarketOverview.";

	public List<Map<String, Object>> selectList(Map<String, Object> param) {
		String analysisType = (String) param.get("ANALYSIS_TYPE");
		
		List<Map<String, Object>> result = null;
		switch(analysisType) {
		case "TOP_GAINERS":
			result = sqlSession.selectList("Quote.getTopGainerData", param);
			break;
		case "TOP_LOSERS":
			result = sqlSession.selectList("Quote.getTopLoserData", param);
			break;	
		case "SNP500":
			result = sqlSession.selectList("Quote.getSnp500Data", param);
			break;	
		}
		return result;
	}

	public Map<String, Object> selectOne(Map<String, Object> param) {
		return sqlSession.selectOne(NAMESPACE + "selectOne", param);
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

	public List<Map<String, Object>> getTickerRecommendations(String query) {
		// Prepare a parameter map
		Map<String, Object> params = Map.of("query", query);
		// Query MyBatis mapper to get ticker recommendations
		return sqlSession.selectList(NAMESPACE + "getTickerRecommendations", params);
	}

	public List<Map<String, Object>> getAssetTypes() {
		return sqlSession.selectList(NAMESPACE + "selectAssetTypes");
	}
}
