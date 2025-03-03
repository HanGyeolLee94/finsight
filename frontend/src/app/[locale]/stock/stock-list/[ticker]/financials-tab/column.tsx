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
      cell: ({ row }) => (
        <LinkCell
          value={row.getValue("SYMBOL")} // Pass the TICKER value as link text
          rowData={row.original} // Pass row.original as rowData to be used in the context
          hrefFormatter={(value) =>
            `/stock/stock-list/${value.replace(/\./g, "-")}`
          } // Replace '.' with '_dot_'
        />
      ),
      enableResizing: true,
      size: 100,
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
