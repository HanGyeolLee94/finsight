SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS INDEX_DATA;
SET FOREIGN_KEY_CHECKS = 1;
CREATE TABLE INDEX_DATA (
    INDEX_CODE VARCHAR(20) NOT NULL,       -- Identifier for the index (e.g., SP500, NASDAQ)
    DATE VARCHAR(10) NOT NULL,            -- Date in 'YYYY-MM-DD' format
    OPEN_VALUE DECIMAL(15, 6),            -- Opening value
    HIGH_VALUE DECIMAL(15, 6),            -- Highest value of the day
    LOW_VALUE DECIMAL(15, 6),             -- Lowest value of the day
    CLOSE_VALUE DECIMAL(15, 6),           -- Closing value
    VOLUME BIGINT,                        -- Trading volume
    DIVIDENDS DECIMAL(10, 6),             -- Dividends distributed
    STOCK_SPLITS DECIMAL(10, 6),          -- Stock split ratio
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Record update timestamp
    PRIMARY KEY (INDEX_CODE, DATE)        -- Composite primary key
);

