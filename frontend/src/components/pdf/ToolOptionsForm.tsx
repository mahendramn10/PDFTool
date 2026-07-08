/** Renders the dynamic option fields (text/number/select/range) declared on a ToolDefinition. */
import type { ToolField } from "@/types";

interface ToolOptionsFormProps {
  fields: ToolField[];
  values: Record<string, string | number>;
  onChange: (name: string, value: string | number) => void;
}

const inputClasses =
  "focus-ring w-full rounded-md border border-line bg-paper-raised px-3 py-2 text-sm dark:border-line-dark dark:bg-paper-raised-dark";

export function ToolOptionsForm({ fields, values, onChange }: ToolOptionsFormProps) {
  if (fields.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 rounded-md border border-line p-4 dark:border-line-dark sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={field.type === "range" ? "sm:col-span-2" : ""}>
          <label htmlFor={field.name} className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-ink-soft-dark">
            {field.label}
          </label>

          {field.type === "select" && (
            <select
              id={field.name}
              value={values[field.name] ?? field.defaultValue ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className={inputClasses}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {field.type === "text" && (
            <input
              id={field.name}
              type="text"
              placeholder={field.placeholder}
              value={values[field.name] ?? field.defaultValue ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className={inputClasses}
            />
          )}

          {field.type === "number" && (
            <input
              id={field.name}
              type="number"
              min={field.min}
              max={field.max}
              value={values[field.name] ?? field.defaultValue ?? ""}
              onChange={(e) => onChange(field.name, Number(e.target.value))}
              className={inputClasses}
            />
          )}

          {field.type === "range" && (
            <div className="flex items-center gap-3">
              <input
                id={field.name}
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={values[field.name] ?? field.defaultValue ?? 0}
                onChange={(e) => onChange(field.name, Number(e.target.value))}
                className="w-full accent-blueprint-500"
              />
              <span className="w-10 text-right font-mono text-xs text-ink-soft dark:text-ink-soft-dark">
                {values[field.name] ?? field.defaultValue}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
