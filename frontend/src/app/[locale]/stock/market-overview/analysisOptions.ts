export const getAnalysisConditions = (analysisTypes: string[]) => {
  const combinedConditions: Record<string, any> = {};

  analysisTypes.forEach((type) => {
    switch (type) {
      case "TOP_GAINERS":
        combinedConditions.limit = 30;
        combinedConditions.offset = 0;
        combinedConditions.order = "CHANGES_PERCENTAGE DESC";
        break;
      case "TOP_LOSERS":
        combinedConditions.limit = 30;
        combinedConditions.offset = 0;
        combinedConditions.order = "CHANGES_PERCENTAGE ASC";
        break;
      case "SP500":
        combinedConditions.filter = "SP500";
        //SlickCharts S&P 500
        break;
      default:
        break;
    }
  });

  // If SP500 is in the list, remove 'limit'
  if (analysisTypes.includes("SP500")) {
    delete combinedConditions.limit;
  }

  return combinedConditions;
};
