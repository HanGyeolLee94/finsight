"use client";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import PageLayout from "@/components/PageLayout";
import DataTable from "@/components/tanstack/DataTable";
import { useAlert } from "@/context/AlertContext";
import { useMenuReload } from "@/context/MenuReloadProvider";
import { usePermissions } from "@/context/PermissionsContext";
import { apiRequestWithLoading } from "@/utils/api";
import { getTableChanges } from "@/utils/helpers";
import { useFetchAndStoreMenu } from "@/utils/menuUtils";
import buildTree from "@/utils/TreeBuilder";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColumns } from "./column";
export default function MyPage() {
  const [tableData, setTableData] = useState<any[]>([]); // Table data from API
  const columns = useColumns();
  const { t } = useTranslation();
  const fetchAndStoreMenu = useFetchAndStoreMenu();
  const tableRef = useRef<any>(null);
  const { getCurrentPermissions } = usePermissions();
  const { canEdit } = getCurrentPermissions();
  const { showAlert } = useAlert();
  const { reloadMenu } = useMenuReload();

  const handleSaveTableData = async () => {
    const tableChanges = getTableChanges(tableRef);

    if (!tableChanges) {
      return;
    }

    try {
      const response = await apiRequestWithLoading("/menu/update-table-data", {
        method: "POST",
        json: tableChanges,
      });

      if (response.STATUS === "SUCCESS") {
        showAlert(t("jeojangiwanryodweeotseupnida"), "success");

        await fetchAndStoreMenu();
        await handleSubmit();
        reloadMenu(); // Trigger menu reload
      }
    } catch (error) {
      console.error("Error saving table data:", error);
    }
  };

  // Form submit handler
  const handleSubmit = async (event?: {
    preventDefault: () => void;
    currentTarget?: HTMLFormElement;
  }) => {
    try {
      const result = await apiRequestWithLoading("/menu/get-all-menus", {
        method: "POST",
      });
      const options = {
        parentKey: "P_MENU_ID", // 부모 키로 사용할 컬럼명
        childKey: "MENU_ID", // 자식 키로 사용할 컬럼명
      };
      const treeData = buildTree(result, options);
      setTableData(treeData || []); // Set table data from API response
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    handleSubmit(); // Uncomment to trigger form submission on page load
  }, []);

  return (
    <>
      <PageLayout>
        <DynamicBreadcrumbs>
          <Button
            variant="contained"
            onClick={handleSaveTableData}
            disabled={!canEdit}
          >
            {t("jeojang")}
          </Button>
        </DynamicBreadcrumbs>

        {/* Table Component */}
        <DataTable
          ref={tableRef}
          columns={columns}
          data={tableData}
          options={{
            tableHeight: "600px",
            toolbarEnabled: true,
            toolbarOptions: {
              showExcelExport: true,
              showExpandCollapse: true,
            },
          }}
        />
      </PageLayout>
    </>
  );
}
