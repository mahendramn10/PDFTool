/** Drag-and-drop + click-to-browse upload zone, styled like a document intake tray. */
import { useRef } from "react";
import { UploadCloud, X, FileText } from "lucide-react";
import { formatBytes } from "@/utils/formatBytes";

interface FileDropzoneProps {
  files: File[];
  isDragging: boolean;
  error: string | null;
  acceptedFileTypes: string[];
  multiple: boolean;
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveFile: (index: number) => void;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

export function FileDropzone({
  files,
  isDragging,
  error,
  acceptedFileTypes,
  multiple,
  onAddFiles,
  onRemoveFile,
  dragHandlers,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full">
      <div
        {...dragHandlers}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={`focus-ring flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-16 text-center transition-colors ${
          isDragging
            ? "border-blueprint-500 bg-blueprint-50 dark:bg-blueprint-500/5"
            : "border-line hover:border-ink dark:border-line-dark dark:hover:border-ink-dark"
        }`}
      >
        <UploadCloud className="mb-3 h-8 w-8 text-blueprint-500" strokeWidth={1.5} />
        <p className="font-display text-base font-medium">
          Drop {multiple ? "files" : "a file"} here, or <span className="text-blueprint-500">browse</span>
        </p>
        <p className="mt-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
          {acceptedFileTypes.join(" · ")} — up to 50MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFileTypes.join(",")}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && onAddFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-stamp-500">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border border-line bg-paper px-4 py-3 dark:border-line-dark dark:bg-paper-dark"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-4 w-4 shrink-0 text-blueprint-500" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(index);
                }}
                className="focus-ring rounded-md p-1.5 text-ink-soft hover:text-stamp-500 dark:text-ink-soft-dark"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
