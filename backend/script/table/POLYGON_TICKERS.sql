SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS POLYGON_TICKERS;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE POLYGON_TICKERS (
    TICKER VARCHAR(10) PRIMARY KEY, 
    NAME VARCHAR(255),
    MARKET VARCHAR(50),
    LOCALE VARCHAR(10),
    PRIMARY_EXCHANGE VARCHAR(50),
    TYPE VARCHAR(10),-- 자산유형
    ACTIVE BOOLEAN,
    CURRENCY_NAME VARCHAR(10),
    CIK VARCHAR(20),
    COMPOSITE_FIGI VARCHAR(50),
    SHARE_CLASS_FIGI VARCHAR(50),
    LAST_UPDATED_UTC VARCHAR(10),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 생성 날짜
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 수정 날짜
);