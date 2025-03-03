// 공통적으로 사용되는 컬럼 리스트
const incomeStatementColumns = [
  { code: "maechulaeg", column: "REVENUE" }, // 매출액
  { code: "maechulwonga", column: "COST_OF_REVENUE" }, // 매출원가
  { code: "maechulchongig", column: "GROSS_PROFIT" }, // 매출총이익
  { code: "maechulchongiglyul", column: "GROSS_PROFIT_RATIO" }, // 매출총이익률
  {
    code: "panmaebiwa ilbangwanlibi",
    column: "SELLING_GENERAL_AND_ADMINISTRATIVE_EXPENSES",
  }, // 판매비와 일반관리비
  { code: "yeongugaeobalbi", column: "RESEARCH_AND_DEVELOPMENT_EXPENSES" }, // 연구개발비
  { code: "ilbangwanlibi", column: "GENERAL_AND_ADMINISTRATIVE_EXPENSES" }, // 일반관리비
  { code: "gamgasanggakbi", column: "DEPRECIATION_AND_AMORTIZATION" }, // 감가상각비
  { code: "yeongeobiyong chonghab", column: "OPERATING_EXPENSES" }, // 영업비용 총합
  { code: "yeongeobig", column: "OPERATING_INCOME" }, // 영업이익
  { code: "ijasuig", column: "INTEREST_INCOME" }, // 이자 수익
  { code: "ijabiyong", column: "INTEREST_EXPENSE" }, // 이자 비용
  { code: "gitabiyong", column: "OTHER_EXPENSES" }, // 기타비용
  {
    code: "gitasuiggwa biyong sun-aeg",
    column: "TOTAL_OTHER_INCOME_EXPENSES_NET",
  }, // 기타 수익과 비용 순액
  { code: "sejeonig", column: "INCOME_BEFORE_TAX" }, // 세전이익
  { code: "sejeoniglyul", column: "INCOME_BEFORE_TAX_RATIO" }, // 세전이익률
  { code: "beobinse biyong", column: "INCOME_TAX_EXPENSE" }, // 법인세 비용
  { code: "sunuig", column: "NET_INCOME" }, // 순이익
  { code: "sunuiglyul", column: "NET_INCOME_RATIO" }, // 순이익률
  { code: "ija, segam, gamgasanggakbi chagam jeon ig", column: "EBITDA" }, // 이자, 세금, 감가상각비 차감 전 이익
  { code: "ebitda biyul", column: "EBITDARATIO" }, // EBITDA 비율
  { code: "judangsunuig", column: "EPS" }, // 주당순이익
  { code: "huisog judangsunuig", column: "EPS_DILUTED" }, // 희석 주당순이익
  { code: "huisog jusigsu", column: "WEIGHTED_AVERAGE_SHS_OUT_DIL" }, // 희석 주식 수
  { code: "pyeonggyun balhaeng jusigsu", column: "WEIGHTED_AVERAGE_SHS_OUT" }, // 평균 발행 주식 수
  {
    code: "panmae mit makeuding biyong",
    column: "SELLING_AND_MARKETING_EXPENSES",
  }, // 판매 및 마케팅 비용
  { code: "chong biyong", column: "COST_AND_EXPENSES" }, // 총 비용
  { code: "bogoilja", column: "DATE" }, // 보고 일자
  { code: "bogotonghwa", column: "REPORTED_CURRENCY" }, // 보고 통화
];

