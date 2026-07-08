import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("split-pdf")!;

export function SplitPDFPage() {
  return <ToolPage tool={tool} />;
}
