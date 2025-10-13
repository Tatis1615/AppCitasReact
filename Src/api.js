import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "./Config";

/**
 * fetchWithAuth
 * - path: string relative to API_BASE_URL (e.g., "/medicos") or absolute http(s) URL
 * - options: standard fetch options; headers will be merged and Authorization added when a token exists
 */
export async function fetchWithAuth(path, options = {}) {
  const token = await AsyncStorage.getItem("token");

  const url = /^https?:\/\//.test(path)
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const defaultHeaders = {
    Accept: "application/json",
  };

  // If the body is present and Content-Type isn't set, default to JSON
  const hasBody = options && options.body !== undefined && options.body !== null;
  if (hasBody) {
    defaultHeaders["Content-Type"] = defaultHeaders["Content-Type"] || "application/json";
  }

  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const finalOptions = {
    method: options.method || (hasBody ? "POST" : "GET"),
    ...options,
    headers,
  };

  return fetch(url, finalOptions);
}
