"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  IconButton,
  Checkbox,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import { useAlert } from "@/context/AlertContext";
import { apiRequestWithLoading } from "@/utils/api";
import { fileToBase64 } from "@/utils/fileUtils";

export default function DataFileManagement() {
  const { t } = useTranslation();
  const [actionType, setActionType] = useState<string>("snp500");
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();
  const [updateHistory, setUpdateHistory] = useState<any[]>([]);
  const [selectedHistories, setSelectedHistories] = useState<Set<number>>(
    new Set()
  );

  const loadUpdateHistory = async () => {
    try {
      const response = await apiRequestWithLoading(
        "/data-file-management/upload-history",
        { method: "POST", json: { ACTION_TYPE: actionType } }
      );
      setUpdateHistory(response || []);
    } catch (error) {
      console.error("Error fetching update history:", error);
    }
  };

  useEffect(() => {
    loadUpdateHistory();
  }, [actionType]);

  const fileUploadConfig: Record<
    string,
    {
      limit: number;
      alertMessage: string;
      title: string;
      fileTypes?: string[];
      instruction: string;
    }
  > = {
    snp500: {
      limit: 1,
      alertMessage: t("hanapailmanobpreoduhaltsuissseumnida"),
      title: "seuandpi500guseongjongmok",
      fileTypes: [".txt"],
      instruction:
        "Upload a .txt file containing S&P 500 stock symbols (e.g., AAPL, MSFT, GOOGL).",
    },
    dowjones: {
      limit: 1,
      alertMessage: t("hanapailmanobpreoduhaltsuissseumnida"),
      title: "dowjonesguseongjongmok",
      fileTypes: [".txt"],
      instruction:
        "Upload a .txt file containing Dow Jones stock symbols (e.g., JPM, IBM, DIS).",
    },
    nasdaq100: {
      limit: 1,
      alertMessage: t("hanapailmanobpreoduhaltsuissseumnida"),
      title: "nasdaq100guseongjongmok",
      fileTypes: [".txt"],
      instruction:
        "Upload a .txt file containing Nasdaq 100 stock symbols (e.g., AMZN, TSLA, NVDA).",
    },
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const { limit, alertMessage, fileTypes } =
        fileUploadConfig[actionType] || {};

      // Validate file types
      if (fileTypes) {
        const invalidFiles = selectedFiles.filter(
          (file) => !fileTypes.some((type) => file.name.endsWith(type))
        );
        if (invalidFiles.length > 0) {
          showAlert(
            t("damgeupailhyeongsikmanheoyongdoebnida") +
              `: ${fileTypes.join(", ")}`,
            "warning"
          );
          return;
        }
      }

      if (limit && selectedFiles.length > limit) {
        showAlert(alertMessage, "warning");
        return;
      }
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    const { limit, alertMessage, fileTypes } =
      fileUploadConfig[actionType] || {};

    // Validate file types
    if (fileTypes) {
      const invalidFiles = droppedFiles.filter(
        (file) => !fileTypes.some((type) => file.name.endsWith(type))
      );
      if (invalidFiles.length > 0) {
        showAlert(
          t("damgeupailhyeongsikmanheoyongdoebnida") +
            `: ${fileTypes.join(", ")}`,
          "warning"
        );
        return;
      }
    }

    if (limit && droppedFiles.length > limit) {
      showAlert(alertMessage, "warning");
      return;
    }
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleUpload = async () => {
    if (!files.length || !actionType) {
      showAlert(t("jagjeobseontaekhagopeilobpreoduhaseyo"), "warning");
      return;
    }

    const param = {
      actionType,
      files: await Promise.all(
        files.map(async (file) => ({
          fileName: file.name,
          fileContent: await fileToBase64(file),
        }))
      ),
    };

    try {
      const response = await apiRequestWithLoading(
        "/data-file-management/upload-file",
        {
          method: "POST",
          json: param,
        }
      );
      showAlert(t("pailiseonggongjeogeurobpreoduhdwotseumnida"), "success");
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      loadUpdateHistory(); // Reload history
    } catch (error) {
      showAlert(t("pailobpreodujungoryugabalssaenghatseumnida"), "error");
    }
  };

  const handleFileDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleHistorySelection = (index: number) => {
    setSelectedHistories((prev) => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedHistories.size === 0) {
      showAlert(t("sagjehalhangmogeulchoisohanaseontaekhaseyo"), "warning");
      return;
    }

    const idsToDelete = Array.from(selectedHistories).map(
      (index) => updateHistory[index].ID
    );

    try {
      await apiRequestWithLoading("/data-file-management/delete-history", {
        method: "POST",
        json: { ids: idsToDelete },
      });
      showAlert(
        t("seontaekhanhangmogiseonggongjeogeulosagjedoeotseumnida"),
        "success"
      );
      loadUpdateHistory(); // Reload history
      setSelectedHistories(new Set());
    } catch (error) {
      showAlert(t("seontaekhanhangmogelsagjehajimotsseumnida"), "error");
    }
  };

  const handleDownload = async (uniqueFileName: string, fileName: string) => {
    try {
      const response = await apiRequestWithLoading(
        "/data-file-management/download-file",
        {
          method: "POST",
          json: { fileName: uniqueFileName }, // Send unique file name to the server
          rawResponse: true,
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the original file name for download
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <PageLayout>
      <DynamicBreadcrumbs />
      <Box>
        {/* Render buttons in a row */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          {Object.entries(fileUploadConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={actionType === key ? "contained" : "outlined"}
              onClick={() => setActionType(key)}
            >
              {t(config.title)}
            </Button>
          ))}
        </Box>

        {/* Show the instruction for the selected action type */}
        {actionType && (
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            {fileUploadConfig[actionType].instruction}
          </Typography>
        )}
      </Box>

      <Box>
        <Box
          sx={{
            p: 5,
            border: dragActive ? "2px dashed #1976d2" : "2px solid #ccc",
            borderRadius: 3,
            textAlign: "center",
            cursor: "pointer",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: dragActive ? "#f5f5f5" : "transparent",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUploadIcon fontSize="large" sx={{ mb: 2 }} />
          <Typography sx={{ mb: 2 }}>
            {t("paireuligosedeuraegeaendeurophageonhakrigueopreoduhaseyo")}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple={fileUploadConfig[actionType]?.limit > 1}
            onChange={handleFileChange}
          />

          {files.length > 0 && (
            <List
              sx={{
                mt: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                width: "100%",
              }}
            >
              {files.map((file, index) => (
                <ListItem
                  key={`file-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>{file.name}</Typography>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleFileDelete(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!files.length || !actionType}
          >
            {t("paireobpreoduh")}
          </Button>
        </Box>

        {updateHistory.length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("eobrodeugirok")}
            </Typography>
            <List
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                bgcolor: "#f9f9f9",
              }}
            >
              {updateHistory.map((item, index) => (
                <ListItem
                  key={`history-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Checkbox
                      checked={selectedHistories.has(index)}
                      onChange={() => toggleHistorySelection(index)}
                    />
                    <Typography
                      onClick={() =>
                        handleDownload(item.UNIQUE_FILE_NAME, item.FILE_NAME)
                      }
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        textDecoration: "underline",
                      }}
                    >
                      {item.FILE_NAME}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {`${t("eobrodeo")}${":"} ${item.UPLOADED_BY} - ${
                      item.UPLOAD_DATE
                    }`}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteSelected}
              >
                {t("seontaekhangmoksagje")}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </PageLayout>
  );
}
