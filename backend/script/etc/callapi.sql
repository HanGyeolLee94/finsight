# postman 에서 실행
getAllTickers (Get)
http://localhost:8080/api/polygon/all-tickers?type=CS

updateTickerDetails (Get)
http://localhost:8080/api/polygon/update-ticker-details

getTickerTypes
http://localhost:8080/api/polygon/ticker-types

# Get ticker
http://localhost:8080/api/polygon/tickers?active=true&limit=1&type=CS&ticker=NXT

#getDailyOpenClose
http://localhost:8080/api/polygon/daily-open-close?ticker=NXT&date=2024-10-02

#getDailyOpenCloseInRange
