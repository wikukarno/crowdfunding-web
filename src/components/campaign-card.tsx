import Link from "next/link";
import type { Campaign } from "@/lib/schemas";
import { compactCurrency, progressPercent } from "@/lib/format";
import { Progress } from "./progress";

function Thumb({ campaign }: { campaign: Campaign }) {
  if (campaign.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={campaign.image_url}
        alt={campaign.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-accent-soft">
      <span className="font-display text-6xl text-accent/80">
        {campaign.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const pct = progressPercent(campaign.current_amount, campaign.goal_amount);

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-paper transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(27,23,19,0.35)]"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <Thumb campaign={campaign} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <h3 className="font-display text-2xl leading-tight text-ink">
            {campaign.name}
          </h3>
          <p className="line-clamp-2 text-sm text-ink-soft">
            {campaign.short_description}
          </p>
        </div>

        <div className="mt-auto space-y-3 pt-2">
          <Progress value={pct} />
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold text-ink">
              {compactCurrency(campaign.current_amount)}
              <span className="font-normal text-ink-soft">
                {" "}
                of {compactCurrency(campaign.goal_amount)}
              </span>
            </span>
            <span className="font-display text-lg text-accent">{pct}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
