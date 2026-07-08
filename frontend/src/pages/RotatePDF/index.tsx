import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("rotate-pdf")!;

export function RotatePDFPage() {
  return <ToolPage tool={tool} />;
}
