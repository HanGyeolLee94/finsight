import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import ExpandableCell from "@/components/tanstack/ExpandableCell";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper<any>();

// 컬럼 정의 함수
export const useColumns = () => {
  const { t } = useTranslation(); // 훅을 함수 내부에서 호출
  const router = useRouter(); // Hook for navigation

  return [
    columnHelper.accessor("MENU_ID", {
      header: t("menyuID"),
      cell: (props) => (
        <ExpandableCell row={props.row} getValue={props.getValue} />
      ),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 200,
    }),
    columnHelper.accessor("MENU_NAME", {
      header: t("menyumyeong"),
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 200,
      meta: {
        editable: true,
        required: true,
      },
    }),
    columnHelper.accessor("PATH", {
      header: t("gyeonglo"),
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 200,
    }),
    columnHelper.accessor("ORDER_NUM", {
      header: t("sunseo"),
      cell: (info) => info.getValue(),
      footer: (info) => info.column.id,
      enableResizing: true,
      size: 100,
      meta: {
        editable: true,
        required: true,
      },
    }),
  ];
};
