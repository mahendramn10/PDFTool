/** Small helpers for building consistent JSON-LD structured data across tool pages. */
import type { ToolDefinition } from "@/types";

export const SITE_URL = "https://pdf-tool-zeta-seven.vercel.app";
export const SITE_NAME = "PDFTool";

export function buildToolJsonLd(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.name} - ${SITE_NAME}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web-based)",
    description: tool.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: `${SITE_URL}/${tool.slug}`,
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
