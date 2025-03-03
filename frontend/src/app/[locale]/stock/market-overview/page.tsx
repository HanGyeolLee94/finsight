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
import { RootState } from "@/store";
import { apiRequest, apiRequestWithLoading } from "@/utils/api";
import { formDataToJson } from "@/utils/helpers";
import { Box, Button, FormLabel } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useColumns } from "./column";

export default function MyPage() {
  const customParams = useSelector(
    (state: RootState) => state.navigation.customParams
  );
  const [selectedOption, setSelectedOption] = useState<string>("");

  const { showAlert } = useAlert();
  const [inputValue, setInputValue] = useState(""); // input field value
  const [open, setOpen] = useState(false); // Popup open state
  const [tableData, setTableData] = useState<any[]>([]);
  const columns = useColumns();
  const { t } = useTranslation();
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
        `/market-overview/recommendations?q=${newValue}`,
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

  // Form submit handler
  const handleSearch = async (analysisType = null) => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const json = formDataToJson(formData);

    // Add ANALYSIS_TYPE to the request payload if provided
    if (analysisType) {
      json.ANALYSIS_TYPE = analysisType;
    }

    try {
      const response = await apiRequestWithLoading(
        "/market-overview/select-list",
        {
          method: "POST",
          json: json,
        }
      );
      setTableData(response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (customParams?.analysisType) {
      setSelectedOption(customParams.analysisType);
      handleSearch(customParams.analysisType);
    }
    return () => {
      handleTickerChange.cancel(); // Clean up debounce
    };
  }, [customParams]);

  const analysisTypeOptions = [
    { TEXT: t("choegosangseungsongmok"), ID: "TOP_GAINERS" },
    { TEXT: t("choegoharaksongmok"), ID: "TOP_LOSERS" },
    { TEXT: "S&P 500", ID: "SNP500" },
  ];
  return (
    <>
      <PageLayout>
        <DynamicBreadcrumbs></DynamicBreadcrumbs>
        <SearchBox>
          <Box
            component="form"
            ref={formRef} // formRef를 사용하여 폼에 접근
            noValidate={false}
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            {/* First Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="ANALYSIS_TYPE" required>
                  {t("bunseogyuhyeong")}
                </FormLabel>
                <CustomAutoCompleteCombo
                  id="ANALYSIS_TYPE"
                  name="ANALYSIS_TYPE"
                  options={analysisTypeOptions}
                  defaultValue={selectedOption}
                  required
                />
                {/* <CustomAutoCompleteMultipleInput
                  options={analysisTypeOptions}
                  name="ANALYSIS_TYPE"
                  id="ANALYSIS_TYPE"
                /> */}
              </FormGrid>
              <FormGrid size={{ xs: 12, md: 3 }}>
                <FormLabel htmlFor="SYMBOL">{t("tikeo")}</FormLabel>
                <CustomAutoCompleteInput
                  options={tickerOptions}
                  defaultValue=""
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
          options={{
            tableHeight: "300px",
            paginationEnabled: true,
            sortingEnabled: true,
            checkboxEnabled: false,
            toolbarEnabled: true,
            rowNumEnabled: true,
            toolbarOptions: {
              showExcelExport: true,
              showExpandCollapse: false,
            },
          }}
        />
      </PageLayout>
    </>
  );
}
