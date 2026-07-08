import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("png-to-pdf")!;

export function PNGToPDFPage() {
  return <ToolPage tool={tool} />;
}
