import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import { NewCampaignForm } from "@/components/new-campaign-form";

export default async function NewCampaignPage() {
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
        Start a campaign
      </h1>
      <p className="mt-3 text-ink-soft">
        Share your idea and let the community rally behind it.
      </p>
      <NewCampaignForm />
    </div>
  );
}
