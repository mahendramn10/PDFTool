import { useState } from "react";
import { SEO } from "@/components/common/SEO";
import { Button } from "@/components/ui/Button";

const inputClasses =
  "focus-ring w-full rounded-md border border-line bg-paper-raised px-3 py-2 text-sm dark:border-line-dark dark:bg-paper-raised-dark";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with the PDFTool team." path="/contact" />
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Get in touch</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Contact us</h1>
        <p className="mt-3 text-ink-soft dark:text-ink-soft-dark">
          Questions, feedback, or found a bug? We'd love to hear from you.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-md border border-blueprint-500/30 bg-blueprint-50 p-6 text-blueprint-700 dark:bg-blueprint-500/10 dark:text-blueprint-100">
            Thanks for reaching out. We'll get back to you soon.
          </div>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div>
              <label htmlFor="name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">Name</label>
              <input id="name" required type="text" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">Email</label>
              <input id="email" required type="email" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">Message</label>
              <textarea id="message" required rows={5} className={inputClasses} />
            </div>
            <Button type="submit" size="lg" className="w-full">Send message</Button>
          </form>
        )}
      </section>
    </>
  );
}
