/** Hook encapsulating drag/drop + click-to-browse file selection with validation. */
import { useCallback, useState } from "react";

interface UseFileUploadOptions {
  acceptedFileTypes: string[];
  multiple: boolean;
  maxSizeMB?: number;
}

interface UseFileUploadReturn {
  files: File[];
  isDragging: boolean;
  error: string | null;
  addFiles: (fileList: FileList | File[]) => void;
  removeFile: (index: number) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  clearFiles: () => void;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

export function useFileUpload({ acceptedFileTypes, multiple, maxSizeMB = 50 }: UseFileUploadOptions): UseFileUploadReturn {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (candidate: File): string | null => {
      const ext = "." + (candidate.name.split(".").pop() || "").toLowerCase();
      if (!acceptedFileTypes.includes(ext)) {
        return `"${candidate.name}" isn't a supported file type for this tool.`;
      }
      if (candidate.size > maxSizeMB * 1024 * 1024) {
        return `"${candidate.name}" exceeds the ${maxSizeMB}MB limit.`;
      }
      return null;
    },
    [acceptedFileTypes, maxSizeMB]
  );

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      for (const f of incoming) {
        const validationError = validate(f);
        if (validationError) {
          setError(validationError);
          return;
        }
      }
      setError(null);
      setFiles((prev) => (multiple ? [...prev, ...incoming] : [incoming[0]]));
    },
    [multiple, validate]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  return {
    files,
    isDragging,
    error,
    addFiles,
    removeFile,
    reorderFiles,
    clearFiles,
    dragHandlers: { onDragOver, onDragLeave, onDrop },
  };
}
