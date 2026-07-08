import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { Card } from "@/components/ui/Card";

const POSTS = [
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files Online for Free",
    excerpt: "A quick guide to combining multiple PDFs into a single document without installing any software.",
    date: "2026-06-01",
  },
  {
    slug: "compress-pdf-without-losing-quality",
    title: "How to Compress a PDF Without Losing Quality",
    excerpt: "Understand how PDF compression works and how to pick the right quality preset for your file.",
    date: "2026-05-20",
  },
  {
    slug: "pdf-to-word-conversion-tips",
    title: "Getting the Best Results Converting PDF to Word",
    excerpt: "Tips for preserving formatting, tables, and images when converting PDFs to editable Word documents.",
    date: "2026-05-05",
  },
];

export function BlogPage() {
  return (
    <>
      <SEO title="Blog" description="Guides and tips for working with PDF files." path="/blog" />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Reading</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-3 text-ink-soft dark:text-ink-soft-dark">Guides, tips, and updates from the PDFTool team.</p>

        <div className="mt-10 space-y-4">
          {POSTS.map((post) => (
            <Card key={post.slug} className="p-6 transition-colors hover:border-ink dark:hover:border-ink-dark">
              <Link to={`/blog/${post.slug}`}>
                <p className="font-mono text-[11px] uppercase tracking-wide text-blueprint-500">{post.date}</p>
                <h2 className="mt-2 font-display text-xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-ink-soft dark:text-ink-soft-dark">{post.excerpt}</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