const balanceSheetColumns = [
  // Current Assets
  {
    code: "hyeongeummicheongeumdeunggamul",
    column: "CASH_AND_CASH_EQUIVALENTS",
  }, // 현금 및 현금 등가물
  { code: "danggitucha", column: "SHORT_TERM_INVESTMENTS" }, // 단기 투자
  {
    code: "hyeongeummidanggituchaheobgye",
    column: "CASH_AND_SHORT_TERM_INVESTMENTS",
  }, // 현금 및 단기 투자 합계
  { code: "sunsuikkgeum", column: "NET_RECEIVABLES" }, // 순수익금
  { code: "jaegojasan", column: "INVENTORY" }, // 재고 자산
  { code: "gitayudongjasan", column: "OTHER_CURRENT_ASSETS" }, // 기타 유동 자산
  { code: "chongyudongjasan", column: "TOTAL_CURRENT_ASSETS" }, // 총 유동 자산

  // Non-Current Assets
  { code: "sunsulbisasanmitchangbi", column: "PROPERTY_PLANT_EQUIPMENT_NET" }, // 순설비, 자산 및 장비
  { code: "yeongeopgwon", column: "GOODWILL" }, // 영업권
  { code: "muhyeongjasan", column: "INTANGIBLE_ASSETS" }, // 무형 자산
  {
    code: "yeongeopgwonmimuhyeongjasan",
    column: "GOODWILL_AND_INTANGIBLE_ASSETS",
  }, // 영업권 및 무형 자산
  { code: "janggitucha", column: "LONG_TERM_INVESTMENTS" }, // 장기 투자
  { code: "segyeumjasan", column: "TAX_ASSETS" }, // 세금 자산
  { code: "gitabiyudongjasan", column: "OTHER_NON_CURRENT_ASSETS" }, // 기타 비유동 자산
  { code: "chongbiyudongjasan", column: "TOTAL_NON_CURRENT_ASSETS" }, // 총 비유동 자산

  // Total Assets
  { code: "gitajasan", column: "OTHER_ASSETS" }, // 기타 자산
  { code: "chongjasan", column: "TOTAL_ASSETS" }, // 총 자산

  // Current Liabilities
  { code: "mijigeumgeum", column: "ACCOUNT_PAYABLES" }, // 미지급금
  { code: "danggibuchae", column: "SHORT_TERM_DEBT" }, // 단기 부채
  { code: "napbuseaek", column: "TAX_PAYABLES" }, // 납부세액
  { code: "iyeonsuik", column: "DEFERRED_REVENUE" }, // 이연 수익
  { code: "gitayudongbuchae", column: "OTHER_CURRENT_LIABILITIES" }, // 기타 유동 부채
  { code: "chongyudongbuchae", column: "TOTAL_CURRENT_LIABILITIES" }, // 총 유동 부채

  // Non-Current Liabilities
  { code: "janggibuchae", column: "LONG_TERM_DEBT" }, // 장기 부채
  { code: "biyudongiyeonsuik", column: "DEFERRED_REVENUE_NON_CURRENT" }, // 비유동 이연 수익
  {
    code: "biyudongiyeonsegeumbuchae",
    column: "DEFERRED_TAX_LIABILITIES_NON_CURRENT",
  }, // 비유동 이연 세금 부채
  { code: "gitabiyudongbuchae", column: "OTHER_NON_CURRENT_LIABILITIES" }, // 기타 비유동 부채
  { code: "chongbiyudongbuchae", column: "TOTAL_NON_CURRENT_LIABILITIES" }, // 총 비유동 부채

  // Total Liabilities
  { code: "gitabuchae", column: "OTHER_LIABILITIES" }, // 기타 부채
  { code: "jabonimdaeuihu", column: "CAPITAL_LEASE_OBLIGATIONS" }, // 자본 임대 의무
  { code: "chongbuchae", column: "TOTAL_LIABILITIES" }, // 총 부채

  // Equity
  { code: "useonju", column: "PREFERRED_STOCK" }, // 우선주
  { code: "botongju", column: "COMMON_STOCK" }, // 보통주
  { code: "igigingeogeum", column: "RETAINED_EARNINGS" }, // 이익 잉여금
  {
    code: "gitapogwasoneingyegyaeak",
    column: "ACCUMULATED_OTHER_COMPREHENSIVE_INCOME_LOSS",
  }, // 기타포괄손익누계액
  { code: "gitajujujabonheobgye", column: "OTHER_TOTAL_STOCKHOLDERS_EQUITY" }, // 기타 주주 자본 합계
  { code: "chongjujujabon", column: "TOTAL_STOCKHOLDERS_EQUITY" }, // 총 주주 자본
  { code: "chongjabon", column: "TOTAL_EQUITY" }, // 총 자본

  // Summary
  {
    code: "chongbuchaemichjujunjabon",
    column: "TOTAL_LIABILITIES_AND_STOCKHOLDERS_EQUITY",
  }, // 총 부채 및 주주 자본
  { code: "sosuibun", column: "MINORITY_INTEREST" }, // 소수 지분
  {
    code: "chongbuchaemichchongjabon",
    column: "TOTAL_LIABILITIES_AND_TOTAL_EQUITY",
  }, // 총 부채 및 총 자본
  { code: "chongtucha", column: "TOTAL_INVESTMENTS" }, // 총 투자
  { code: "chongbuchae2", column: "TOTAL_DEBT" }, // 총 부채
  { code: "sunbuchae", column: "NET_DEBT" }, // 순부채
];

