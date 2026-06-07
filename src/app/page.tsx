import { api, ApiError } from "@/lib/api";
import type { Campaign } from "@/lib/schemas";
import { compactCurrency } from "@/lib/format";
import { CampaignCard } from "@/components/campaign-card";
import { ButtonLink } from "@/components/button";
import { HeroShowcase } from "@/components/hero-showcase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let campaigns: Campaign[] = [];
  let error: string | null = null;

  try {
    campaigns = await api.listCampaigns();
  } catch (e) {
    error = e instanceof ApiError ? e.message : "Something went wrong.";
  }

  const totalRaised = campaigns.reduce((s, c) => s + c.current_amount, 0);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="rise mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Crowdfunding, done right
            </p>
            <h1 className="rise font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
              Fund what matters,{" "}
              <span className="italic text-accent">together.</span>
            </h1>
            <p
              className="rise mt-6 max-w-xl text-lg text-ink-soft"
              style={{ animationDelay: "0.08s" }}
            >
              Back the ideas you believe in, or raise support for your own. Every
              contribution moves a campaign closer to its goal — transparently.
            </p>
            <div
              className="rise mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.16s" }}
            >
              <ButtonLink href="/register">Start a campaign</ButtonLink>
              <ButtonLink href="#campaigns" variant="ghost">
                Discover campaigns
              </ButtonLink>
            </div>
          </div>

          <div className="rise" style={{ animationDelay: "0.2s" }}>
            <HeroShowcase />
          </div>
        </div>

        {!error && campaigns.length > 0 && (
          <div
            className="rise mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8"
            style={{ animationDelay: "0.28s" }}
          >
            <Stat label="Open campaigns" value={String(campaigns.length)} />
            <Stat label="Total raised" value={compactCurrency(totalRaised)} />
            <Stat label="Avg. progress" value={`${avgProgress(campaigns)}%`} />
          </div>
        )}
      </section>

      <section id="campaigns" className="mx-auto max-w-6xl px-5 py-8">
        <h2 className="mb-8 font-display text-3xl tracking-tight sm:text-4xl">
          Open campaigns
        </h2>

        {error && (
          <div className="rounded-[var(--radius)] border border-line bg-paper p-10 text-center">
            <p className="font-display text-2xl text-ink">
              Couldn&apos;t load campaigns
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{error}</p>
          </div>
        )}

        {!error && campaigns.length === 0 && (
          <div className="rounded-[var(--radius)] border border-dashed border-line p-12 text-center">
            <p className="font-display text-2xl text-ink">No campaigns yet</p>
            <p className="mt-2 text-sm text-ink-soft">
              Be the first to start one.
            </p>
            <ButtonLink href="/register" className="mt-6">
              Start a campaign
            </ButtonLink>
          </div>
        )}

        {!error && campaigns.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-ink-soft">
        {label}
      </p>
    </div>
  );
}

function avgProgress(campaigns: Campaign[]): number {
  if (!campaigns.length) return 0;
  const sum = campaigns.reduce(
    (s, c) =>
      s + (c.goal_amount > 0 ? (c.current_amount / c.goal_amount) * 100 : 0),
    0,
  );
  return Math.round(sum / campaigns.length);
}
