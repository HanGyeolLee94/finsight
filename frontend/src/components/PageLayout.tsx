// src/components/PageLayout.tsx
import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        mx: 3,
        pb: 10,
        pt: 3,
        mt: { xs: 8, md: 0 },
      }}
    >
      {children}
    </Stack>
  );
}
