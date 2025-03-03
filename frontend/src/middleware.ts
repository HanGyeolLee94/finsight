import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { i18nRouter } from "next-i18n-router";
import i18nConfig from "./i18nConfig";

// Secret key setting
const secret = new TextEncoder().encode(process.env.FINSIGHT_JWT_SECRET);

// JWT token validation function
async function validateToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return true; // Valid token
  } catch (error) {
    console.error("Token validation failed:", error);
    return false; // Invalid token
  }
}

// Middleware function
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 1. Allow access to /signup without restrictions
  if (pathname === "/signup") {
    return i18nRouter(req, i18nConfig); // Allow access to /signup
  }

  // 2. If user is already logged in and tries to access /login, redirect to home
  if (pathname === "/login" && token) {
    const isValid = await validateToken(token);
    if (isValid) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect to home
    }
  }

  // 3. If user is not logged in and tries to access any protected page, redirect to /login
  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return i18nRouter(req, i18nConfig); // Allow access to /login if not logged in
  }

  // 4. If token is present, validate it
  const isValid = await validateToken(token);
  if (!isValid) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token"); // Delete invalid token
    return response;
  }

  // 5. If token is valid, proceed as normal
  return i18nRouter(req, i18nConfig); // Proceed with i18nRouter
}

// Matcher config: apply middleware to all paths except API and static files
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