const cashFlowColumns = [
  // Operating Cash Flows
  { code: "suniig", column: "NET_INCOME" }, // 순이익
  { code: "gamgasanggbibi", column: "DEPRECIATION_AND_AMORTIZATION" }, // 감가상각비
  { code: "iyeonbeobinsee", column: "DEFERRED_INCOME_TAX" }, // 이연법인세
  { code: "jusikgibanbosang", column: "STOCK_BASED_COMPENSATION" }, // 주식 기반 보상
  { code: "unjeonjabonbyundong", column: "CHANGE_IN_WORKING_CAPITAL" }, // 운전자본 변동
  { code: "maechulchaegeun", column: "ACCOUNTS_RECEIVABLES" }, // 매출채권
  { code: "jaegojasan", column: "INVENTORY" }, // 재고자산
  { code: "maeipchaemu", column: "ACCOUNTS_PAYABLES" }, // 매입채무
  { code: "gitaunjeonjabon", column: "OTHER_WORKING_CAPITAL" }, // 기타 운전자본
  { code: "gitabihyeongeumhangmok", column: "OTHER_NON_CASH_ITEMS" }, // 기타 비현금 항목
  {
    code: "yeongeophwaldongeuroinhansunhyeongeumheuleum",
    column: "NET_CASH_PROVIDED_BY_OPERATING_ACTIVITIES",
  }, // 영업활동으로 인한 순현금흐름

  // Investing Cash Flows
  {
    code: "yuhyeongjasantooja",
    column: "INVESTMENTS_IN_PROPERTY_PLANT_AND_EQUIPMENT",
  }, // 유형자산 투자
  { code: "sununsoogeumag", column: "ACQUISITIONS_NET" }, // 순인수금액
  { code: "toojamaeep", column: "PURCHASES_OF_INVESTMENTS" }, // 투자 매입
  { code: "toojamaegeokmitmangi", column: "SALES_MATURITIES_OF_INVESTMENTS" }, // 투자 매각 및 만기
  { code: "gitatoojahwaldong", column: "OTHER_INVESTING_ACTIVITIES" }, // 기타 투자활동
  {
    code: "toojahwaldongeuroinhansunhyeongeumheuleum",
    column: "NET_CASH_USED_FOR_INVESTING_ACTIVITIES",
  }, // 투자활동으로 인한 순현금흐름

  // Financing Cash Flows
  { code: "buchaesanghwan", column: "DEBT_REPAYMENT" }, // 부채 상환
  { code: "baleongdengobongju", column: "COMMON_STOCK_ISSUED" }, // 발행된 보통주
  { code: "jaemaeepdangobongju", column: "COMMON_STOCK_REPURCHASED" }, // 재매입된 보통주
  { code: "jigeubdeonbadanggeum", column: "DIVIDENDS_PAID" }, // 지급된 배당금
  { code: "gitajeonmohwaldong", column: "OTHER_FINANCING_ACTIVITIES" }, // 기타 재무활동
  {
    code: "jeonmohwaldongeuroinhansunhyeongeumheuleum",
    column: "NET_CASH_USED_PROVIDED_BY_FINANCING_ACTIVITIES",
  }, // 재무활동으로 인한 순현금흐름

  // Summary and Other Effects
  {
    code: "oiwonbyundongeuhyeongeumeemitjineungeumyeonghyang",
    column: "EFFECT_OF_FOREX_CHANGES_ON_CASH",
  }, // 외환변동이 현금에 미치는 영향
  { code: "hyeongeumsoonbyundong", column: "NET_CHANGE_IN_CASH" }, // 현금 순변동
  { code: "kimalhyeongeumjangagyek", column: "CASH_ATD_OF_PERIOD" }, // 기말 현금잔액
  { code: "kichohyeongeumjangagyek", column: "CASH_AT_BEGINNING_OF_PERIOD" }, // 기초 현금잔액
  { code: "yeongeophyeongeumhuleum", column: "OPERATING_CASH_FLOW" }, // 영업현금흐름
  { code: "jabonchul", column: "CAPITAL_EXPENDITURE" }, // 자본 지출
  { code: "jauyeongeumhuleum", column: "FREE_CASH_FLOW" }, // 자유 현금흐름
];

