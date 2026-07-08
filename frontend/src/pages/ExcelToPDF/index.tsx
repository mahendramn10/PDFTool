import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("excel-to-pdf")!;

export function ExcelToPDFPage() {
  return <ToolPage tool={tool} />;
}
