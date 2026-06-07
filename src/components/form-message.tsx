export function FormMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-clay/30 bg-clay/5 px-4 py-3 text-sm text-clay">
      {message}
    </div>
  );
}
