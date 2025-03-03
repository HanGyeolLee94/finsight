import * as React from "react";
import { Box, Card, CardContent, Typography, Link } from "@mui/material";
import { scrollableStyles } from "@/utils/scrollbarStyles";

export type TickerProps = {
  SYMBOL: string;
  NAME: string;
  CHANGES_DISPLAY: string;
  PRICE: number;
  TREND: "up" | "down";
};

export default function TickerList({
  title,
  data,
  onTitleClick,
  height = "20rem", // Default height using rem
}: {
  title: string;
  data: TickerProps[];
  onTitleClick: () => void;
  height?: string | number; // Height can be a string (e.g., "20rem") or a number (e.g., 300 for px)
}) {
  return (
    <Card variant="outlined" sx={{ mb: 2, height: "auto" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            cursor: "pointer",
            display: "inline-block",
            "&:hover": {
              color: "primary.main",
            },
          }}
          onClick={onTitleClick}
        >
          {title}
        </Typography>
        <Box
          sx={{
            height: height, // Use height directly
            ...scrollableStyles,
          }}
        >
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom:
                  index !== data.length - 1 ? "1px solid #e0e0e0" : "none",
                paddingY: 1,
                paddingRight: 1.5,
              }}
            >
              {/* Left Section */}
              <Box sx={{ flex: "1 1 60%" }}>
                <Link
                  href={`/stock/stock-list/${item.SYMBOL}`}
                  underline="hover"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {item.SYMBOL}
                  </Typography>
                </Link>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.NAME}
                </Typography>
              </Box>
              {/* Right Section */}
              <Box sx={{ flex: "1 1 40%", textAlign: "right" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {item.PRICE}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: item.TREND === "up" ? "success.main" : "error.main",
                  }}
                >
                  {item.CHANGES_DISPLAY}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
