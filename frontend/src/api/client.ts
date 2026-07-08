/**
 * Axios instance configured for the PDFTool backend.
 * Centralizing this means base URL, timeouts, and error normalization
 * live in exactly one place.
 */
import axios, { AxiosError } from "axios";

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120_000, // office conversions can be slow; 2 minutes is generous
});

export interface NormalizedApiError {
  message: string;
  status?: number;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status;
    const message =
      axiosError.response?.data?.message ||
      (status === 413
        ? "This file is too large."
        : status === 415
        ? "That file type isn't supported for this tool."
        : status === 429
        ? "Too many requests -- please wait a moment and try again."
        : "Something went wrong while processing your file.");
    return { message, status };
  }
  return { message: "Something went wrong. Please try again." };
}
