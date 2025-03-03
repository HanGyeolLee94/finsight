"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card as MuiCard,
  FormControl,
  FormLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { apiRequestWithLoading } from "@/utils/api";
import { useAlert } from "@/context/AlertContext";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: "10vh",
}));

export default function SignUp() {
  const router = useRouter();
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Create refs for inputs
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const validatePassword = (password: string) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&#]/.test(password),
    };
    setPasswordRules(rules);

    return Object.values(rules).every(Boolean);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(!validatePassword(value));
  };

  const validateInputs = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      emailRef.current?.focus();
      showAlert(t("yuhyoanimeiljusoreulibryeokhaejuseyo"), "error");
      return false;
    } else {
      setEmailError(false);
    }

    if (username.trim().length === 0) {
      setUsernameError(true);
      usernameRef.current?.focus();
      showAlert(t("sayongjaireumipilyohaessseubnida"), "error");
      return false;
    } else {
      setUsernameError(false);
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      passwordRef.current?.focus();
      showAlert(
        t("bimilbeoneneunmodeunyoguhanyangeulchungjokhaeyahamnida"),
        "error"
      );
      return false;
    } else {
      setPasswordError(false);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      confirmPasswordRef.current?.focus();
      showAlert(t("bimilbeonogailchimatchianhnayo"), "error");
      return false;
    } else {
      setConfirmPasswordError(false);
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateInputs()) {
      try {
        const response = await apiRequestWithLoading("/api/auth/signup", {
          method: "POST",
          json: { username, email, password },
        });
        if (response.error) {
          setEmailError(true);
          showAlert(
            t("imeiligiimidonglogdoeeotseumnidadaleunimeileulsayonghaejuseyo"),
            "error"
          );
          emailRef.current?.focus();
        } else {
          showAlert(t("hoewongahipeisonggonghaessseubnida"), "success");
          router.push("/login");
        }
      } catch (error) {
        console.error("Sign-Up error:", error);
        showAlert(t("hoewongahipeifailhaessseubnida"), "error");
      }
    }
  };

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            textAlign: "center",
          }}
        >
          {t("hoewongayib")}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="signup-email">{t("imeil")}</FormLabel>
            <TextField
              id="signup-email"
              type="email"
              name="email" // 일반적인 필드명 유지
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              fullWidth
              variant="outlined"
              autoComplete="username" // 브라우저가 ID로 인식하도록 설정
              inputRef={emailRef}
              error={emailError}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="signup-username">
              {t("sayongjamyeong")}
            </FormLabel>
            <TextField
              id="signup-username"
              type="text"
              name="custom-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("sayongjamyeongeulibyeokhaseyo")}
              required
              fullWidth
              variant="outlined"
              autoComplete="off"
              inputRef={usernameRef}
              error={usernameError}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="signup-password">{t("bimilbeonho")}</FormLabel>
            <TextField
              id="signup-password"
              type="password"
              name="signup-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
              fullWidth
              variant="outlined"
              autoComplete="new-password"
              inputRef={passwordRef}
              error={passwordError}
            />
          </FormControl>
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
          <FormControl>
            <FormLabel htmlFor="signup-confirm-password">
              {t("bimilbeonhohwagin")}
            </FormLabel>
            <TextField
              id="signup-confirm-password"
              type="password"
              name="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              fullWidth
              variant="outlined"
              autoComplete="new-password"
              inputRef={confirmPasswordRef}
              error={confirmPasswordError}
            />
          </FormControl>
          <Button type="submit" fullWidth variant="contained">
            {t("hoewongayib")}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            {t("imigejeongiisseushingayo")}{" "}
            <Link href="/login" variant="body2">
              {t("signin")}
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
