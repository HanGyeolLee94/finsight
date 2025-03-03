import React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const PuzzleLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", // 최소 80px 유지, 최대 1fr
          gridAutoFlow: "dense", // 빈 공간을 채우기 위해 자동 정렬
          width: "100%",
          height: "100vh",
          backgroundColor: "#f0f0f0",
        }}
      >
        {Array.from({ length: 50 }, (_, index) => {
          const randomWidth = Math.floor(Math.random() * 3) + 1; // 1~3 범위의 랜덤 너비
          const randomHeight = Math.floor(Math.random() * 2) + 1; // 1~2 범위의 랜덤 높이

          return (
            <Box
              key={index}
              sx={{
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
                gridColumn: `span ${randomWidth}`,
                gridRow: `span ${randomHeight}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                borderRadius: "4px",
                boxShadow: 1,
                fontWeight: "bold",
                border: "1px solid #ddd",
              }}
            >
              {index + 1}
            </Box>
          );
        })}
      </Grid>
    </ThemeProvider>
  );
};

export default PuzzleLayout;
