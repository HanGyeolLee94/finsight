@echo off
REM Call the config.bat file to load global configurations
call config.bat

REM Set log file path
set SQL_PATH=%SCRIPT_PATH%\view
set LOG_FILE=%LOG_PATH%\import_view.log

REM Initialize log file (clear any previous content)
echo . > %LOG_FILE%

REM Loop through all .sql files in the SCRIPT_PATH directory and subdirectories and import them
for /R %SQL_PATH% %%f in (*.sql) do (
    echo Importing %%f >> %LOG_FILE%
    %MYSQL_PATH% -u %USERNAME% -p%PASSWORD% -P %PORT% -h 127.0.0.1 %DATABASE% < %%f >> %LOG_FILE% 2>&1
    if %ERRORLEVEL% neq 0 (
        echo Error encountered while importing %%f >> %LOG_FILE%
    ) else (
        echo Successfully imported %%f >> %LOG_FILE%
    )
)

echo All SQL files have been imported. >> %LOG_FILE%
