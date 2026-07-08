import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("word-to-pdf")!;

export function WordToPDFPage() {
  return <ToolPage tool={tool} />;
}
