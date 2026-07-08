import { motion } from "framer-motion";
import { useState } from "react";
import { SEO } from "@/components/common/SEO";
import { ToolCard } from "@/components/pdf/ToolCard";
import { RegistrationMarks } from "@/components/ui/RegistrationMarks";
import { StampBadge } from "@/components/ui/StampBadge";
import { TOOLS, TOOL_CATEGORIES } from "@/constants/tools";
import type { ToolCategory } from "@/types";

const REASONS = [
  {
    title: "Seconds, not minutes",
    description: "Most tools finish before the upload progress bar even feels done.",
  },
  {
    title: "Nothing kept",
    description: "Every file is deleted from our servers automatically once your download starts.",
  },
  {
    title: "Every tool, free",
    description: "No paywalls, no forced accounts, no watermark stamped across your document.",
  },
];

export function Home() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");
  const filteredTools = activeCategory === "all" ? TOOLS : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <>
      <SEO
        title="Fast, Secure & Free PDF Tools"
        description="Merge, split, compress, convert, and edit PDF files online for free. Fast, secure, and no sign-up required."
        path="/"
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line dark:border-line-dark">
        <div className="bg-blueprint-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <RegistrationMarks />

          <div className="mx-auto max-w-2xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl"
            >
              Every page,
              <br />
              exactly as you need it.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="mx-auto mt-5 max-w-lg text-lg text-ink-soft dark:text-ink-soft-dark"
            >
              Merge, split, compress, and convert PDFs in seconds &mdash; right in your browser.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <a
                href="#tools"
                className="focus-ring rounded-md bg-ink px-6 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-blueprint-600 dark:bg-ink-dark dark:text-paper-dark"
              >
                Start with a file
              </a>
              <StampBadge rotate={-3}>Free</StampBadge>
              <StampBadge rotate={2}>No sign-up</StampBadge>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line dark:border-line-dark dark:bg-line-dark sm:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="bg-paper p-6 dark:bg-paper-dark">
              <h3 className="font-display text-base font-semibold">{reason.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-ink-soft-dark">{reason.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool grid */}
      <section id="tools" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6 dark:border-line-dark">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Toolkit</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">All tools</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`focus-ring rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                activeCategory === "all"
                  ? "bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark"
                  : "text-ink-soft hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark"
              }`}
            >
              All
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`focus-ring rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  activeCategory === cat.value
                    ? "bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark"
                    : "text-ink-soft hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </>
  );
}
