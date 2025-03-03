import React from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SxProps } from "@mui/system";

interface InfoItemProps {
  title: string;
  value: string | number;
  sx?: SxProps; // sx는 MUI의 SxProps를 사용하여 추가 스타일을 적용할 수 있게 함
}

// General-purpose InfoItem 컴포넌트 생성
const InfoItem: React.FC<InfoItemProps> = ({ title, value, sx }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={sx}>
    <Typography variant="body2">{title}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Grid>
);

export default InfoItem;
