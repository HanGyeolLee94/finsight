SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS POLYGON_TICKER_TYPES;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE POLYGON_TICKER_TYPES (
    CODE VARCHAR(20) PRIMARY KEY,
    DESCRIPTION VARCHAR(255),
    ASSET_CLASS VARCHAR(100),
    LOCALE VARCHAR(50),
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

