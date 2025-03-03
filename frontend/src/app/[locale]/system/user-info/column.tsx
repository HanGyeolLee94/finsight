import { apiRequest } from "@/utils/api"; // 서버 요청을 위한 API 함수
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const columnHelper = createColumnHelper<any>();

// Column definition function
export const useColumns = () => {
  const { t } = useTranslation(); // Hook for translations
  const router = useRouter(); // Hook for navigation
  const [roles, setRoles] = useState<{ TEXT: string; ID: string }[]>([]); // roles를 { TEXT, ID } 형식으로 관리

  // 서버에서 roles 데이터를 가져오는 함수
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiRequest("/role/get-all-roles", {
          method: "POST",
        });
        setRoles(response); // roles 데이터 설정
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return [
    columnHelper.accessor("USER_ID", {
      header: t("sayongjagoyuID"),
      cell: ({ row, getValue }) => <span>{getValue()}</span>,
      enableResizing: true,
      size: 100,
    }),
    columnHelper.accessor("USERNAME", {
      header: t("sayongjaireum"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        required: true,
        editable: true,
      },
    }),
    columnHelper.accessor("EMAIL", {
      header: t("imeiljuso"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 200,
      meta: {
        editable: true,
        allowEditForNewRows: true, // Add custom flag for new rows
        required: true,
      },
    }),
    columnHelper.accessor("ROLE_ID", {
      header: t("gwonhan"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 200,
      meta: {
        comboBox: {
          optionData: roles, // Options data for ComboBox
          disableClearable: true, // Disable the clear (X) icon
        },
        editable: true,
        required: true,
      },
    }),
  ];
};
