import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("rearrange-pages")!;

export function RearrangePagesPage() {
  return <ToolPage tool={tool} />;
}
