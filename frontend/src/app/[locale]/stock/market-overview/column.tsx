import LinkCell from "@/components/tanstack/LinkCell";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

const columnHelper = createColumnHelper<any>();

export const useColumns = () => {
  const { t } = useTranslation(); // Hook for translations

  return [
    columnHelper.accessor("SYMBOL", {
      header: t("tikeo"), // 티커
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        enableLink: {
          hrefFormatter: (value) =>
            `/stock/stock-list/${value.replace(/\./g, "-")}`,
        },
      },
    }),
    columnHelper.accessor("NAME", {
      header: t("hoesaileum"), // 회사 이름
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
    }),
    columnHelper.accessor("CHANGES_PERCENTAGE", {
      header: t("byeondongryul"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        align: "right",
        format: "comma",
      },
    }),
    columnHelper.accessor("CHANGE_VALUE", {
      header: t("byeondonggab"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        align: "right",
        format: "comma",
      },
    }),
    columnHelper.accessor("OPEN_PRICE", {
      header: t("siga"), // 시가
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        align: "right",
        format: "comma",
      },
    }),
    columnHelper.accessor("PREVIOUS_CLOSE", {
      header: t("ijeonjongga"), // 전 종가
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        align: "right",
        format: "comma",
      },
    }),

    columnHelper.accessor("EXCHANGE", {
      header: t("juoyogyoraeso"), // 주요 거래소
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
    }),
    columnHelper.accessor("DAY_RANGE", {
      header: t("ililbeomwi"), // 일일 범위
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        align: "center",
      },
    }),
    columnHelper.accessor("YEAR_RANGE", {
      header: t("52jubeomwi"), // 52주 범위
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        align: "center",
      },
    }),
    columnHelper.accessor("MARKET_CAP", {
      header: t("sigachonggaek"), // 시가 총액
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        align: "right",
        format: "comma",
      },
    }),
    columnHelper.accessor("PE", {
      header: t("jugasooigbiwoolttm"), // 주가수익비율 TTM
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        align: "right",
        format: "comma",
      },
    }),
    columnHelper.accessor("EARNINGS_ANNOUNCEMENT", {
      header: t("silljeogballyoil"), // 실적 발표일
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 200,
    }),
  ];
};
