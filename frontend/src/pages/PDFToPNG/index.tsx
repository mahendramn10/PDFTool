import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("pdf-to-png")!;

export function PDFToPNGPage() {
  return <ToolPage tool={tool} />;
}
