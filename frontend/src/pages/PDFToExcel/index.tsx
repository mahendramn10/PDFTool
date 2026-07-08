import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("pdf-to-excel")!;

export function PDFToExcelPage() {
  return <ToolPage tool={tool} />;
}
