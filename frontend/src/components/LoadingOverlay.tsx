"use client";

import React, { useEffect, useState } from "react";
import { CircularProgress, Backdrop, Box } from "@mui/material";

interface LoadingOverlayProps {
  open: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open }) => {
  const [visible, setVisible] = useState(open);

  // Sync visibility with the `open` prop
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setVisible(false); // Close the overlay on ESC
      }
    };

    if (visible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  useEffect(() => {
    setVisible(open); // Sync visibility with the open prop
  }, [open]);

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.modal + 1, // Ensure it is above modals or dialogs
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      open={visible}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;
