// components/FormGrid.tsx
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import React from "react";

const StyledFormGrid = styled(Grid)(() => ({
    display: "flex",
    flexDirection: "column",
}));

interface FormGridProps {
    children: React.ReactNode;
    size?: any; // Grid size for different breakpoints
}

const FormGrid = ({ children, size }: FormGridProps) => {
    return <StyledFormGrid size={size}>{children}</StyledFormGrid>;
};

export default FormGrid;
