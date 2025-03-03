import React, { createContext, useContext, useState } from "react";

// Define the context type to include both reloadMenu and reloadKey
interface MenuReloadContextType {
  reloadMenu: () => void;
  reloadKey: number;
}

// Create the context with an initial default value
const MenuReloadContext = createContext<MenuReloadContextType>({
  reloadMenu: () => {},
  reloadKey: 0,
});

export const MenuReloadProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reloadKey, setReloadKey] = useState(0);

  const reloadMenu = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  return (
    <MenuReloadContext.Provider value={{ reloadMenu, reloadKey }}>
      {children}
    </MenuReloadContext.Provider>
  );
};

// Hook to access both reloadMenu and reloadKey
export const useMenuReload = () => useContext(MenuReloadContext);
