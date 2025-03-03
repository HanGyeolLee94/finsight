import LinkCell from "@/components/tanstack/LinkCell";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const columnHelper = createColumnHelper<any>();

// Column definition function
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
    columnHelper.accessor("EXCHANGE", {
      header: t("juoyogyoraeso"), // 주요 거래소
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
    }),
    columnHelper.accessor("TYPE", {
      header: t("yuhyeong"), // 유형
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
    }),
  ];
};
