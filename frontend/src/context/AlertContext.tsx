"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import { SnackbarOrigin, AlertColor } from "@mui/material";
import GlobalAlert from "@/components/common/GlobalAlert";

interface AlertMessage {
  id: number;
  message: string;
  severity: AlertColor;
  options?: {
    position?: SnackbarOrigin;
    noFadeOut?: boolean; // Clear option for no fade-out
    fadeOutDuration?: number; // Optional fade-out duration
  };
}

interface AlertContextType {
  showAlert: (
    message: string,
    severity: "success" | "info" | "warning" | "error", //AlertColor,
    options?: {
      position?: SnackbarOrigin;
      noFadeOut?: boolean;
      fadeOutDuration?: number;
    }
  ) => void;
  closeAlert: (id: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const maxIdRef = useRef<number>(0); // Manage unique IDs

  const showAlert = (
    message: string,
    severity: AlertColor,
    options?: {
      position?: SnackbarOrigin;
      noFadeOut?: boolean;
      fadeOutDuration?: number;
    }
  ) => {
    const id = maxIdRef.current + 1; // Generate a unique ID for each alert
    maxIdRef.current = id;

    // Add the new alert to the stack
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { id, message, severity, options },
    ]);

    const { noFadeOut, fadeOutDuration } = options || {};

    // Automatically close the alert if noFadeOut is not set
    if (!noFadeOut) {
      const duration = fadeOutDuration !== undefined ? fadeOutDuration : 3000;
      setTimeout(() => closeAlert(id), duration);
    }
  };

  const closeAlert = (id: number) => {
    // Remove the specific alert from the stack
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <GlobalAlert alerts={alerts} closeAlert={closeAlert} />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
