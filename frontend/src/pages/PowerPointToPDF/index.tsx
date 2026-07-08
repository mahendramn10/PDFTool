import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("powerpoint-to-pdf")!;

export function PowerPointToPDFPage() {
  return <ToolPage tool={tool} />;
}
