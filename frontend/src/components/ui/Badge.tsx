export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm bg-blueprint-50 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-blueprint-700 dark:bg-blueprint-500/10 dark:text-blueprint-100 ${className}`}
    >
      {children}
    </span>
  );
}
