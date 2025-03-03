import React from "react";
import { Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SxProps } from "@mui/system";

// InfoItem 컴포넌트
interface InfoItemProps {
  title: string;
  value: string | number;
  sx?: SxProps;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value, sx }) => (
  <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={sx}>
    <Typography variant="body2">{title}</Typography>
    <Typography variant="body1">{value}</Typography>
  </Grid>
);

// InfoContainer 컴포넌트
interface InfoContainerProps {
  children: React.ReactNode;
  direction?: "row" | "column"; // 방향을 지정할 수 있는 prop
  sx?: SxProps;
}

const InfoContainer: React.FC<InfoContainerProps> = ({
  children,
  direction = "row",
  sx,
}) => (
  <Paper
    elevation={1}
    sx={{
      padding: 2,
      marginTop: 2,
      borderRadius: 2,
      ...sx,
    }}
  >
    <Grid
      container
      spacing={2}
      direction={direction === "row" ? "row" : "column"} // direction에 따라 가로 또는 세로 방향으로 정렬
    >
      {children}
    </Grid>
  </Paper>
);

// 사용 예시
const col1Items = [
  { title: "Previous Close", value: "41.63" },
  { title: "Open", value: "41.89" },
  { title: "Day's Range", value: "39.65 - 41.96" },
  { title: "52 Week Range", value: "30.93 - 62.31" },
];

const col2Items = [
  { title: "Market Cap (intraday)", value: "6.097B" },
  { title: "Beta (5Y Monthly)", value: "--" },
  { title: "PE Ratio (TTM)", value: "10.34" },
  { title: "EPS (TTM)", value: "4.00" },
];

const col3Items = [
  { title: "1y Target Est", value: "55.93" },
  { title: "Earnings", value: "Feb 1, 2025 - Feb 11, 2025" },
  { title: "Forward Dividend & Yield", value: "--" },
  { title: "Ex-Dividend Date", value: "--" },
];

// InfoSection 컴포넌트 예시
const InfoSection = () => (
  <InfoContainer direction="column">
    {" "}
    {/* row 방향으로 설정 */}
    {/* 첫 번째 열 */}
    <Grid size={{ xs: 12, sm: 6, md: 3 }} spacing={2}>
      {col1Items.map((item, index) => (
        <InfoItem key={index} title={item.title} value={item.value} />
      ))}
    </Grid>
    {/* 두 번째 열 */}
    <Grid size={{ xs: 12, sm: 6, md: 3 }} spacing={2}>
      {col2Items.map((item, index) => (
        <InfoItem key={index} title={item.title} value={item.value} />
      ))}
    </Grid>
    {/* 세 번째 열 */}
    <Grid size={{ xs: 12, sm: 6, md: 3 }} spacing={2}>
      {col3Items.map((item, index) => (
        <InfoItem key={index} title={item.title} value={item.value} />
      ))}
    </Grid>
    {/* 네 번째 열 - 빈 항목 추가 */}
    <Grid size={{ xs: 12, sm: 6, md: 3 }} spacing={2}>
      <InfoItem title="" value="" />
      <InfoItem title="" value="" />
      <InfoItem title="" value="" />
      <InfoItem title="" value="" />
    </Grid>
  </InfoContainer>
);

export default InfoSection;
