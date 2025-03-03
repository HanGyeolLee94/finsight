package com.finsight.lab.util;

import java.time.LocalDate;

public class DateUtil {
    /**
     * 주어진 period를 기반으로 시작일을 계산하는 함수
     *
     * @param period  기간 (예: "1D", "5D", "1M", "3M", "YTD", "1Y", "2Y", "3Y", "5Y")
     * @param endDate 종료일 (기본적으로 LocalDate.now()를 사용)
     * @return 시작일 (String, 형식: yyyy-MM-dd)
     */
    public static String calculateStartDate(String period, LocalDate endDate) {
        // endDate가 null인 경우 현재 날짜 사용
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        LocalDate startDate;

        switch (period) {
            case "1D":
                startDate = endDate.minusDays(1);
                break;
            case "5D":
                startDate = endDate.minusDays(5);
                break;
            case "1M":
                startDate = endDate.minusMonths(1);
                break;
            case "3M":
                startDate = endDate.minusMonths(3);
                break;
            case "YTD":
                startDate = LocalDate.of(endDate.getYear(), 1, 1);
                break;
            case "1Y":
                startDate = endDate.minusYears(1);
                break;
            case "2Y":
                startDate = endDate.minusYears(2);
                break;
            case "3Y":
                startDate = endDate.minusYears(3);
                break;
            case "5Y":
                startDate = endDate.minusYears(5);
                break;
            case "All":
                return null;
            default:
                throw new IllegalArgumentException("Invalid PERIOD: " + period);
        }

        // 반환하기 전에 .toString() 한 번만 호출
        return startDate.toString();
    }

    /**
     * 오버로드 함수: endDate를 생략하면 기본값(LocalDate.now()) 사용
     */
    public static String calculateStartDate(String period) {
        return calculateStartDate(period, LocalDate.now());
    }
}
