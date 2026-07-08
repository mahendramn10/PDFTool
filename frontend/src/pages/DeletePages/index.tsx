import { ToolPage } from "@/pages/ToolPage";
import { getToolBySlug } from "@/constants/tools";

const tool = getToolBySlug("delete-pages")!;

export function DeletePagesPage() {
  return <ToolPage tool={tool} />;
}
