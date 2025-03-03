import { apiRequestWithLoading } from "@/utils/api"; // 서버 요청을 위한 API 함수
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { IconButton } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useAlert } from "@/context/AlertContext";

const columnHelper = createColumnHelper<any>();

export const useColumns = () => {
  const { t } = useTranslation(); // Hook for translations
  const { showAlert } = useAlert();

  const handleManualSchedule = async (scheduleId: string) => {
    try {
      const response = await apiRequestWithLoading(`/schedule/manual-call`, {
        method: "POST",
        json: { SCHEDULE_ID: scheduleId },
      });
      showAlert(t("seukejulhochulesonggonghaessseubnida"), "success");
    } catch (error) {
      console.error("Error calling schedule manually:", error);
      showAlert(t("seukejulhochulesilpaehaessseubnida"), "error");
    }
  };

  return [
    columnHelper.display({
      id: "manual_call",
      header: t("sudongsilhaeng"),
      cell: (info) => (
        <IconButton
          onClick={() => handleManualSchedule(info.row.original.SCHEDULE_ID)}
          color="primary" // Icon color (can be primary, secondary, etc.)
        >
          <PlayArrowIcon /> {/* Icon for manual execution */}
        </IconButton>
      ),
      enableResizing: true,
      size: 50,
      meta: {
        align: "center",
        enableSorting: false,
      },
    }),
    columnHelper.accessor("SCHEDULE_ID", {
      header: t("sikejulid"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        required: true,
        editable: true,
        allowEditForNewRows: true,
        align: "center",
      },
    }),
    columnHelper.accessor("CLASS_NAME", {
      header: t("keullaeseuileum"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 500,
      meta: {
        required: true,
        editable: true,
      },
    }),
    columnHelper.accessor("METHOD_NAME", {
      header: t("meseodeuileum"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 250,
      meta: {
        required: true,
        editable: true,
      },
    }),
    columnHelper.accessor("CRON_EXPRESSION", {
      header: t("keulonpyohyeonsik"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        editable: true,
        required: true,
      },
    }),
    columnHelper.accessor("ENABLED", {
      header: t("hwalseonghayeo"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 100,
      meta: {
        checkbox: true,
        align: "center",
        editable: true,
      },
    }),
    columnHelper.accessor("DESCRIPTION", {
      header: t("seolmyeong"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 250,
    }),
    columnHelper.accessor("CREATED_AT", {
      header: t("saengseongilsi"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        align: "center",
      },
    }),
    columnHelper.accessor("UPDATED_AT", {
      header: t("sujeongilsi"),
      cell: (info) => info.getValue(),
      enableResizing: true,
      size: 150,
      meta: {
        align: "center",
      },
    }),
  ];
};
