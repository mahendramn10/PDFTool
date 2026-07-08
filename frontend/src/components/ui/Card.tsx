import type { HTMLAttributes } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-line bg-paper-raised dark:border-line-dark dark:bg-paper-raised-dark ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
