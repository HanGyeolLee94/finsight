import React from "react";
import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";

interface InfoContainerProps {
  children: React.ReactNode; // children의 타입을 명시적으로 지정
  sx?: object; // sx prop을 optional로 지정
}

const InfoContainer: React.FC<InfoContainerProps> = ({ children, sx }) => (
  <Paper
    elevation={1}
    sx={{ padding: 2, marginTop: 2, borderRadius: 2, ...sx }}
  >
    {children}
  </Paper>
);

export default InfoContainer;
