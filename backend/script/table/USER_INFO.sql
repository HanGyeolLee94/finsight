SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS USER_INFO;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE USER_INFO (
    USER_ID INT AUTO_INCREMENT PRIMARY KEY,           -- Unique user ID
    USERNAME VARCHAR(50) NOT NULL,                    -- Username
    EMAIL VARCHAR(100) NOT NULL,                      -- Email address
    PASSWORD_HASH VARCHAR(255) NOT NULL,              -- Password hash
    ROLE_ID VARCHAR(50),                              -- Role ID for user permissions
    USE_YN VARCHAR(1) NOT NULL DEFAULT 'Y',           -- Active status
    PASSWORD_RESET_REQUIRED VARCHAR(1) NOT NULL DEFAULT 'N',
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Creation date
    UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Last update date
    DEFAULT_PAGE VARCHAR(255)         -- Default page path for the user
);
