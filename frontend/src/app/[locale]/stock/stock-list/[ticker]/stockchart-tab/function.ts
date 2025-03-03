export const formatYAxisValue = (value: number): string => {
  const absValue = Math.abs(value); // 절대값으로 양수처럼 처리

  if (absValue >= 1_000_000_000)
    return `${(value / 1_000_000_000).toFixed(0)}B`; // 억 단위 (B)
  if (absValue >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`; // 백만 단위 (M)
  if (absValue >= 1_000) return `${(value / 1_000).toFixed(0)}K`; // 천 단위 (K)
  return value.toString();
};
