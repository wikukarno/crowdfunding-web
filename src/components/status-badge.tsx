const styles: Record<string, string> = {
  paid: "bg-accent-soft text-accent",
  pending: "bg-clay/10 text-clay",
  cancelled: "bg-ink/5 text-ink-soft",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const className = styles[key] ?? styles.cancelled;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {status}
    </span>
  );
}
