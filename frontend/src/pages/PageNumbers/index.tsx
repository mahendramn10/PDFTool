import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("page-numbers")!;

export function PageNumbersPage() {
  return <ToolPage tool={tool} />;
}
