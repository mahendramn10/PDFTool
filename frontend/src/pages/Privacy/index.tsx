import { SEO } from "@/components/common/SEO";

export function PrivacyPage() {
  return (
    <>
      <SEO title="Privacy Policy" description="How PDFTool handles your files and data." path="/privacy" />
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Legal</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Privacy policy</h1>
        <p className="mt-4 font-mono text-xs text-ink-soft dark:text-ink-soft-dark">
          Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <div className="mt-6 space-y-6 leading-relaxed text-ink-soft dark:text-ink-soft-dark">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Files you upload</h2>
            <p className="mt-2">
              Files you upload are transmitted over an encrypted (HTTPS) connection, processed in an
              isolated, per-request working directory, and automatically deleted from our servers
              within 30 minutes &mdash; typically within seconds of your download completing. We do
              not inspect, read, or share the contents of your documents.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Analytics</h2>
            <p className="mt-2">
              We may collect anonymized usage data (which tools are used, general error rates) to
              improve the product. This data is never linked to the contents of your files.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Accounts</h2>
            <p className="mt-2">
              If you create an account, we store your email address and a securely hashed password.
              We never store passwords in plain text.
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">Contact</h2>
            <p className="mt-2">Questions about this policy? Reach out via our contact page.</p>
          </div>
        </div>
      </section>
    </>
  );
}
