"use client";
import { FinSightLogo } from "@/components/icons/CustomIcons";
import { apiRequestWithLoading } from "@/utils/api";
import { login } from "@/utils/auth";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import { useFetchAndStoreMenu } from "@/utils/menuUtils";
import { useAlert } from "@/context/AlertContext";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Card as MuiCard,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ForgotPassword from "./ForgotPassword";
import PasswordResetDialog from "./PasswordResetDialog";
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
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: "10vh",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  const { showAlert } = useAlert();
  const router = useRouter();
  const { t } = useTranslation();
  const fetchAndStoreMenu = useFetchAndStoreMenu();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = React.useState("");

  // Pre-fill the email and rememberMe from cookies
  useEffect(() => {
    const savedEmail = getCookie("rememberMeEmail");
    const savedRememberMe = getCookie("rememberMe");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(savedRememberMe === "true"); // Convert string to boolean
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
  };

  const validateInputs = () => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!emailInput.value || !/\S+@\S+\.\S+/.test(emailInput.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };
  const handleLoginSuccess = async (result: any, loginEmail: string) => {
    let { defaultPagePath, pwResetRequired } = result;

    if (pwResetRequired === "Y") {
      setResetDialogOpen(true); // 비밀번호 재설정 팝업 열기
      return; // 추가 작업 방지
    }

    defaultPagePath = defaultPagePath || "/";

    // 토큰 저장 및 로그인 처리
    login(result);

    // 이메일 및 '기억하기' 상태를 쿠키에 저장
    if (rememberMe) {
      setCookie("rememberMeEmail", loginEmail, { expires: 7 });
      setCookie("rememberMe", "true", { expires: 7 });
    } else {
      removeCookie("rememberMeEmail");
      removeCookie("rememberMe");
    }

    // 메뉴 데이터를 가져와 저장
    await fetchAndStoreMenu();

    // 해당 페이지로 이동
    router.push(`${window.location.origin}${defaultPagePath}`);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      const email = data.get("email") as string | "";
      const password = data.get("password") as string | "";

      try {
        // Example of sending a login request to the backend API
        const result = await apiRequestWithLoading("/api/auth/login", {
          method: "POST",
          json: { email, password },
          skipAuth: true, // skipAuth 플래그를 options에 설정
        });
        console.log(result);
        handleLoginSuccess(result, email);
      } catch (error) {
        console.error("Login error:", error);
        showAlert(t("loginefailhaessseubnida"), "error");
      }
    }
  };
  const handlePasswordResetClose = async () => {
    setResetDialogOpen(false);

    // 비밀번호 입력 필드를 초기화하고 포커스 맞추기
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.focus();
    }
  };
  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <FinSightLogo size="large" />
        {/* <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          FinSight
        </Typography> */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">{t("imeil")}</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
              sx={{ ariaLabel: "email" }}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="password">{t("bimilbeonho")}</FormLabel>
              <Link
                component="button"
                onClick={handleClickOpen}
                variant="body2"
                name="forgotPassword"
                type="button"
                sx={{ alignSelf: "baseline" }}
              >
                {t("bimilbeonhoiljeusyeotnayo")}
              </Link>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
            }
            label={t("aidijajeong")}
          />
          <ForgotPassword open={open} handleClose={handleClose} />
          <PasswordResetDialog
            open={resetDialogOpen}
            onClose={handlePasswordResetClose}
            email={email}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            {t("signin")}
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            {t("gyejeongieopseusinkayo")}{" "}
            <span>
              <Link href="/signup" variant="body2" sx={{ alignSelf: "center" }}>
                {t("hoewongaeip")}
              </Link>
            </span>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
}
