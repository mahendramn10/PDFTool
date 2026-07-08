import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("merge-pdf")!;

export function MergePDFPage() {
  return <ToolPage tool={tool} />;
}
