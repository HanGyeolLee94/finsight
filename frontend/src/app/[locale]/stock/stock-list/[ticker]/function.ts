export const formatChange = (value?: number) =>
  value != null ? value.toFixed(2) : "--";
// Helper function to format data into 4 columns for DynamicInfoContainer
export const formatDataForDisplay = (data: any, t: (key: string) => string) => {
  // Helper function to format numbers with commas and a maximum of 3 decimal places
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(value);

  // Helper function to format Market Cap as Millions or Billions
  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${formatNumber(value / 1_000_000_000)}B`; // Format as billions
    } else if (value >= 1_000_000) {
      return `${formatNumber(value / 1_000_000)}M`; // Format as millions
    }
    return formatNumber(value); // Format as plain number if less than 1 million
  };

  const displayItems = [
    {
      title: t("ijeonjongga"), // Previous Close
      value:
        data.PREVIOUS_CLOSE != null ? formatNumber(data.PREVIOUS_CLOSE) : "--",
      tooltip:
        "The last trading price of the stock. 주식의 마지막 거래 가격입니다.",
    },
    {
      title: t("siga"), // Open
      value: data.OPEN_PRICE != null ? formatNumber(data.OPEN_PRICE) : "--",
      tooltip:
        "The opening price of the stock for the day. 당일 주식의 시작 가격입니다.",
    },
    {
      title: t("ililbeomwi"), // Day's Range
      value:
        data.DAY_LOW != null && data.DAY_HIGH != null
          ? `${formatNumber(data.DAY_LOW)} - ${formatNumber(data.DAY_HIGH)}`
          : "--",
      tooltip:
        "The lowest and highest trading price during the day. 하루 동안의 최저 및 최고 거래 가격입니다.",
    },
    {
      title: t("52jubeomwi"), // 52 Week Range
      value:
        data.YEAR_LOW != null && data.YEAR_HIGH != null
          ? `${formatNumber(data.YEAR_LOW)} - ${formatNumber(data.YEAR_HIGH)}`
          : "--",
      tooltip:
        "The lowest and highest price over the past 52 weeks. 지난 52주 동안의 최저 및 최고 가격입니다.",
    },
    {
      title: t("sigachonggaek"), // Market Cap
      value: data.MARKET_CAP != null ? formatMarketCap(data.MARKET_CAP) : "--",
      tooltip:
        "The total value of all outstanding shares. 모든 발행 주식의 총 가치입니다. Formula: Market Cap = Current Share Price × Outstanding Shares",
    },
    {
      title: t("beta"), // Beta
      value: data.BETA != null ? formatNumber(data.BETA) : "--",
      tooltip:
        "The volatility of the stock compared to the market. 주식의 시장 대비 변동성을 나타냅니다. 값이 1보다 크면 시장보다 변동성이 더 큽니다.",
    },
    {
      title: t("jugasooigbiwoolttm"), // PE Ratio (TTM)
      value: data.PE != null ? formatNumber(data.PE) : "--",
      tooltip:
        "The price-to-earnings ratio based on trailing twelve months earnings. 지난 12개월 실적을 기준으로 한 주가수익비율입니다. Formula: PE Ratio = Current Share Price ÷ Earnings Per Share (EPS)",
    },
    {
      title: t("judangsuniigtm"), // EPS (TTM)
      value: data.EPS != null ? formatNumber(data.EPS) : "--",
      tooltip:
        "Earnings per share for the trailing twelve months. 지난 12개월 동안의 주당 순이익입니다. Formula: EPS = Net Income ÷ Outstanding Shares",
    },
    {
      title: t("georaeryang"), // Volume
      value: data.VOLUME != null ? formatNumber(data.VOLUME) : "--",
      tooltip:
        "The number of shares traded during the day. 하루 동안 거래된 주식 수입니다.",
    },
    {
      title: t("pyeonggyungeoraeryang"), // Average Volume
      value: data.AVG_VOLUME != null ? formatNumber(data.AVG_VOLUME) : "--",
      tooltip:
        "The average number of shares traded per day. 일일 평균 거래량입니다.",
    },
    {
      title: t("silljeogballyoil"), // Earnings Date
      value: data.EARNINGS_ANNOUNCEMENT ?? "--",
      tooltip:
        "The scheduled date for the company's earnings announcement. 회사의 실적 발표 예정 날짜입니다.",
    },
    {
      title: t("1nyeonmogpyo"), // 1 Year Target Est
      value: data.TARGET_EST != null ? formatNumber(data.TARGET_EST) : "--",
      tooltip:
        "The stock's target price estimate for the next year. 향후 1년 동안의 주식 목표 가격입니다.",
    },
    {
      title: "RSI (14)",
      value: data.RSI != null ? formatNumber(data.RSI) : "--",
      tooltip:
        "Relative Strength Index (RSI) is a momentum oscillator that measures the speed and change of price movements. " +
        "A value above 70 suggests that the stock may be overbought (potentially overvalued), " +
        "while a value below 30 suggests that the stock may be oversold (potentially undervalued). " +
        "RSI 값이 70 이상이면 과매수 상태로 가격 조정 가능성이 있으며, 30 이하이면 과매도 상태로 반등 가능성이 있습니다.",
    },
  ];

  // Split displayItems into sub-arrays of up to 4 items each
  const columns = [];
  for (let i = 0; i < displayItems.length; i += 4) {
    columns.push(displayItems.slice(i, i + 4));
  }
  return columns;
};
