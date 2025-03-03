import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { apiRequestWithLoading } from "@/utils/api";
import { useAlert } from "@/context/AlertContext";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const { t } = useTranslation();
  const [email, setEmail] = React.useState("");
  const { showAlert } = useAlert();

  // Clear email when dialog opens
  React.useEffect(() => {
    if (open) {
      setEmail(""); // Reset email to an empty string
    }
  }, [open]);

  const handleSendPassword = async () => {
    if (!email) {
      showAlert(t("imeiljusoreulibyeokhaseyo"), "warning");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert(t("yuhyohanimailjusoreulibyeokhaseyo"), "warning");
      return;
    }

    try {
      // Proceed with password reset if the email exists
      const result = await apiRequestWithLoading(
        "/api/auth/send-new-password",
        {
          method: "POST",
          json: { email },
          skipAuth: true,
        }
      );

      if (result.STATUS === "SUCCESS") {
        showAlert(t("imsiimeilbimilbeonhogajangsongdoeeotseumnida"), "success");
        handleClose();
      } else {
        showAlert(t("bimilbeonhojaeseoljeongepaehaehatseumnida"), "error");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      showAlert(t("imeiljeonsongjungoryugabalssaenghatseumnida"), "error");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSendPassword();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("bimilbeonhojaeseoljeong")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(
            "gyejeonguiimeiljusoreulipryeokhasimyeonimsibimilbeonhoreulbonaedeurip"
          )}
        </DialogContentText>
        <FormControl fullWidth margin="dense">
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            placeholder={t("imeiljuso")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update local state
            onKeyDown={handleKeyDown} // Detect Enter key press
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>{t("chwisoh")}</Button>
        <Button variant="contained" onClick={handleSendPassword}>
          {t("hwakin")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
