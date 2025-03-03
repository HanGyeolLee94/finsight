import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
  Box,
  FormLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { apiRequestWithLoading } from "@/utils/api";
import { useAlert } from "@/context/AlertContext";

interface PasswordResetDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

export default function PasswordResetDialog({
  open,
  onClose,
  email,
}: PasswordResetDialogProps) {
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    if (!open) {
      // 다이얼로그가 닫힐 때 상태 초기화
      setNewPassword("");
      setConfirmPassword("");
      setPasswordRules({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
      });
      setPasswordError(false);
      setConfirmPasswordError(false);
    }
  }, [open]);

  const validatePassword = (password: string) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&#]/.test(password),
    };
    setPasswordRules(rules);

    const isValid = Object.values(rules).every(Boolean);
    setPasswordError(!isValid);
    return isValid;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async () => {
    if (!validatePassword(newPassword)) {
      setPasswordError(true);
      passwordRef.current?.focus();
      showAlert(
        t("bimilbeoneneunmodeunyoguhanyangeulchungjokhaeyahamnida"),
        "error"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(true);
      confirmPasswordRef.current?.focus();
      showAlert(t("bimilbeonogailchimatchianhnayo"), "error");
      return;
    }

    try {
      const result = await apiRequestWithLoading("/api/auth/change-password", {
        method: "POST",
        json: { email, password: newPassword },
      });

      showAlert(t("bimilbeonhojaeseoljeongseonggong"), "success");
      onClose();
    } catch (error) {
      showAlert(t("bimilbeonhojaeseoljeongepaehaehatseumnida"), "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
    >
      <DialogTitle>{t("bimilbeonhojaeseoljeong")}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <FormLabel htmlFor="signup-password">{t("bimilbeonho")}</FormLabel>
          <TextField
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={handlePasswordChange}
            error={passwordError}
            inputRef={passwordRef}
            autoComplete="new-password"
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <FormLabel htmlFor="signup-confirm-password">
            {t("bimilbeonhohwagin")}
          </FormLabel>
          <TextField
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
            inputRef={confirmPasswordRef}
            autoComplete="new-password"
          />
        </FormControl>

        {/* Password strength validation UI */}
        <Box>
          <Typography variant="subtitle1">
            {t("bimilbeonhogyuchik")}:
          </Typography>
          <Typography
            color={passwordRules.length ? "green" : "red"}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {passwordRules.length ? <CheckCircle /> : <Cancel />}
            {t("choeso8jaisang")}
          </Typography>
          <Typography
            color={passwordRules.uppercase ? "green" : "red"}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {passwordRules.uppercase ? <CheckCircle /> : <Cancel />}
            {t("daemunjapoham")}
          </Typography>
          <Typography
            color={passwordRules.lowercase ? "green" : "red"}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {passwordRules.lowercase ? <CheckCircle /> : <Cancel />}
            {t("soumunjapoham")}
          </Typography>
          <Typography
            color={passwordRules.number ? "green" : "red"}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {passwordRules.number ? <CheckCircle /> : <Cancel />}
            {t("sujapoham")}
          </Typography>
          <Typography
            color={passwordRules.specialChar ? "green" : "red"}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {passwordRules.specialChar ? <CheckCircle /> : <Cancel />}
            {t("teuksujachapoham")}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("chwisoh")}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t("hwakin")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
