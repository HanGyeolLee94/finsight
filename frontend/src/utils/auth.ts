// src/utils/auth.ts

import { setCookie, getCookie, removeCookie, getAllCookies } from "./cookies";
import { NextRequest } from "next/server";
import { apiRequest } from "./api";

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    return getCookie("token") !== null;
  }
  return false;
};

// Login function to store the token and username
export const login = (param: Record<string, any>): void => {
  if (typeof window !== "undefined") {
    const { token, email, username } = param; // Extract specific keys

    // Save extracted values in cookies
    if (token) {
      setCookie("token", token);
    }

    if (email) {
      localStorage.setItem("email", email);
    }

    if (username) {
      localStorage.setItem("username", username);
    }
  }
};

// Clear cookies and localStorage when token is invalid
export const handleInvalidToken = (): void => {
  localStorage.clear();
  sessionStorage.clear();

  const keysToRemove = ["token"];

  // Remove cookies
  keysToRemove.forEach((key) => {
    removeCookie(key);
  });
};

// Logout function
export const logout = (): void => {
  if (typeof window !== "undefined") {
    handleInvalidToken();
  }
};

// Validate token on the server-side
export const validateToken = async (req: NextRequest): Promise<boolean> => {
  const token = req.cookies.get("token")?.value;
  const username = req.cookies.get("username")?.value;

  if (!token || !username) {
    console.error("Missing token or username in cookies");
    return false;
  }

  try {
    const result = await apiRequest("/api/validateToken", {
      method: "POST",
      json: { token, username },
    });
    return result?.isValid || false; // Assuming API returns { isValid: boolean }
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};
