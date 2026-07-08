import { Link } from "react-router-dom";
import { TOOLS } from "@/constants/tools";

export function Footer() {
  const year = new Date().getFullYear();
  const featured = TOOLS.slice(0, 6);

  return (
    <footer className="border-t border-line bg-paper dark:border-line-dark dark:bg-paper-dark">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-sm border-[1.5px] border-ink font-display text-[13px] font-semibold leading-none dark:border-ink-dark">
                P
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">PDFTool</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-soft dark:text-ink-soft-dark">
              Every page, exactly as you need it. No sign-up, no watermark.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Popular tools</h3>
            <ul className="mt-4 space-y-2.5">
              {featured.map((tool) => (
                <li key={tool.slug}>
                  <Link to={`/${tool.slug}`} className="text-sm text-ink-soft hover:text-blueprint-500 dark:text-ink-soft-dark">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Company</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/about" className="text-sm text-ink-soft hover:text-blueprint-500 dark:text-ink-soft-dark">About</Link></li>
              <li><Link to="/blog" className="text-sm text-ink-soft hover:text-blueprint-500 dark:text-ink-soft-dark">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-ink-soft hover:text-blueprint-500 dark:text-ink-soft-dark">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink-soft dark:text-ink-soft-dark">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/privacy" className="text-sm text-ink-soft hover:text-blueprint-500 dark:text-ink-soft-dark">Privacy policy</Link></li>
              <li><Link to="/terms" className="text-sm text-ink-soft hover:text-blueprint-500 dark:text-ink-soft-dark">Terms of service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-ink-soft-dark sm:flex-row">
          <span>&copy; {year} PDFTool</span>
          <span>Files auto-deleted after processing</span>
        </div>
      </div>
    </footer>
  );
}
