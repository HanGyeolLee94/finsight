"use client";
import FormGrid from "@/components/FormGrid";
import { useEffect, useRef, useState } from "react";

import CustomAutoCompleteCombo from "@/components/CustomAutoCompleteCombo";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import PageLayout from "@/components/PageLayout";
import SearchBox from "@/components/search/SearchBox";
import DataTable from "@/components/tanstack/DataTable";
import { usePermissions } from "@/context/PermissionsContext";
import { apiRequest, apiRequestWithLoading } from "@/utils/api";
import { formDataToJson, getTableChanges } from "@/utils/helpers";
import { useFetchAndStoreMenu } from "@/utils/menuUtils";
import buildTree from "@/utils/TreeBuilder";
import { Box, Button, FormLabel } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTranslation } from "react-i18next";
import { useColumns } from "./column";
import { useAlert } from "@/context/AlertContext";
import { useMenuReload } from "@/context/MenuReloadProvider";

export default function MyPage() {
  const [tableData, setTableData] = useState<any[]>([]);
  const columns = useColumns();
  const { t } = useTranslation();
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const tableRef = useRef<any>(null);
  const { showAlert } = useAlert();
  const { reloadMenu } = useMenuReload();

  const fetchAndStoreMenu = useFetchAndStoreMenu();
  const { getCurrentPermissions } = usePermissions();
  const { canEdit } = getCurrentPermissions();

  // 폼의 데이터를 직접 참조할 수 있도록 formRef 사용
  const formRef = useRef<HTMLFormElement>(null);

  // Option 변경 시 호출되는 핸들러
  const handleOptionChange = (option: { TEXT: string; ID: string } | null) => {
    // 선택된 옵션이 있을 때 handleSubmit 호출
    if (option) {
      handleSubmit(); // Call handleSubmit after option is selected
    }
  };

  const handleSaveTableData = async () => {
    const tableChanges = getTableChanges(tableRef); // 모듈화된 함수 사용

    if (!tableChanges) {
      return;
    }

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const ROLE_ID = formData.get("ROLE_ID"); // ROLE_ID 필드를 폼에서 가져옴

    const tableChangesWithRoleId = {
      ...tableChanges,
      ROLE_ID, // 최상위에 ROLE_ID 추가
    };
    try {
      await apiRequestWithLoading("/role/save-role-menu", {
        method: "POST",
        json: tableChangesWithRoleId,
      });

      showAlert(t("jeojangiwanryodweeotseupnida"), "success");
      await fetchAndStoreMenu();
      await handleSubmit(); // 데이터 저장 후 다시 제출
      reloadMenu(); // Trigger menu reload
    } catch (error) {
      console.error("Error saving table data:", error);
    }
  };

  // event 없이 formRef를 통해 폼 데이터 수집
  const handleSubmit = async () => {
    if (!formRef.current) return; // formRef가 없으면 함수 종료

    // formRef에서 직접 FormData를 가져옴
    const formData = new FormData(formRef.current);
    const json = formDataToJson(formData);

    try {
      const result = await apiRequestWithLoading("/role/get-role-menu", {
        method: "POST",
        json: json,
      });
      const options = {
        parentKey: "P_MENU_ID", // 부모 키로 사용할 컬럼명
        childKey: "MENU_ID", // 자식 키로 사용할 컬럼명
      };
      const treeData = buildTree(result, options);
      setTableData(treeData); // Set table data from API response
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchOptions = async () => {
    try {
      const data = await apiRequest("/role/get-all-roles", {
        method: "POST",
      });

      setOptions(data);

      if (data && data.length > 0) {
        setSelectedOption(data[0].ID);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
      setOptions([]);
    }
  };

  useEffect(() => {
    const runAsyncTasks = async () => {
      try {
        await fetchOptions(); // fetchOptions는 한 번만 호출됨
      } catch (error) {
        console.error("Error during async tasks:", error);
      }
    };
    runAsyncTasks();
  }, []); // 빈 배열로, useEffect는 컴포넌트 마운트 시에만 한 번 실행됨

  return (
    <>
      <PageLayout>
        <DynamicBreadcrumbs></DynamicBreadcrumbs>
        <SearchBox>
          <Box
            component="form"
            ref={formRef} // formRef를 사용하여 폼에 접근
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="ROLE_ID">{t("gwonhan")}</FormLabel>
                <CustomAutoCompleteCombo
                  id="ROLE_ID" // Add this id prop to match the htmlFor
                  name="ROLE_ID"
                  options={options}
                  defaultValue={selectedOption}
                  onChange={handleOptionChange}
                  disableClearable={true}
                />
              </FormGrid>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{ marginTop: 2, justifyContent: "flex-end" }}
            >
              <Grid>
                <Button
                  variant="contained"
                  onClick={handleSaveTableData}
                  disabled={!canEdit}
                >
                  {t("jeojang")}
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {t("johoe")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </SearchBox>

        <DataTable
          ref={tableRef}
          columns={columns}
          data={tableData}
          options={{
            tableHeight: "600px",
            toolbarEnabled: true,
            checkboxEnabled: false,
            toolbarOptions: {
              showExcelExport: true,
              showAddRow: false,
              showDeleteRow: false,
              showExpandCollapse: true,
            },
          }}
        />
      </PageLayout>
    </>
  );
}
