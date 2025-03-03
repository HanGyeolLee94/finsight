// src/utils/api.ts

// 기본 API URL 설정
import { BASE_API_URL } from "@/config";
import { store } from "@/store";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { getCookie } from "./cookies";
/**
 * API 호출 함수
 * @param endpoint - API 엔드포인트 (예: '/api/login')
 * @param options - fetch 옵션 (method, headers, body 등)
 * @returns API 응답
 */

// Sleep function
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// API Request Function with json and skipAuth options
export const apiRequest = async (
  endpoint: string,
  options: RequestInit & { skipAuth?: boolean; json?: any; rawResponse?: boolean } = {}, // Added rawResponse parameter
  onSuccess?: (data: any) => void // 성공 시 호출할 콜백
) => {
  const token = getCookie("token");

  // Default header settings
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json", // Default Content-Type is JSON
  };

  // Add Authorization header if there's a token and skipAuth is not set
  if (!options.skipAuth && token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Get lang_code from cookie (default to 'en' if not present)
  const langCode = getCookie("NEXT_LOCALE") || "en"; // Fetch langCode from cookie, default to 'en'

  // Check if json is provided, and if so, merge lang_code into it
  let jsonData = options.json || {}; // Default to an empty object if json is null or undefined

  if (typeof jsonData === "object") {
    jsonData = {
      ...jsonData, // Merge any properties passed in json
      LANG_CODE: langCode, // Add the LANG_CODE field
    };
  }

  let bodyData = undefined;
  if (options.method !== "GET" && options.method !== "HEAD") {
    bodyData = JSON.stringify(jsonData);
  }

  // Merge options and prepare the final request object
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    body: bodyData,
  };

  // Make the API request
  const response = await fetch(`${BASE_API_URL}${endpoint}`, mergedOptions);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  await sleep(1000); // Simulate delay (5 seconds)

  let result;
  if (options.rawResponse) {
    result = response; // Use raw response
  } else {
    result = await response.json().catch(() => ({})); // Parse JSON
  }

  if (onSuccess) {
    onSuccess(result); // Always call onSuccess with the result
  }

  return result;
};

export const apiRequestWithLoading = async (
  endpoint: string,
  options: RequestInit & { skipAuth?: boolean; json?: any; rawResponse?: boolean } = {}, // Added rawResponse parameter
  onSuccess?: (data: any) => void // 성공 시 호출할 콜백
) => {
  try {
    store.dispatch(startLoading());
    return await apiRequest(endpoint, options, onSuccess);
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  } finally {
    store.dispatch(stopLoading());
  }
};
