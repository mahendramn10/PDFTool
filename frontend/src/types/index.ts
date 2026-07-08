/** Shared TypeScript types across the PDFTool frontend. */

export type ToolCategory = "organize" | "optimize" | "convert" | "edit";

export type FieldType = "text" | "number" | "select" | "range";

export interface ToolFieldOption {
  label: string;
  value: string;
}

export interface ToolField {
  name: string;
  label: string;
  type: FieldType;
  defaultValue?: string | number;
  options?: ToolFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  icon: string; // lucide-react icon name
  endpoint: string; // backend path, relative to API base, e.g. "/pdf/merge"
  acceptedFileTypes: string[]; // e.g. [".pdf"]
  multipleFiles: boolean;
  outputLabel: string; // e.g. "Download merged PDF"
  fields?: ToolField[];
  color: string; // tailwind gradient class suffix, used for the tool card accent
}

export interface UploadedFile {
  id: string;
  file: File;
  previewUrl?: string;
}

export type ProcessingState = "idle" | "uploading" | "processing" | "done" | "error";

export interface ApiErrorShape {
  success: false;
  message: string;
  errors?: unknown;
}
