// src/constants/tooltipContents.ts
export const TOOLTIP_CONTENTS = {
  FREE_CASH_FLOW: `
  설명:
  - Free Cash Flow 자유 현금 흐름은 운영 활동에서 발생한 현금에서 자본적 지출을 제외한 값입니다
  - Net Income 순이익과 비교하여 수익성과 실제 현금 흐름 간의 관계를 시각화합니다
  - Free Cash Flow가 순이익보다 높으면 자금 운영이 효율적임을 나타냅니다
  
  양수 음수의 의미:
  순이익:
  - 양수: 비용을 초과한 수익이 발생한 경우
  - 음수: 순손실이 발생한 경우
  
  자유 현금 흐름:
  - 양수: 잉여 현금이 발생한 경우
  - 음수: 자본적 지출이 운영 현금을 초과한 경우
  `,
  CASH_FLOW_BREAKDOWN: `
  설명:
  - 현금 흐름을 세 가지 주요 활동 운영 투자 재무 활동으로 나눠 구성 요소별 기여도를 분석합니다
  - 운영 활동: 핵심 사업 운영에서 발생한 현금 흐름
  - 투자 활동: 자산 구매 투자 등 장기적 비용 수익
  - 재무 활동: 부채 상환 주식 발행 배당금 지급 등 자금 조달 지출
  - 자본적 지출 (CAPEX): 기업의 장기적 성장과 유지에 필요한 자산 구매 및 업그레이드 비용으로, 투자 활동의 중요한 구성 요소입니다

  양수 음수의 의미:
  운영 활동:
  - 양수: 핵심 사업에서 현금 창출
  - 음수: 핵심 사업이 손실을 보고 있음

  투자 활동:
  - 양수: 투자 자산 매각 등으로 현금 유입
  - 음수: 장기 투자로 현금 유출

  재무 활동:
  - 양수: 자본 조달 부채 발행 주식 발행으로 현금 유입
  - 음수: 부채 상환 배당금 지급 등으로 현금 유출

  자본적 지출 (CAPEX):
  - 양수: 드물게 자산 매각으로 인한 현금 유입
  - 음수: 자산 구매 및 업그레이드로 인한 현금 유출
  `,
};
