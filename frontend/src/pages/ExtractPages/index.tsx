import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("extract-pages")!;

export function ExtractPagesPage() {
  return <ToolPage tool={tool} />;
}
