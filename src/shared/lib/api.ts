import { runtimeConfig } from "./runtimeConfig";

const sanitizeApiBaseUrl = (value: string): string => {
  if (!value) return "";
  if (value.includes("=") && !/^https?:\/\//i.test(value)) return "";
  return value.replace(/\/$/, "");
};

const normalizedApiBaseUrl = sanitizeApiBaseUrl(runtimeConfig.apiBaseUrl);

export const buildApiUrl = (path: string): string => {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with '/': ${path}`);
  }
  return normalizedApiBaseUrl ? `${normalizedApiBaseUrl}${path}` : path;
};
