import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("pdf-to-jpg")!;

export function PDFToJPGPage() {
  return <ToolPage tool={tool} />;
}
