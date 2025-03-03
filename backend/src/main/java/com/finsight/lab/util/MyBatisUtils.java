package com.finsight.lab.util;

import java.util.Map;

import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyBatisUtils {

    private static final Logger logger = LoggerFactory.getLogger(MyBatisUtils.class);
    private static SqlSessionFactory sqlSessionFactory;

    // Static initializer for SqlSessionFactory
    public static void setSqlSessionFactory(SqlSessionFactory sessionFactory) {
        if (sqlSessionFactory == null) {
            sqlSessionFactory = sessionFactory;
        }
    }

    // Batch session 생성 함수
    public static SqlSession getBatchSession() {
        if (sqlSessionFactory == null) {
            throw new IllegalStateException("SqlSessionFactory is not initialized.");
        }
        return sqlSessionFactory.openSession(ExecutorType.BATCH);
    }

    // 배치 flush 및 캐시 초기화 처리
    public static void flushBatch(SqlSession batchSession) {
        try {
        	batchSession.flushStatements(); // 배치 실행
            batchSession.commit(); // 커밋
        } catch (Exception e) {
            logger.error("Failed to flush batch statements.", e);
        }
    }

    // Threshold-based batch update helper
    public static int batchUpdateWithThreshold(SqlSession batchSession, String statement, 
                                               Map<String, Object> paramMap, int threshold, int counter) {
        batchSession.update(statement, paramMap);
        counter++;
        
        // If the threshold is reached, flush the batch
        if (counter >= threshold) {
            flushBatch(batchSession);
            counter = 0; // Reset the counter after flushing
        }
        
        return counter;
    }

    // 예외 발생 시 롤백 및 세션 종료 처리
    public static void handleExceptionAndClose(SqlSession batchSession, Exception e) {
        try {
            logger.error("Error occurred during batch operation", e);  // 예외 로그 출력
            if (batchSession != null) {
                batchSession.rollback();  // 트랜잭션 롤백
            }
        } finally {
            closeSession(batchSession);  // 세션 닫기
        }
    }

    // 세션 종료 처리
    public static void closeSession(SqlSession batchSession) {
        if (batchSession != null) {
            try {
                batchSession.close();  // 세션 닫기
                logger.debug("Session closed successfully.");
            } catch (Exception e) {
                logger.error("Failed to close session.", e);
            }
        }
    }
}
