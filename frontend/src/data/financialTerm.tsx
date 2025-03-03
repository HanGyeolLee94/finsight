import { FinancialTreeItem } from "@/components/FinancialTermTreeView";

// Financial Performance: 재무 성과
// Market Value: 시장 가치
// Ratios & Margins: 비율 및 마진
// Cash Flow: 현금 흐름
// Stock Price & Volatility: 주가 및 변동성
// Trading Volume & Shares: 거래량 및 주식
// Dividends & Splits: 배당 및 분할
// Miscellaneous: 기타
export const FINANCIAL_TERMS_UPDATED: FinancialTreeItem[] = [
  {
    id: "financial-performance",
    label: "Financial Performance",
    children: [
      {
        id: "total-revenue",
        label: "Total Revenue",
        color: "blue",
        description:
          "Total money a company earns from its core business activities before any expenses are deducted.",
        example:
          "If a company sells 1,000 units of a product at $10 each, its total revenue is $10,000.",
      },
      {
        id: "cost-of-revenue",
        label: "Cost of Revenue",
        color: "blue",
        description:
          "The direct costs associated with producing and delivering a product or service.",
        example:
          "For a bakery, this includes the cost of flour, sugar, and baking labor.",
      },
      {
        id: "gross-profit",
        label: "Gross Profit",
        color: "blue",
        description:
          "The amount remaining after subtracting the cost of revenue from total revenue. It indicates how efficiently a company produces its goods or services.",
        example:
          "If total revenue is $10,000 and cost of revenue is $6,000, the gross profit is $4,000.",
      },

      {
        id: "operating-expense",
        label: "Operating Expense",
        color: "blue",
        description:
          "Costs related to running the day-to-day operations of a business that aren't tied directly to production.",
        example:
          "Salaries of office staff, rent for office space, and utility bills.",
      },
      {
        id: "operating-income",
        label: "Operating Income",
        color: "blue",
        description:
          "The profit a company makes from its core business operations after subtracting operating expenses.",
        example:
          "If gross profit is $4,000 and operating expenses are $2,000, operating income is $2,000.",
      },
      {
        id: "net-non-operating-interest-income-expense",
        label: "Net Non-Operating Interest Income/Expense",
        color: "blue",
        description:
          "Income or expense from activities unrelated to core operations, such as investments or loans.",
        example:
          "Interest received from a savings account or interest paid on a business loan.",
      },
      {
        id: "other-income-expense",
        label: "Other Income Expense",
        color: "blue",
        description:
          "Financial gains or losses not related to primary operations, such as selling an asset.",
        example: "A company sells an old machine and records a profit or loss.",
      },
      {
        id: "pretax-income",
        label: "Pretax Income",
        color: "blue",
        description:
          "Earnings before taxes are deducted, showing how profitable a company is before paying government taxes.",
        example:
          "If operating income is $2,000 and other expenses are $500, pretax income is $1,500.",
      },

      {
        id: "tax-provision",
        label: "Tax Provision",
        color: "blue",
        description:
          "The estimated amount of taxes a company expects to pay on its pretax income.",
        example:
          "If the company’s pretax income is $1,500 and the tax rate is 20%, the tax provision is $300.",
      },
      {
        id: "net-income-common-stockholders",
        label: "Net Income Common Stockholders",
        color: "blue",
        description:
          "The profit remaining for shareholders after all expenses, taxes, and preferred dividends are deducted.",
        example:
          "If a company earns $1,200 after expenses and pays $200 in preferred dividends, $1,000 is left for common stockholders.",
      },
      {
        id: "diluted-ni-available-to-common-stockholders",
        label: "Diluted NI Available to Common Stockholders",
        color: "blue",
        description:
          "Net income adjusted for the impact of all potential shares that could dilute earnings.",
        example: "Includes the effect of stock options being exercised.",
      },
      {
        id: "basic-eps",
        label: "Basic EPS (Earnings Per Share)",
        color: "blue",
        description:
          "Net income divided by the number of common shares outstanding, showing profitability per share.",
        example:
          "If net income is $1,000 and there are 500 shares, basic EPS is $2.",
      },
      {
        id: "diluted-eps",
        label: "Diluted EPS",
        color: "blue",
        description:
          "Earnings per share calculated assuming all convertible securities (e.g., stock options) are converted into shares.",
        example:
          "If net income is $1,000 and the diluted share count is 600, diluted EPS is $1.67.",
      },

      {
        id: "basic-average-shares",
        label: "Basic Average Shares",
        color: "blue",
        description:
          "The average number of common shares outstanding during a reporting period.",
        example:
          "If a company starts with 500 shares and issues 100 more midway through the year, the basic average shares are 550.",
      },
      {
        id: "diluted-average-shares",
        label: "Diluted Average Shares",
        color: "blue",
        description:
          "The average number of shares, including those from potential stock conversions.",
        example:
          "Includes additional shares from convertible bonds or options.",
      },
      {
        id: "total-operating-income-as-reported",
        label: "Total Operating Income as Reported",
        color: "blue",
        description:
          "The officially reported income from operations in financial statements.",
        example:
          "As shown in the annual report, it could be $5 million for a large corporation.",
      },
      {
        id: "total-expenses",
        label: "Total Expenses",
        color: "blue",
        description:
          "The sum of all costs and expenses incurred by the company, including operating and non-operating expenses.",
        example: "Salaries, rent, utility costs, and interest payments.",
      },
      {
        id: "net-income-from-continuing-and-discontinued-operations",
        label: "Net Income from Continuing & Discontinued Operations",
        color: "blue",
        description:
          "Combined profit from ongoing business and one-time profits or losses from discontinued operations.",
        example:
          "If a company sells a division for $1 million, the profit from that sale is included.",
      },

      {
        id: "normalized-income",
        label: "Normalized Income",
        color: "blue",
        description:
          "Adjusted net income that removes non-recurring items for better comparability across periods.",
        example: "Excluding one-time legal settlements.",
      },
      {
        id: "interest-expense",
        label: "Interest Expense",
        color: "blue",
        description: "The cost of borrowing money.",
        example: "A company pays $500 in interest on a loan.",
      },
      {
        id: "net-interest-income",
        label: "Net Interest Income",
        color: "blue",
        description:
          "The difference between interest earned and interest paid.",
        example:
          "A bank earns $1,000 in interest on loans and pays $200 on deposits, leaving $800 as net interest income.",
      },
      {
        id: "ebit",
        label: "EBIT (Earnings Before Interest and Taxes)",
        color: "blue",
        description:
          "Profit before deducting interest and tax expenses, showing operational profitability.",
        example: "If operating income is $3,000, EBIT is also $3,000.",
      },
      {
        id: "ebitda",
        label: "EBITDA",
        color: "blue",
        description:
          "Earnings before interest, taxes, depreciation, and amortization, often used as a measure of cash flow.",
        example:
          "Helps compare companies by ignoring non-cash and financing costs.",
      },

      {
        id: "reconciled-cost-of-revenue",
        label: "Reconciled Cost of Revenue",
        color: "blue",
        description:
          "Adjusted cost of revenue to account for discrepancies or updates.",
        example:
          "After reviewing, a company may revise the cost from $5,000 to $4,800.",
      },
      {
        id: "reconciled-depreciation",
        label: "Reconciled Depreciation",
        color: "blue",
        description:
          "Adjusted depreciation after reviewing asset values and useful life.",
        example: "Updated depreciation for a factory machine.",
      },
      {
        id: "net-income-from-continuing-operations",
        label: "Net Income from Continuing Operations",
        color: "blue",
        description:
          "Profit from ongoing business activities, excluding discontinued operations.",
        example: "The profit generated by the main product line.",
      },
      {
        id: "normalized-ebitda",
        label: "Normalized EBITDA",
        color: "blue",
        description: "Adjusted EBITDA, removing one-time or irregular items.",
        example: "Excluding the impact of a one-time equipment purchase.",
      },
      {
        id: "tax-rate-for-calcs",
        label: "Tax Rate for Calcs",
        color: "blue",
        description: "The effective tax rate used to calculate tax provisions.",
        example:
          "A company applies a tax rate of 25% to its pretax income for calculation.",
      },
    ],
  },
  {
    id: "market-value",
    label: "Market Value",
    children: [
      {
        id: "market-cap",
        label: "Market Cap (Market Capitalization)",
        color: "blue",
        description:
          "The total value of a company's outstanding shares, representing its size in the stock market.",
        example:
          "If a company has 1 million shares trading at $50 each, its market cap is $50 million.",
      },
      {
        id: "enterprise-value",
        label: "Enterprise Value (EV)",
        color: "blue",
        description:
          "A measure of a company's total value, including market cap, debt, and cash. It's often used for comparing companies with different capital structures.",
        example:
          "A company with a market cap of $50 million, debt of $10 million, and cash of $5 million has an EV of $55 million.",
      },
      {
        id: "trailing-pe",
        label: "Trailing P/E (Price-to-Earnings Ratio)",
        color: "blue",
        description:
          "The current stock price divided by the earnings per share (EPS) over the last 12 months. It shows how much investors are paying for each dollar of earnings.",
        example:
          "A stock trading at $100 with an EPS of $5 has a trailing P/E of 20.",
      },
      {
        id: "forward-pe",
        label: "Forward P/E",
        color: "blue",
        description:
          "The current stock price divided by estimated future earnings per share. It reflects investor expectations of future earnings.",
        example:
          "If a stock is $100 and next year’s estimated EPS is $8, the forward P/E is 12.5.",
      },
      {
        id: "peg-ratio-5yr-expected",
        label: "PEG Ratio (5yr Expected)",
        color: "blue",
        description:
          "The Price/Earnings-to-Growth ratio adjusts the P/E ratio for a company's expected earnings growth over 5 years. A lower PEG indicates better value.",
        example:
          "A company with a P/E of 20 and an annual earnings growth rate of 10% has a PEG of 2.",
      },
      {
        id: "price-sales-ratio",
        label: "Price/Sales (P/S Ratio)",
        color: "blue",
        description:
          "The stock price divided by the revenue per share. It shows how much investors pay for each dollar of sales.",
        example:
          "If a stock trades at $20 and revenue per share is $5, the P/S ratio is 4.",
      },
      {
        id: "price-book-ratio",
        label: "Price/Book (P/B Ratio)",
        color: "blue",
        description:
          "The stock price divided by the book value per share, indicating how much investors pay relative to the company's net assets.",
        example:
          "If a company’s stock trades at $50 and its book value per share is $25, the P/B ratio is 2.",
      },
      {
        id: "ev-revenue",
        label: "Enterprise Value/Revenue (EV/Revenue)",
        color: "blue",
        description:
          "EV divided by the company's revenue. It measures how a company’s total value compares to its sales.",
        example:
          "A company with an EV of $100 million and revenue of $25 million has an EV/Revenue of 4.",
      },
      {
        id: "ev-ebitda",
        label: "Enterprise Value/EBITDA",
        color: "blue",
        description:
          "EV divided by EBITDA, used to value companies and compare them across industries.",
        example:
          "A company with an EV of $120 million and EBITDA of $20 million has an EV/EBITDA of 6.",
      },
      {
        id: "market-cap-intraday",
        label: "Market Cap (Intraday)",
        color: "blue",
        description:
          "The total value of all outstanding shares, calculated using the current stock price.",
        example:
          "If the stock price is $45 and there are 148.34 million shares, the market cap is $6.675 billion.",
      },
    ],
  },
  {
    id: "ratios-and-margins",
    label: "Ratios & Margins",
    children: [
      {
        id: "profit-margin",
        label: "Profit Margin",
        color: "blue",
        description:
          "The percentage of revenue that turns into profit after all expenses are deducted.",
        example:
          "If revenue is $10,000 and profit is $2,000, the profit margin is 20%.",
      },
      {
        id: "operating-margin-ttm",
        label: "Operating Margin (ttm)",
        color: "blue",
        description:
          "The percentage of revenue left after covering operating expenses over the last 12 months.",
        example:
          "A company with $100 million in revenue and $10 million in operating profit has an operating margin of 10%.",
      },
      {
        id: "return-on-assets-ttm",
        label: "Return on Assets (ROA) (ttm)",
        color: "blue",
        description:
          "Measures how efficiently a company uses its assets to generate profit over the last 12 months.",
        example:
          "A ROA of 5% means the company earns $0.05 for every $1 of assets.",
      },
      {
        id: "return-on-equity-ttm",
        label: "Return on Equity (ROE) (ttm)",
        color: "blue",
        description:
          "Measures the return generated for shareholders' equity over the last 12 months.",
        example:
          "An ROE of 15% means the company earns $0.15 for every $1 of shareholders’ equity.",
      },
      {
        id: "quarterly-revenue-growth-yoy",
        label: "Quarterly Revenue Growth (yoy)",
        color: "blue",
        description:
          "The percentage increase in revenue compared to the same quarter of the previous year.",
        example:
          "If revenue in Q3 last year was $20 million and this year it's $25 million, growth is 25%.",
      },
      {
        id: "quarterly-earnings-growth-yoy",
        label: "Quarterly Earnings Growth (yoy)",
        color: "blue",
        description:
          "Percentage growth in net income compared to the same quarter last year.",
        example:
          "If net income last year was $5 million and this year it’s $6 million, the growth is 20%.",
      },
      {
        id: "total-debt-mrq",
        label: "Total Debt (mrq)",
        color: "blue",
        description:
          "The total liabilities a company owes at the end of the most recent quarter.",
        example:
          "A company with $200 million in loans and bonds has $200 million in total debt.",
      },
      {
        id: "total-debt-equity-mrq",
        label: "Total Debt/Equity (mrq)",
        color: "blue",
        description:
          "A ratio showing how much debt a company has compared to shareholders' equity.",
        example:
          "A ratio of 1.5 means the company has $1.50 of debt for every $1 of equity.",
      },
      {
        id: "current-ratio-mrq",
        label: "Current Ratio (mrq)",
        color: "blue",
        description:
          "Measures a company's ability to cover short-term liabilities with short-term assets.",
        example:
          "A ratio of 2 means the company has $2 in current assets for every $1 of current liabilities.",
      },
      {
        id: "payout-ratio",
        label: "Payout Ratio",
        color: "blue",
        description: "The percentage of earnings paid as dividends.",
        example:
          "If earnings are $5 per share and dividends are $2, the payout ratio is 40%.",
      },
    ],
  },
  {
    id: "cash-flow",
    label: "Cash Flow",
    children: [
      {
        id: "operating-cash-flow-ttm",
        label: "Operating Cash Flow (ttm)",
        color: "blue",
        description:
          "The cash generated from normal business operations over the last 12 months.",
        example:
          "If the company received $50 million in cash from sales and spent $30 million on operating expenses, operating cash flow is $20 million.",
      },
      {
        id: "levered-free-cash-flow-ttm",
        label: "Levered Free Cash Flow (ttm)",
        color: "blue",
        description:
          "The cash left after paying interest on debt over the last 12 months.",
        example:
          "If operating cash flow is $20 million and $5 million is paid in interest, levered free cash flow is $15 million.",
      },
      {
        id: "total-cash-mrq",
        label: "Total Cash (mrq)",
        color: "blue",
        description:
          "The total cash and cash equivalents available at the end of the most recent quarter.",
        example:
          "A company with $100 million in cash reserves has strong liquidity.",
      },
      {
        id: "total-cash-per-share-mrq",
        label: "Total Cash Per Share (mrq)",
        color: "blue",
        description:
          "Total cash divided by the number of shares outstanding at the end of the most recent quarter.",
        example:
          "If cash is $50 million and shares are 10 million, cash per share is $5.",
      },
      {
        id: "book-value-per-share-mrq",
        label: "Book Value Per Share (mrq)",
        color: "blue",
        description:
          "The net value of the company divided by the number of outstanding shares.",
        example:
          "If the company’s equity is $100 million and there are 10 million shares, book value per share is $10.",
      },
    ],
  },

  {
    id: "stock-price-and-volatility",
    label: "Stock Price & Volatility",
    children: [
      {
        id: "beta-5y-monthly",
        label: "Beta (5Y Monthly)",
        color: "blue",
        description:
          "A measure of a stock's volatility compared to the overall market over five years. A beta greater than 1 means the stock is more volatile than the market.",
        example:
          "A beta of 1.5 indicates the stock is 50% more volatile than the market.",
      },
      {
        id: "52-week-range",
        label: "52 Week Range",
        color: "blue",
        description:
          "The lowest and highest stock prices over the past 52 weeks.",
        example:
          "If the range is $50–$100, the stock price has fluctuated between $50 and $100 in the last year.",
      },
      {
        id: "52-week-high",
        label: "52 Week High",
        color: "blue",
        description:
          "The highest price the stock traded at in the past 52 weeks.",
        example:
          "If the highest price was $120, it means the stock reached $120 at some point during the year.",
      },
      {
        id: "52-week-low",
        label: "52 Week Low",
        color: "blue",
        description:
          "The lowest price the stock traded at in the past 52 weeks.",
        example:
          "A stock trading as low as $80 in the year had a 52-week low of $80.",
      },

      {
        id: "50-day-moving-average",
        label: "50-Day Moving Average",
        color: "blue",
        description:
          "The average stock price over the last 50 trading days, recalculated daily.",
        example:
          "If the average is $95, it indicates the stock’s recent performance trend.",
      },
      {
        id: "200-day-moving-average",
        label: "200-Day Moving Average",
        color: "blue",
        description:
          "The average stock price over the last 200 trading days, providing a longer-term trend.",
        example:
          "If the average is $90, it shows the stock’s long-term momentum.",
      },
      {
        id: "previous-close",
        label: "Previous Close",
        color: "blue",
        description: "The stock price at the end of the previous trading day.",
        example:
          "If the stock closed at $42.73 yesterday, this value is $42.73.",
      },
      {
        id: "open",
        label: "Open",
        color: "blue",
        description:
          "The stock price at the beginning of the current trading day.",
        example:
          "If trading started at $43.56 today, the open price is $43.56.",
      },
      {
        id: "bid",
        label: "Bid",
        color: "blue",
        description:
          "The highest price buyers are willing to pay for the stock and the quantity available.",
        example:
          "A bid of 45.14 × 400 means buyers are offering $45.14 for up to 400 shares.",
      },
      {
        id: "ask",
        label: "Ask",
        color: "blue",
        description:
          "The lowest price sellers are willing to accept for the stock and the quantity available.",
        example:
          "An ask of 45.38 × 400 means sellers are asking $45.38 for up to 400 shares.",
      },
      {
        id: "days-range",
        label: "Day's Range",
        color: "blue",
        description:
          "The lowest and highest prices the stock has traded at during the current trading day.",
        example:
          "A range of 43.34 – 45.30 means the stock traded between these prices today.",
      },
      {
        id: "pe-ratio-ttm",
        label: "PE Ratio (TTM)",
        color: "blue",
        description:
          "The price-to-earnings ratio over the trailing twelve months. It reflects how much investors are paying for $1 of earnings.",
        example:
          "A PE ratio of 11.32 means investors are paying $11.32 for every $1 of earnings.",
      },
      {
        id: "eps-ttm",
        label: "EPS (TTM)",
        color: "blue",
        description:
          "Earnings per share over the trailing twelve months, indicating profitability per share.",
        example:
          "An EPS of $4.00 means the company earned $4 per share in the last 12 months.",
      },
      {
        id: "1y-target-est",
        label: "1y Target Est",
        color: "blue",
        description:
          "The projected stock price over the next 12 months, based on analyst estimates.",
        example:
          "A target estimate of $51.90 suggests analysts expect the stock price to reach $51.90 within a year.",
      },
      {
        id: "sp500-52-week-change",
        label: "S&P 500 52-Week Change",
        color: "blue",
        description:
          "The percentage change in the S&P 500 index over the past year.",
        example:
          "A 10% increase means the index rose by 10% over the last 52 weeks.",
      },
    ],
  },
  {
    id: "trading-volume-and-shares",
    label: "Trading Volume & Shares",
    children: [
      {
        id: "avg-vol-3-month",
        label: "Avg Vol (3 Month)",
        color: "blue",
        description:
          "The average daily trading volume over the past three months.",
        example:
          "If the average is 2 million shares, that’s the daily trading volume.",
      },
      {
        id: "avg-vol-10-day",
        label: "Avg Vol (10 Day)",
        color: "blue",
        description: "The average daily trading volume over the last 10 days.",
        example:
          "A recent average of 1.5 million shares indicates current interest in the stock.",
      },
      {
        id: "shares-outstanding",
        label: "Shares Outstanding",
        color: "blue",
        description:
          "The total number of shares issued by the company and held by investors.",
        example:
          "If a company has issued 100 million shares, that’s the shares outstanding.",
      },
      {
        id: "implied-shares-outstanding",
        label: "Implied Shares Outstanding",
        color: "blue",
        description:
          "The number of shares that could be outstanding if all convertible securities are exercised.",
        example:
          "Includes potential shares from options and convertible bonds.",
      },

      {
        id: "float",
        label: "Float",
        color: "blue",
        description:
          "The number of shares available for public trading, excluding insider holdings.",
        example:
          "A float of 80 million shares means 80 million are available for trading.",
      },
      {
        id: "percent-held-by-insiders",
        label: "% Held by Insiders",
        color: "blue",
        description:
          "The percentage of shares owned by company executives, directors, or key stakeholders.",
        example: "If insiders hold 15%, they own 15% of the company’s shares.",
      },
      {
        id: "percent-held-by-institutions",
        label: "% Held by Institutions",
        color: "blue",
        description:
          "The percentage of shares owned by institutional investors, like mutual funds or pension funds.",
        example:
          "If institutions hold 60%, most shares are owned by large investors.",
      },
      {
        id: "shares-short",
        label: "Shares Short",
        color: "blue",
        description:
          "The total shares borrowed and sold by investors expecting the stock price to fall",
        example:
          "If 2 million shares are shorted, those shares are borrowed for short selling.",
      },
      {
        id: "short-ratio",
        label: "Short Ratio",
        color: "blue",
        description:
          "The number of days it would take for short sellers to cover their positions, based on average daily trading volume.",
        example:
          "If 2 million shares are shorted and the daily volume is 1 million, the short ratio is 2.",
      },
      {
        id: "short-percent-of-float",
        label: "Short % of Float",
        color: "blue",
        description: "The percentage of the float currently sold short.",
        example:
          "If the float is 80 million shares and 8 million are shorted, the short % of float is 10%.",
      },
      {
        id: "short-percent-of-shares-outstanding",
        label: "Short % of Shares Outstanding",
        color: "blue",
        description:
          "The percentage of total shares outstanding that are sold short.",
        example:
          "If 10 million of 100 million shares are shorted, the short % of shares outstanding is 10%.",
      },
      {
        id: "volume",
        label: "Volume",
        color: "blue",
        description:
          "The total number of shares traded during the current trading day.",
        example:
          "If 2,127,873 shares changed hands today, the volume is 2,127,873.",
      },
      {
        id: "avg-volume",
        label: "Avg. Volume",
        color: "blue",
        description:
          "The average daily trading volume over a specified period (e.g., three months).",
        example:
          "An average volume of 2,651,448 suggests the stock typically trades about 2.65 million shares daily.",
      },
    ],
  },
  {
    id: "dividends-and-splits",
    label: "Dividends & Splits",
    children: [
      {
        id: "forward-annual-dividend-rate",
        label: "Forward Annual Dividend Rate",
        color: "blue",
        description:
          "The projected annual dividend per share based on the current dividend policy.",
        example:
          "If a company declares quarterly dividends of $0.50, the annual rate is $2.",
      },
      {
        id: "forward-annual-dividend-yield",
        label: "Forward Annual Dividend Yield",
        color: "blue",
        description:
          "The annual dividend as a percentage of the current stock price.",
        example:
          "If the stock price is $100 and the annual dividend is $2, the yield is 2%.",
      },
      {
        id: "trailing-annual-dividend-rate",
        label: "Trailing Annual Dividend Rate",
        color: "blue",
        description:
          "The total dividend paid per share over the last 12 months.",
        example:
          "If a company paid $0.40 per quarter, the trailing annual rate is $1.60.",
      },
      {
        id: "trailing-annual-dividend-yield",
        label: "Trailing Annual Dividend Yield",
        color: "blue",
        description:
          "The annual dividend as a percentage of the stock price, based on past payouts.",
        example: "A $1.60 annual dividend on a $80 stock gives a yield of 2%.",
      },

      {
        id: "5-year-average-dividend-yield",
        label: "5-Year Average Dividend Yield",
        color: "blue",
        description:
          "The average annual dividend yield over the past five years.",
        example:
          "If yields were 2%, 3%, 3%, 2.5%, and 2.8%, the average is 2.66%.",
      },

      {
        id: "dividend-date",
        label: "Dividend Date",
        color: "blue",
        description:
          "The date when the company pays out dividends to shareholders.",
        example:
          "If the dividend date is December 1, shareholders receive their payment on that date.",
      },
      {
        id: "ex-dividend-date",
        label: "Ex-Dividend Date",
        color: "blue",
        description:
          "The cutoff date to be eligible for a dividend. If you buy the stock on or after this date, you won’t receive the dividend.",
        example:
          "If the ex-dividend date is November 28, buying the stock on November 29 makes you ineligible.",
      },
      {
        id: "last-split-factor",
        label: "Last Split Factor",
        color: "blue",
        description: "The ratio of the last stock split.",
        example:
          "A 2-for-1 split means shareholders receive two shares for every one share they own.",
      },
      {
        id: "last-split-date",
        label: "Last Split Date",
        color: "blue",
        description: "The date when the most recent stock split occurred.",
        example:
          "If the split date is October 15, shareholders saw their shares split on that day.",
      },

      {
        id: "forward-dividend-yield",
        label: "Forward Dividend & Yield",
        color: "blue",
        description:
          "The projected annual dividend and its yield, based on the current stock price.",
        example:
          "If the dividend is $2 and the stock price is $50, the yield is 4%.",
      },
    ],
  },

  {
    id: "miscellaneous",
    label: "Miscellaneous",
    children: [
      {
        id: "fiscal-year-ends",
        label: "Fiscal Year Ends",
        color: "blue",
        description:
          "The end date of a company's accounting year, which may differ from the calendar year.",
        example:
          "A fiscal year ending on December 31 is the same as the calendar year, while one ending on March 31 is different.",
      },
      {
        id: "most-recent-quarter",
        label: "Most Recent Quarter (mrq)",
        color: "blue",
        description:
          "Refers to the latest completed three-month reporting period.",
        example:
          "If today is October 2025, the most recent quarter might be July–September 2025.",
      },
      {
        id: "earnings-date",
        label: "Earnings Date",
        color: "blue",
        description:
          "The date when the company is scheduled to release its earnings report.",
        example:
          "An earnings date of Jan 28, 2025, means the report will be released on that day.",
      },
      {
        id: "revenue-ttm",
        label: "Revenue (ttm)",
        color: "blue",
        description:
          "The total income from sales or services over the last 12 months.",
        example:
          "A company generating $500 million in sales has $500 million in revenue.",
      },
      {
        id: "revenue-per-share-ttm",
        label: "Revenue Per Share (ttm)",
        color: "blue",
        description:
          "Revenue divided by the number of outstanding shares over the last 12 months.",
        example:
          "If revenue is $100 million and there are 10 million shares, revenue per share is $10.",
      },
      {
        id: "gross-profit-ttm",
        label: "Gross Profit (ttm)",
        color: "blue",
        description:
          "Revenue minus the cost of revenue over the last 12 months.",
        example:
          "If revenue is $500,000 and the cost of goods sold is $300,000, gross profit is $200,000.",
      },
      {
        id: "net-income-available-to-common-ttm",
        label: "Net Income Available to Common (ttm)",
        color: "blue",
        description:
          "Profit remaining for common shareholders after all expenses, taxes, and dividends over the last 12 months.",
        example:
          "If net income is $10 million, and preferred dividends are $1 million, $9 million is available to common shareholders.",
      },
      {
        id: "diluted-eps-ttm",
        label: "Diluted EPS (ttm)",
        color: "blue",
        description:
          "Earnings per share considering all possible dilutive securities over the last 12 months.",
        example:
          "A company with $10 million in net income and 2 million diluted shares has a diluted EPS of $5.",
      },
    ],
  },
];
