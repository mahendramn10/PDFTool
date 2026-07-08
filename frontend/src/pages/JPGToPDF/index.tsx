import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("jpg-to-pdf")!;

export function JPGToPDFPage() {
  return <ToolPage tool={tool} />;
}
