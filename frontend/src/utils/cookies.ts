// src/utils/cookies.ts

export const setCookie = (
  key: string,
  value: string,
  options: { expires?: number; path?: string } = {}
) => {
  let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)};`;

  // Remove expiration to make it a session cookie
  if (options.expires) {
    const date = new Date();
    date.setDate(date.getDate() + options.expires);
    cookieString += `expires=${date.toUTCString()};`; // Remove this line
  }

  // Set path (default to root)
  cookieString += `path=${options.path || "/"}; SameSite=Lax`;

  // Assign the cookie
  document.cookie = cookieString;
};

export const getCookie = (key: string): string | null => {
  const matches = document.cookie.match(
    new RegExp(
      `(?:^|; )${key.replace(/([$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

export const removeCookie = (key: string) => {
  document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
};

export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};

  document.cookie.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=").map((item) => item.trim());
    if (key) {
      cookies[decodeURIComponent(key)] = decodeURIComponent(value || "");
    }
  });

  return cookies;
};
