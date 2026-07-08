/**
 * Generic tool page: given a ToolDefinition, renders the full upload ->
 * configure -> process -> download flow. Every /pages/<Tool>/index.tsx
 * file is a 3-line wrapper around this component with its own tool slug,
 * which keeps routing/SEO per-page while avoiding 18x duplicated logic.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { FileDropzone } from "@/components/pdf/FileDropzone";
import { ToolOptionsForm } from "@/components/pdf/ToolOptionsForm";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/common/Loader";
import { SEO } from "@/components/common/SEO";
import { useFileUpload } from "@/hooks/useFileUpload";
import { usePDFTool } from "@/hooks/usePDFTool";
import { buildToolJsonLd, buildBreadcrumbJsonLd, SITE_URL } from "@/utils/seo";
import type { ToolDefinition } from "@/types";

export function ToolPage({ tool }: { tool: ToolDefinition }) {
  const { files, isDragging, error, addFiles, removeFile, dragHandlers } = useFileUpload({
    acceptedFileTypes: tool.acceptedFileTypes,
    multiple: tool.multipleFiles,
  });
  const { state, errorMessage, process, reset } = usePDFTool(tool);
  const [fieldValues, setFieldValues] = useState<Record<string, string | number>>(
    Object.fromEntries((tool.fields ?? []).map((f) => [f.name, f.defaultValue ?? ""]))
  );

  const jsonLd = [
    buildToolJsonLd(tool),
    buildBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: tool.name, url: `${SITE_URL}/${tool.slug}` },
    ]),
  ];

  return (
    <>
      <SEO title={tool.name} description={tool.description} path={`/${tool.slug}`} jsonLd={jsonLd} />

      <section className="border-b border-line dark:border-line-dark">
        <div className="mx-auto max-w-2xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">
              {tool.category}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{tool.name}</h1>
            <p className="mt-3 text-base text-ink-soft dark:text-ink-soft-dark">{tool.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        {(state === "idle" || state === "error") && (
          <div className="space-y-6">
            <FileDropzone
              files={files}
              isDragging={isDragging}
              error={error}
              acceptedFileTypes={tool.acceptedFileTypes}
              multiple={tool.multipleFiles}
              onAddFiles={addFiles}
              onRemoveFile={removeFile}
              dragHandlers={dragHandlers}
            />

            {tool.fields && (
              <ToolOptionsForm
                fields={tool.fields}
                values={fieldValues}
                onChange={(name, value) => setFieldValues((prev) => ({ ...prev, [name]: value }))}
              />
            )}

            {state === "error" && errorMessage && (
              <div className="flex items-start gap-2 rounded-md border border-stamp-500/30 bg-stamp-500/5 p-3 text-sm text-stamp-600 dark:text-stamp-500">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button size="lg" className="w-full" disabled={files.length === 0} onClick={() => process(files, fieldValues)}>
              {tool.outputLabel}
            </Button>
          </div>
        )}

        {state === "processing" && <Loader label={`Processing your file${files.length > 1 ? "s" : ""}`} />}

        {state === "done" && (
          <div className="flex flex-col items-center gap-4 rounded-md border border-line py-12 text-center dark:border-line-dark">
            <CheckCircle2 className="h-9 w-9 text-blueprint-500" strokeWidth={1.5} />
            <div>
              <p className="font-display font-medium">Your download has started</p>
              <p className="mt-1 text-sm text-ink-soft dark:text-ink-soft-dark">
                This file is deleted from our servers shortly after processing.
              </p>
            </div>
            <Button variant="secondary" onClick={reset}>
              Process another file
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
