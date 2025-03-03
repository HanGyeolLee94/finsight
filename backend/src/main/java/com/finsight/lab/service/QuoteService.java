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
public class QuoteService {

	private static final Logger logger = LoggerFactory.getLogger(QuoteService.class);
	@Inject
	private SqlSession sqlSession;

	private static final String NAMESPACE = "Quote.";

	public List<Map<String, Object>> getTopGainerData(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getTopGainerData", param);
	}
	
	public List<Map<String, Object>> getTopLoserData(Map<String, Object> param) {
		param.put("ORDER_BY", "ASC");
		return sqlSession.selectList(NAMESPACE + "getTopLoserData", param);
	}
	
	public List<Map<String, Object>> getSnp500Data(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getSnp500Data", param);
	}
	
	public List<Map<String, Object>> getIndexData(Map<String, Object> param) {
		return sqlSession.selectList(NAMESPACE + "getIndexData", param);
	}

	public List<Map<String, Object>> getSnp500SectorCompanyCount() {
	    return sqlSession.selectList(NAMESPACE + "getSnp500SectorCompanyCount");
	}
	
	public List<Map<String, Object>> getHeatMapData(Map<String, Object> param) {
		String market = (String) param.get("market");
		List<Map<String, Object>> data = null;
		switch (market) {
		case "snp500":
			data = sqlSession.selectList(NAMESPACE + "getSNP500HeatMapData", param);
			break;
		case "dowjones":
			data = sqlSession.selectList(NAMESPACE + "getDowjonesHeatMapData", param);
			break;
		case "nasdaq100":
			data = sqlSession.selectList(NAMESPACE + "getNasdaq100HeatMapData", param);
			break;
		}
		return data;
	}
}
