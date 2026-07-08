import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
  { label: "All tools", to: "/#tools" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md dark:border-line-dark dark:bg-paper-dark/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border-[1.5px] border-ink font-display text-[13px] font-semibold leading-none dark:border-ink-dark">
            P
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">PDFTool</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="font-mono text-[13px] uppercase tracking-wide text-ink-soft transition-colors hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="focus-ring rounded-md p-2 text-ink-soft hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="focus-ring rounded-md p-2 text-ink-soft hover:text-ink dark:text-ink-soft-dark dark:hover:text-ink-dark md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line px-4 py-3 dark:border-line-dark md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2 font-mono text-[13px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
