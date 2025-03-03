DELETE FROM SCHEDULER_INFO; 
INSERT INTO SCHEDULER_INFO (SCHEDULE_ID, CLASS_NAME, METHOD_NAME, CRON_EXPRESSION, DESCRIPTION, ENABLED)
VALUES ('UPDATE_INDEX_CONSTITUENT','com.finsight.lab.scheduler.IndexConstituentUpdateScheduler', 'update', '0 0 8 * * ?', 'Updates the financial data (including market, EPS, and other indicators) for S&P 500, Nasdaq 100, and Dow Jones', 'Y');
INSERT INTO SCHEDULER_INFO (SCHEDULE_ID, CLASS_NAME, METHOD_NAME, CRON_EXPRESSION, DESCRIPTION, ENABLED)
VALUES ('FETCH_INDEX_DATA','com.finsight.lab.scheduler.IndexDataUpdateScheduler', 'fetchIndexData', '0 0 9 * * ?', 'Fetches and updates index data, including market values and financial metrics, for S&P 500, Nasdaq, and Dow Jones', 'Y');
INSERT INTO SCHEDULER_INFO (
    SCHEDULE_ID, 
    CLASS_NAME, 
    METHOD_NAME, 
    CRON_EXPRESSION, 
    DESCRIPTION, 
    ENABLED
) VALUES (
    'UPDATE_RSI_DATA',
    'com.finsight.lab.scheduler.RSIUpdateScheduler', 
    'updateRSI', 
    '0 0 3 * * ?', 
    'Updates the RSI (Relative Strength Index) for all stocks.', 
    'Y'
);
COMMIT;