// 숫자 포맷 함수
const formatNumber = (value: any): any => {
  return value !== null && !isNaN(value)
    ? parseFloat(value).toLocaleString()
    : value;
};

export const processIncomeStatement = (
  response: any,
  t: (key: string) => string
): any => {
  const dateArray = response.map((item: any) => item.DATE).filter(Boolean);

  // 퍼센트로 변환해야 할 컬럼 리스트
  const percentColumns = [
    "GROSS_PROFIT_RATIO",
    "INCOME_BEFORE_TAX_RATIO",
    "NET_INCOME_RATIO",
    "EBITDARATIO",
  ];

  const verticalData = incomeStatementColumns.map(({ code, column }: any) => {
    const obj: any = { ITEM: t(code) }; // ITEM에 t("코드") 사용
    dateArray.forEach((date: any, index: any) => {
      let value = response[index]?.[column] || null;

      if (value !== null && !isNaN(value)) {
        // 퍼센트 컬럼인지 확인
        if (percentColumns.includes(column)) {
          value = `${(parseFloat(value) * 100).toFixed(2)}%`; // 퍼센트로 변환
        } else {
          value = formatNumber(value); // 숫자 포맷
        }
      }
      obj[date] = value;
    });
    return obj;
  });

  return { dateArray, verticalData };
};

// tab = 1 전용 함수: 대차대조표
export const processBalanceSheet = (
  response: any,
  t: (key: string) => string
): any => {
  const dateArray = response
    .map((item: any) => item.CALENDAR_YEAR)
    .filter(Boolean);

  const verticalData = balanceSheetColumns.map(({ code, column }: any) => {
    const obj: any = { ITEM: t(code) }; // ITEM에 t("code") 사용
    dateArray.forEach((date: any, index: any) => {
      obj[date] = formatNumber(response[index]?.[column] || null);
    });
    return obj;
  });

  return { dateArray, verticalData };
};

// tab = 2 전용 함수: 현금흐름표
export const processCashFlow = (
  response: any,
  t: (key: string) => string
): any => {
  const dateArray = response.map((item: any) => item.DATE).filter(Boolean);

  const verticalData = cashFlowColumns.map(({ code, column }: any) => {
    const obj: any = { ITEM: t(code) }; // ITEM에 t("code") 사용
    dateArray.forEach((date: any, index: any) => {
      obj[date] = formatNumber(response[index]?.[column] || null);
    });
    return obj;
  });

  return { dateArray, verticalData };
};
