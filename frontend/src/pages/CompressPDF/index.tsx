import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("compress-pdf")!;

export function CompressPDFPage() {
  return <ToolPage tool={tool} />;
}
