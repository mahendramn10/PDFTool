import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("pdf-to-word")!;

export function PDFToWordPage() {
  return <ToolPage tool={tool} />;
}
