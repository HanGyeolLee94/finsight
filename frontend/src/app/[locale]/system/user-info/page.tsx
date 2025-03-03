"use client";
import CustomAutoCompleteCombo from "@/components/CustomAutoCompleteCombo";
import CustomOutlinedInput from "@/components/CustomOutlinedInput";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import FormGrid from "@/components/FormGrid";
import PageLayout from "@/components/PageLayout";
import SearchBox from "@/components/search/SearchBox";
import DataTable from "@/components/tanstack/DataTable";
import { useAlert } from "@/context/AlertContext";
import { usePermissions } from "@/context/PermissionsContext";
import { apiRequest, apiRequestWithLoading } from "@/utils/api";
import { getTableChanges } from "@/utils/helpers";
import { Box, Button, FormLabel } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColumns } from "./column";

export default function MyPage() {
  const [tableData, setTableData] = useState<any[]>([]); // Table data from API
  const columns = useColumns();
  const { t } = useTranslation();
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const { showAlert } = useAlert();

  const tableRef = useRef<any>(null);
  const { getCurrentPermissions } = usePermissions();
  const { canEdit } = getCurrentPermissions();
  const handleSaveTableData = async () => {
    const tableChanges = getTableChanges(tableRef);

    if (!tableChanges) {
      return;
    }

    try {
      const response = await apiRequestWithLoading("/user-info/save-table", {
        method: "POST",
        json: tableChanges,
      });

      if (response.STATUS === "SUCCESS") {
        showAlert(t("jeojangiwanryodweeotseupnida"), "success");
        if (response.newPasswords) {
          response.newPasswords.forEach(
            (entry: { EMAIL: string; PASSWORD: string }) => {
              showAlert(
                `Email: ${entry.EMAIL}, Password: ${entry.PASSWORD}`,
                "success",
                {
                  noFadeOut: true,
                }
              );
            }
          );
        }
      }

      await handleSubmit();
    } catch (error) {
      console.error("Error saving table data:", error);
    }
  };

  // Form submit handler
  const handleSubmit = async (event?: {
    preventDefault: () => void;
    currentTarget?: HTMLFormElement;
  }) => {
    if (event) {
      event.preventDefault();
    }

    const formData = event?.currentTarget
      ? new FormData(event.currentTarget)
      : new FormData();
    const json: { [key: string]: any } = {};

    formData.forEach((value, key) => {
      if (formData.getAll(key).length > 1) {
        json[key] = formData.getAll(key); // Convert to array if multiple values
      } else {
        json[key] = value; // Single value
      }
    });

    try {
      const response = await apiRequestWithLoading("/user-info/select-users", {
        method: "POST",
        json: json,
      });
      setTableData(response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchRoleOptions = async () => {
    try {
      const data = await apiRequest("/role/get-all-roles", {
        method: "POST",
      });
      setRoleOptions(data);
    } catch (error) {
      console.error("Error fetching options:", error);
      setRoleOptions([]);
    }
  };

  useEffect(() => {
    fetchRoleOptions();
    handleSubmit(); // Uncomment to trigger form submission on page load
  }, []);

  return (
    <>
      <PageLayout>
        <DynamicBreadcrumbs></DynamicBreadcrumbs>
        <SearchBox>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            {/* First Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="USERNAME">{t("sayongjaireum")}</FormLabel>
                <CustomOutlinedInput
                  id="USERNAME"
                  name="USERNAME"
                  type="text"
                  autoComplete="first name"
                />
              </FormGrid>

              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="EMAIL">{t("imeiljuso")}</FormLabel>
                <CustomOutlinedInput
                  id="EMAIL"
                  name="EMAIL"
                  type="text"
                  autoComplete="last name"
                />
              </FormGrid>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="ROLE_ID">{t("gwonhan")}</FormLabel>
                <CustomAutoCompleteCombo
                  id="ROLE_ID" // Add this id prop to match the htmlFor
                  name="ROLE_ID"
                  options={roleOptions}
                  disableClearable={false}
                />
              </FormGrid>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{ marginTop: 2, justifyContent: "flex-end" }} // 버튼들을 오른쪽으로 정렬
            >
              {/* 각 버튼을 그리드 항목으로 배치하여 수평 정렬 */}
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
                <Button variant="contained" color="primary" type="submit">
                  {t("johoe")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </SearchBox>

        {/* Table Component */}
        <DataTable
          ref={tableRef}
          columns={columns}
          data={tableData}
          options={{
            tableHeight: "300px",
            paginationEnabled: true,
            checkboxEnabled: true,
            toolbarEnabled: true,
            rowNumEnabled: true,
            sortingEnabled: true,
            toolbarOptions: {
              showAddRow: true,
              showDeleteRow: true,
              showSearch: true,
              showExcelExport: true,
            },
          }}
        />
      </PageLayout>
    </>
  );
}
