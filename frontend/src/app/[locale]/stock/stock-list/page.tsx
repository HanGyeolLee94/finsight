"use client";
import CustomAutoCompleteCombo from "@/components/CustomAutoCompleteCombo";
import CustomAutoCompleteInput from "@/components/CustomAutoCompleteInput";
import CustomOutlinedInput from "@/components/CustomOutlinedInput";
import CustomPopup from "@/components/CustomPopup";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import FormGrid from "@/components/FormGrid";
import PageLayout from "@/components/PageLayout";
import SearchBox from "@/components/search/SearchBox";
import DataTable from "@/components/tanstack/DataTable";
import { useAlert } from "@/context/AlertContext";
import { usePermissions } from "@/context/PermissionsContext";
import { apiRequest, apiRequestWithLoading } from "@/utils/api";
import { formDataToJson } from "@/utils/helpers";
import { Box, Button, FormLabel } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColumns } from "./column";

export default function MyPage() {
  const { showAlert } = useAlert();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [inputValue, setInputValue] = useState(""); // input field value
  const [open, setOpen] = useState(false); // Popup open state
  const [tableData, setTableData] = useState<any[]>([]);
  const columns = useColumns();
  const { t } = useTranslation();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(50);
  const tableRef = useRef<any>(null);
  const formRef = useRef<HTMLFormElement>(null); // Form reference
  const [tickerOptions, setTickerOptions] = useState<
    { TEXT: string; ID: string }[]
  >([]);
  const { getCurrentPermissions } = usePermissions();
  const { canEdit } = getCurrentPermissions();

  const handleTickerChange = debounce(async (newValue: string) => {
    if (!newValue) return; // Prevent API call if the input is empty.
    try {
      const response = await apiRequest(
        `/ticker/recommendations?q=${newValue}`,
        {
          method: "GET",
        }
      );
      setTickerOptions(response); // Update options in state
    } catch (error) {
      console.error("Error fetching ticker recommendations:", error);
    }
  }, 300); // 300ms delay

  // Closes popup
  const handleClosePopup = () => {
    setOpen(false);
  };

  // Handles value selection from popup
  const handleSelectValue = (value: string) => {
    setInputValue(value);
    handleClosePopup(); // Close popup after selection
  };

  const fetchStockList = async () => {
    try {
      await apiRequestWithLoading("/ticker/fetch-stock-list", {
        method: "POST",
      });
      showAlert(t("eobdeiteugaweollyodeotseumnida"), "success");
      await handleSearch(); // 데이터 저장 후 다시 제출
    } catch (error) {
      console.error("Error saving table data:", error);
    }
  };

  // Form submit handler
  const handleSearch = async (
    pageIndex = currentPageIndex,
    pageSize = currentPageSize,
    shouldFetchTotalCount = false,
    resetPageIndex = false
  ) => {
    if (!formRef.current) return;
    if (resetPageIndex) {
      pageIndex = 0;
    }

    const formData = new FormData(formRef.current);
    const json = formDataToJson(formData);
    json.limit = pageSize;
    json.offset = pageIndex * pageSize;

    try {
      const response = await apiRequestWithLoading("/ticker/select-list", {
        method: "POST",
        json: json,
      });
      setTableData(response);
      setCurrentPageIndex(pageIndex); // Store the pageIndex
      setCurrentPageSize(pageSize); // Store the pageSize

      // Fetch total count only if the flag is set to true
      if (shouldFetchTotalCount) {
        await fetchTotalCount();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fetchTotalCount = async () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const json = formDataToJson(formData);
    try {
      const response = await apiRequest("/ticker/get-total-count", {
        method: "POST",
        json: json,
      });
      setTotalCount(response);
      if (tableRef.current) {
        tableRef.current.resetPagination(); // Reset pagination in DataTable
      }
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };

  const [typeOptions, setTypeOptions] = useState<any[]>([]);
  const fetchTypeOptions = async () => {
    try {
      const data = await apiRequest("/ticker/asset-types", {
        method: "GET",
      });

      setTypeOptions(data);
    } catch (error) {
      console.error("Error fetching options:", error);
      setTypeOptions([]);
    }
  };

  useEffect(() => {
    fetchTypeOptions();
    fetchTotalCount();
    handleSearch();
    return () => {
      handleTickerChange.cancel(); // Clean up debounce when component unmounts or re-renders
    };
  }, []);

  return (
    <>
      <PageLayout>
        <DynamicBreadcrumbs>
          <Button
            variant="contained"
            onClick={fetchStockList}
            disabled={!canEdit}
          >
            {t("jusikmoglogeobdeiteu")}
          </Button>
        </DynamicBreadcrumbs>
        {/* <TitleComponent translationKey="jongmok"></TitleComponent> */}
        <SearchBox>
          <Box
            component="form"
            ref={formRef} // formRef를 사용하여 폼에 접근
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(currentPageIndex, currentPageSize, true, true);
            }}
          >
            {/* First Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="SYMBOL">{t("tikeo")}</FormLabel>
                <CustomAutoCompleteInput
                  options={tickerOptions}
                  name="SYMBOL"
                  id="SYMBOL"
                  disableClearable={false}
                  onChange={handleTickerChange}
                  useOptionId={true}
                />
              </FormGrid>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="NAME">{t("hoesaileum")}</FormLabel>
                <CustomOutlinedInput id="NAME" name="NAME" type="text" />
              </FormGrid>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="TYPE">{t("jasanyuhyeong")}</FormLabel>
                <CustomAutoCompleteCombo
                  id="TYPE" // Add this id prop to match the htmlFor
                  name="TYPE"
                  options={typeOptions}
                />
              </FormGrid>
            </Grid>

            <Grid
              container
              spacing={2}
              sx={{ marginTop: 2, justifyContent: "flex-end" }}
            >
              <Grid>
                <Button variant="contained" color="primary" type="submit">
                  {t("johoe")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </SearchBox>

        {/* Popup Component */}
        <CustomPopup
          open={open}
          onClose={handleClosePopup}
          onSelect={handleSelectValue}
          options={["Option 1", "Option 2", "Option 3"]}
        />

        {/* Table Component */}
        <DataTable
          ref={tableRef}
          columns={columns}
          data={tableData}
          handleSearch={handleSearch}
          options={{
            tableHeight: "300px",
            paginationEnabled: true,
            checkboxEnabled: false,
            toolbarEnabled: true,
            rowNumEnabled: true,
            toolbarOptions: {
              showExcelExport: true,
              showExpandCollapse: false,
            },
          }}
          totalCount={totalCount}
        />
      </PageLayout>
    </>
  );
}
