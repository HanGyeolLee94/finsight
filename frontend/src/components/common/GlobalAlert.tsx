"use client";

import {
  SlideProps,
  Slide,
  Snackbar,
  Alert,
  Box,
  SnackbarOrigin,
} from "@mui/material";

// Define the slide animation
const TransitionSlide: React.FC<SlideProps> = (props) => {
  return <Slide {...props} direction="up" />;
};

const GlobalAlert: React.FC<{
  alerts: any[];
  closeAlert: (id: number) => void;
}> = ({ alerts, closeAlert }) => {
  // 그룹화: position 별로 alerts를 묶음
  const groupedAlerts = alerts.reduce(
    (groups: Record<string, any[]>, alert) => {
      const positionKey = JSON.stringify(
        alert.options?.position || { vertical: "bottom", horizontal: "left" }
      );
      groups[positionKey] = groups[positionKey] || [];
      groups[positionKey].push(alert);
      return groups;
    },
    {}
  );

  return (
    <>
      {Object.entries(groupedAlerts).map(([positionKey, groupedAlerts]) => {
        const position: SnackbarOrigin = JSON.parse(positionKey);

        return (
          <Snackbar
            key={positionKey}
            open={groupedAlerts.length > 0}
            TransitionComponent={TransitionSlide}
            anchorOrigin={position}
            sx={{
              // 위치와 상관없이 알림 간 간격을 줄 수 있음
              "& .MuiAlert-root": { mb: 1 },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {groupedAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  onClose={() => closeAlert(alert.id)}
                  severity={alert.severity} // 'success', 'info', 'warning', 'error'
                  variant="filled"
                >
                  {alert.message}
                </Alert>
              ))}
            </Box>
          </Snackbar>
        );
      })}
    </>
  );
};

export default GlobalAlert;
