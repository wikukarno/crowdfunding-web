import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { UserTransaction } from "@/lib/schemas";
import { getToken } from "@/lib/session";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { ButtonLink } from "@/components/button";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const token = await getToken();
  if (!token) redirect("/login");

  let transactions: UserTransaction[] = [];
  let error: string | null = null;
  try {
    transactions = await api.listMyTransactions(token);
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Something went wrong.";
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
        My donations
      </h1>
      <p className="mt-3 text-ink-soft">
        Every campaign you&apos;ve backed, and where each payment stands.
      </p>

      {error && (
        <div className="mt-10 rounded-[var(--radius)] border border-line bg-paper p-10 text-center">
          <p className="font-display text-2xl text-ink">
            Couldn&apos;t load your donations
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{error}</p>
        </div>
      )}

      {!error && transactions.length === 0 && (
        <div className="mt-10 rounded-[var(--radius)] border border-dashed border-line p-12 text-center">
          <p className="font-display text-2xl text-ink">No donations yet</p>
          <p className="mt-2 text-sm text-ink-soft">
            Find a campaign worth backing.
          </p>
          <ButtonLink href="/" className="mt-6">
            Discover campaigns
          </ButtonLink>
        </div>
      )}

      {!error && transactions.length > 0 && (
        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-[var(--radius)] border border-line bg-paper">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-lg text-ink">
                  {t.campaign.name}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {formatDate(t.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <StatusBadge status={t.status} />
                <span className="font-semibold text-ink">
                  {formatCurrency(t.amount)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
