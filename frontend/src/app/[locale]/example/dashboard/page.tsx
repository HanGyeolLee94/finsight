"use client";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Header from "@/components/Header";
import MainGrid from "@/components/MainGrid";

export default function DashboardPage() {
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        mx: 3,
        pb: 10,
        mt: { xs: 8, md: 0 },
      }}
    >
      <Header />
      <MainGrid />
    </Stack>
  );
}
