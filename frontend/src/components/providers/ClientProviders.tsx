"use client";

import React, { useEffect, useState } from "react";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { AlertProvider } from "@/context/AlertContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PermissionsProvider } from "@/context/PermissionsContext";
import { getStoredPermissions } from "@/utils/menuUtils";

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<
    { PATH?: string; MENU_ID: string; CAN_EDIT: string }[] | null
  >(null);

  useEffect(() => {
    const initializePermissions = async () => {
      // Try to load permissions from localStorage
      const storedPermissions = getStoredPermissions();

      if (storedPermissions.length > 0) {
        setPermissions(storedPermissions);
      } else {
        // Fetch permissions and store them if not in localStorage
        const updatedPermissions = getStoredPermissions();
        setPermissions(updatedPermissions);
      }
    };

    initializePermissions();
  }, []);

  if (permissions === null) {
    // Display a loading spinner or message while permissions are being loaded
    return <LoadingOverlay open={true} />;
  }

  return (
    <ReduxProvider>
      <AlertProvider>
        <PermissionsProvider initialPermissions={permissions}>
          <OverlayWrapper>{children}</OverlayWrapper>
        </PermissionsProvider>
      </AlertProvider>
    </ReduxProvider>
  );
};

const OverlayWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <>
      <LoadingOverlay open={isLoading} />
      {children}
    </>
  );
};

export default ClientProviders;
