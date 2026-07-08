/** A rotated, ink-stamp-style badge for short trust callouts ("Free", "No sign-up"). */
interface StampBadgeProps {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}

export function StampBadge({ children, rotate = -3, className = "" }: StampBadgeProps) {
  return (
    <span
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`inline-flex items-center rounded-sm border-[1.5px] border-stamp-500 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-stamp-500 ${className}`}
    >
      {children}
    </span>
  );
}
