/** Orchestrates upload -> process -> download for any tool, driven by a ToolDefinition. */
import { useState } from "react";
import { runTool, downloadBlob } from "@/services/pdfService";
import type { ProcessingState, ToolDefinition } from "@/types";

export function usePDFTool(tool: ToolDefinition) {
  const [state, setState] = useState<ProcessingState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultFilename, setResultFilename] = useState<string | null>(null);

  async function process(files: File[], fieldValues: Record<string, string | number>) {
    if (files.length === 0) {
      setErrorMessage("Please add a file to continue.");
      setState("error");
      return;
    }
    setState("processing");
    setErrorMessage(null);
    try {
      const result = await runTool(tool, files, fieldValues);
      downloadBlob(result.blob, result.filename);
      setResultFilename(result.filename);
      setState("done");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  function reset() {
    setState("idle");
    setErrorMessage(null);
    setResultFilename(null);
  }

  return { state, errorMessage, resultFilename, process, reset };
}
