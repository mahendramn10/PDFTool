import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("watermark-pdf")!;

export function WatermarkPage() {
  return <ToolPage tool={tool} />;
}
