import { createContext, useContext, useState } from "react";

// Define the shape of the context value (optional with TypeScript)
interface RowDataContextType {
  rowData: any;
  setRowData: (data: any) => void;
}

// Create the context
const RowDataContext = createContext<RowDataContextType | undefined>(undefined);

// Create a provider component
export const RowDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rowData, setRowData] = useState<any>(null); // You can initialize it as null or any default value

  return (
    <RowDataContext.Provider value={{ rowData, setRowData }}>
      {children}
    </RowDataContext.Provider>
  );
};

// Custom hook to use the RowDataContext
export const useRowData = () => {
  const context = useContext(RowDataContext);
  if (!context) {
    throw new Error("useRowData must be used within a RowDataProvider");
  }
  return context;
};
