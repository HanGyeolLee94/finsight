SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS POLYGON_TICKER_DETAIL;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE POLYGON_TICKER_DETAIL (
    TICKER VARCHAR(10),  -- Ticker symbol
    MARKET_CAP BIGINT,  -- Market capitalization
    PHONE_NUMBER VARCHAR(20),  -- Company's phone number
    ADDRESS1 VARCHAR(255),  -- Address line 1
    CITY VARCHAR(100),  -- City
    STATE VARCHAR(10),  -- State abbreviation
    POSTAL_CODE VARCHAR(10),  -- Postal code
    DESCRIPTION TEXT,  -- Company description
    SIC_CODE VARCHAR(10),  -- Standard Industrial Classification code
    SIC_DESCRIPTION VARCHAR(255),  -- SIC code description
    TICKER_ROOT VARCHAR(10),  -- Root ticker symbol
    HOMEPAGE_URL VARCHAR(255),  -- Company's homepage URL
    TOTAL_EMPLOYEES INT,  -- Number of total employees
    LIST_DATE VARCHAR(10),  -- Date the company was listed
    LOGO_URL VARCHAR(255),  -- URL for company logo
    ICON_URL VARCHAR(255),  -- URL for company icon
    SHARE_CLASS_SHARES_OUTSTANDING BIGINT,  -- Number of shares outstanding for the share class
    WEIGHTED_SHARES_OUTSTANDING BIGINT,  -- Number of weighted shares outstanding
    ROUND_LOT INT,  -- Number of shares in a round lot
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Creation timestamp
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Last updated timestamp
);
