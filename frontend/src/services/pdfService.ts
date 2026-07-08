/**
 * Service layer: wraps every tool call as a typed function that posts
 * FormData to the backend and returns a downloadable Blob + suggested
 * filename. Pages import from here, never touch axios directly.
 */
import { apiClient, normalizeApiError } from "@/api/client";
import type { ToolDefinition } from "@/types";

export interface ToolResult {
  blob: Blob;
  filename: string;
}

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename="?([^";]+)"?/);
  return match?.[1] || fallback;
}

export async function runTool(
  tool: ToolDefinition,
  files: File[],
  fieldValues: Record<string, string | number>
): Promise<ToolResult> {
  const formData = new FormData();

  if (tool.multipleFiles) {
    files.forEach((f) => formData.append("files", f));
  } else {
    formData.append("file", files[0]);
  }

  Object.entries(fieldValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });

  try {
    const response = await apiClient.post(tool.endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    });
    const filename = extractFilename(response.headers["content-disposition"], "output");
    return { blob: response.data, filename };
  } catch (error) {
    // If the server returned a JSON error blob (since responseType is blob),
    // parse it to surface the real message instead of a generic one.
    if (error && typeof error === "object" && "response" in (error as Record<string, unknown>)) {
      const axiosErr = error as { response?: { data?: Blob } };
      const data = axiosErr.response?.data;
      if (data instanceof Blob && data.type.includes("json")) {
        try {
          const text = await data.text();
          const parsed = JSON.parse(text);
          throw new Error(parsed.message || "Processing failed.");
        } catch {
          // fall through to generic normalization
        }
      }
    }
    const normalized = normalizeApiError(error);
    throw new Error(normalized.message);
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
