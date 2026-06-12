import { notFound } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import type { AppConfig, CampaignDetail } from "@/lib/schemas";
import { formatCurrency, progressPercent } from "@/lib/format";
import { isAuthenticated } from "@/lib/session";
import { Progress } from "@/components/progress";
import { DonateForm } from "@/components/donate-form";

export const dynamic = "force-dynamic";

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let campaign: CampaignDetail;
  try {
    campaign = await api.getCampaign(id);
  } catch (e) {
    if (e instanceof ApiError) notFound();
    throw e;
  }

  // If the config call fails for any reason, fall back to demo mode so we never
  // send a backer into a payment flow that the backend has switched off.
  const demoConfig: AppConfig = {
    payments_enabled: false,
    support_email: "hi@wikukarno.dev",
  };
  const [signedIn, config] = await Promise.all([
    isAuthenticated(),
    api.getConfig().catch(() => demoConfig),
  ]);

  const pct = progressPercent(campaign.current_amount, campaign.goal_amount);
  const perks = (campaign.perks ?? []).filter(Boolean);

  return (
    <article className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        ← Back to campaigns
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* Main */}
        <div>
          <div className="overflow-hidden rounded-[var(--radius)] border border-line">
            <div className="aspect-[16/9]">
              {campaign.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={campaign.image_url}
                  alt={campaign.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent-soft">
                  <span className="font-display text-8xl text-accent/80">
                    {campaign.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <h1 className="mt-8 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            {campaign.name}
          </h1>
          <p className="mt-3 text-lg text-ink-soft">
            {campaign.short_description}
          </p>

          <div className="mt-6 flex items-center gap-3 border-y border-line py-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-paper">
              {campaign.user.name.charAt(0).toUpperCase()}
            </span>
            <div className="text-sm">
              <p className="text-ink-soft">Organised by</p>
              <p className="font-semibold text-ink">{campaign.user.name}</p>
            </div>
          </div>

          <div className="prose-campaign mt-8 whitespace-pre-line leading-relaxed text-ink/90">
            {campaign.description}
          </div>

          {perks.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Perks</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {perks.map((perk, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 text-sm"
                  >
                    <span className="text-accent">✦</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Donate panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius)] border border-line bg-paper p-6 shadow-[0_20px_60px_-30px_rgba(27,23,19,0.4)]">
            <p className="font-display text-3xl text-ink">
              {formatCurrency(campaign.current_amount)}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              raised of {formatCurrency(campaign.goal_amount)} goal
            </p>

            <div className="my-5">
              <Progress value={pct} />
              <div className="mt-2 flex justify-between text-sm">
                <span className="font-display text-lg text-accent">{pct}%</span>
                <span className="text-ink-soft">
                  {campaign.backer_count} backers
                </span>
              </div>
            </div>

            <DonateForm
              campaignId={campaign.id}
              signedIn={signedIn}
              paymentsEnabled={config.payments_enabled}
              supportEmail={config.support_email}
            />
          </div>
        </aside>
      </div>
    </article>
  );
}
