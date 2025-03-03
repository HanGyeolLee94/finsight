import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// Define types for item structure and layout props
interface Item {
  title: string;
  value: string;
  tooltip: string;
}

interface DynamicInfoContainerProps {
  items: Item[][] | Item[]; // Either an array of arrays (for rows) or a single array (for columns)
  layoutType: "row" | "column"; // Controls the layout type
  columnSplit?: number; // Controls the number of columns in "column" layout (from 2 to 8)
  sx?: object; // Optional styling prop
}

const DynamicInfoContainer: React.FC<DynamicInfoContainerProps> = ({
  items,
  layoutType,
  columnSplit = 4, // Default to 4 columns if not specified
  sx,
}) => {
  // Constrain columnSplit to a range of 2 to 8
  const columns = Math.min(Math.max(columnSplit, 2), 8);

  // Calculate grid sizes based on the layout and column split
  const gridSize = Math.floor(12 / columns);
  const smSize = gridSize * 2;
  const mdSize = gridSize;
  return (
    <Paper
      elevation={12}
      sx={{ padding: 2, marginTop: 2, borderRadius: 2, ...sx }}
    >
      <Grid
        container
        spacing={2}
        {...(layoutType === "row" ? { justifyContent: "space-around" } : {})}
      >
        {layoutType === "row"
          ? (items as Item[][]).map((rowItems, rowIndex) => (
              <Grid
                container
                columnSpacing={2}
                justifyContent="space-around"
                size={{ xs: 12 }}
                key={rowIndex}
              >
                {rowItems.map((item, index) => (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 3 }}
                    direction="column"
                    key={index}
                  >
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {item.title}
                      </Typography>
                      {item.tooltip && (
                        <Tooltip
                          arrow
                          title={
                            <Typography
                              variant="body1"
                              sx={{ whiteSpace: "pre-line" }}
                            >
                              {item.tooltip}
                            </Typography>
                          }
                        >
                          <IconButton size="small">
                            <HelpOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    <Typography variant="body1">{item.value}</Typography>
                  </Grid>
                ))}
              </Grid>
            ))
          : (items as Item[][]).map((colItems, colIndex) => (
              <Grid
                container
                size={{ xs: 12, sm: smSize, md: mdSize }}
                key={colIndex}
              >
                <Grid container spacing={2}>
                  {colItems.map((item, index) => (
                    <Grid size={{ xs: 12 }} key={index}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {item.title}
                        </Typography>
                        {item.tooltip && (
                          <Tooltip
                            arrow
                            title={
                              <Typography
                                variant="body1"
                                sx={{ whiteSpace: "pre-line" }}
                              >
                                {item.tooltip}
                              </Typography>
                            }
                          >
                            <IconButton size="small">
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Typography variant="body1">{item.value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
      </Grid>
    </Paper>
  );
};

export default DynamicInfoContainer;
