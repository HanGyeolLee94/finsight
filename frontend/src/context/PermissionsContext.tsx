import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

interface Permission {
  PATH?: string;
  MENU_ID: string;
  CAN_EDIT: string;
  CAN_VIEW?: string;
  CAN_DELETE?: string;
}

interface PermissionsContextType {
  permissions: Permission[];
  getCurrentPermissions: () => {
    canEdit: boolean;
  }; // Function to fetch permissions for current path
  setPermissions: (newPermissions: Permission[]) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export const PermissionsProvider: React.FC<{
  children: React.ReactNode;
  initialPermissions: Permission[];
}> = ({ children, initialPermissions }) => {
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);
  const pathname = usePathname(); // 현재 경로 가져오기
  // Helper function to fetch permissions for the current path
  const getCurrentPermissions = () => {
    const permission = permissions
      .filter((perm) => pathname.startsWith(perm.PATH || ""))
      .sort((a, b) => (b.PATH?.length || 0) - (a.PATH?.length || 0))[0]; // 가장 구체적인 경로 찾기
    return {
      canEdit: permission?.CAN_EDIT === "Y",
    };
  };

  return (
    <PermissionsContext.Provider
      value={{ permissions, getCurrentPermissions, setPermissions }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};
