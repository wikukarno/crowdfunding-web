import type { ComponentProps } from "react";

const controlClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-accent focus:ring-2 focus:ring-accent/20";

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-semibold text-ink"
    >
      {children}
    </label>
  );
}

function Error({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-clay">{message}</p>;
}

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
} & ComponentProps<"input">;

export function Field({ label, name, error, hint, ...props }: FieldProps) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <input id={name} name={name} className={controlClass} {...props} />
      {hint && !error && (
        <p className="mt-1.5 text-sm text-ink-soft">{hint}</p>
      )}
      <Error message={error} />
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  name: string;
  error?: string;
  hint?: string;
} & ComponentProps<"textarea">;

export function TextareaField({
  label,
  name,
  error,
  hint,
  rows = 5,
  ...props
}: TextareaFieldProps) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`${controlClass} resize-y`}
        {...props}
      />
      {hint && !error && (
        <p className="mt-1.5 text-sm text-ink-soft">{hint}</p>
      )}
      <Error message={error} />
    </div>
  );
}
