/**
 * A single tool tile. Styled like an index card with a folded corner on
 * hover -- a small nod to physical document handling rather than a generic
 * gradient-icon SaaS tile.
 */
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import type { ToolDefinition } from "@/types";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[tool.icon] || Icons.File;

  return (
    <Link
      to={`/${tool.slug}`}
      className="group focus-ring relative block overflow-hidden rounded-md border border-line bg-paper-raised p-5 transition-colors hover:border-ink dark:border-line-dark dark:bg-paper-raised-dark dark:hover:border-ink-dark"
    >
      {/* folded corner */}
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 h-0 w-0 border-b-[16px] border-l-[16px] border-b-transparent border-l-line transition-colors group-hover:border-l-blueprint-500 dark:border-l-line-dark"
      />
      <Icon className="h-5 w-5 text-blueprint-500" strokeWidth={1.75} />
      <h3 className="mt-4 font-display text-[15px] font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-1 text-sm leading-snug text-ink-soft dark:text-ink-soft-dark">{tool.shortDescription}</p>
    </Link>
  );
}
