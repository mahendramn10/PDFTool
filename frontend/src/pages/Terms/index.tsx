import { SEO } from "@/components/common/SEO";

export function TermsPage() {
  return (
    <>
      <SEO title="Terms of Service" description="Terms and conditions for using PDFTool." path="/terms" />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Legal</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Terms of service</h1>
        <p className="mt-4 font-mono text-xs text-ink-soft dark:text-ink-soft-dark">
          Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div className="mt-6 space-y-6 leading-relaxed text-ink-soft dark:text-ink-soft-dark">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Use of the service</h2>
            <p className="mt-2">
              PDFTool is provided free of charge for personal and commercial use. You agree not to
              use the service to process files containing illegal content, or to attempt to disrupt,
              overload, or reverse-engineer the service.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">No warranty</h2>
            <p className="mt-2">
              PDFTool is provided "as is" without warranty of any kind. While we take reasonable
              steps to ensure reliability, we are not liable for any loss of data or damages
              resulting from use of the service. Always keep a backup of your original files.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Fair use &amp; rate limits</h2>
            <p className="mt-2">
              To keep the service fast and free for everyone, requests are subject to reasonable
              rate limits and a per-file size limit.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Changes</h2>
            <p className="mt-2">
              We may update these terms from time to time. Continued use of the service constitutes
              acceptance of the updated terms.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
