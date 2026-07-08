export function Loader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14">
      <svg className="h-7 w-7 animate-spin text-blueprint-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      {label && <p className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">{label}</p>}
    </div>
  );
}
