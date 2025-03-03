import yfinance as yf
import json
import sys

# Fetch historical data for a given index
def fetch_index_data(ticker, period="max"):  # Accept ticker as a parameter
    index = yf.Ticker(ticker)  # Create ticker object for the given symbol
    data = index.history(period=period)  # Use the specified period
    data.reset_index(inplace=True)  # Convert the index to a column
    return data

# Convert data to JSON and print
def export_data_to_json(data):
    # Ensure that 'Date' is converted to string format
    data['Date'] = data['Date'].dt.strftime('%Y-%m-%d')  # Convert to 'YYYY-MM-DD' format
    # Convert the DataFrame to a list of dictionaries (JSON-serializable)
    json_data = data.to_dict(orient="records")
    print(json.dumps(json_data))  # Print JSON to stdout for Java to read

# Main execution
if __name__ == "__main__":
    # Pass ticker symbol and period as command-line arguments, defaults to "max" if not provided
    ticker = sys.argv[1] if len(sys.argv) > 1 else "^GSPC"  # Default to S&P 500 if no ticker is provided
    period = sys.argv[2] if len(sys.argv) > 2 else "max"  # Default to "max" if no period is provided
    
    # Fetch data for the given ticker
    data = fetch_index_data(ticker, period)
    
    # Export the data to JSON
    export_data_to_json(data)
