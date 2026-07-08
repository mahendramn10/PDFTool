import { SEO } from "@/components/common/SEO";

export function AboutPage() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about PDFTool's mission to provide fast, secure, and free PDF tools for everyone."
        path="/about"
      />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Company</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">About PDFTool</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-ink-soft dark:text-ink-soft-dark">
          <p>
            PDFTool started with a simple goal: give everyone access to reliable PDF tools without
            paywalls, forced sign-ups, or watermarks. Whether you're a student merging lecture notes,
            a freelancer compressing a portfolio, or a business converting invoices, PDFTool handles
            it in a few clicks.
          </p>
          <p>
            Every file you upload is processed on our servers and deleted automatically shortly after
            your download completes &mdash; we don't keep copies, and we don't read your documents.
            Our processing pipeline relies entirely on open-source, industry-standard libraries, so
            we're never dependent on a paid third-party API to keep the tools running.
          </p>
          <p>
            We're actively building toward a much larger toolkit: OCR, AI-assisted PDF editing, user
            accounts with saved history, and a public API. See our roadmap for what's coming next.
          </p>
        </div>
      </section>
    </>
  );
}
