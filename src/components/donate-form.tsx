"use client";

import { useActionState, useState } from "react";
import { donateAction, type ActionState } from "@/lib/actions";
import { compactCurrency } from "@/lib/format";
import { Field } from "./field";
import { SubmitButton } from "./submit-button";
import { FormMessage } from "./form-message";
import { Button, ButtonLink } from "./button";
import { PaymentDemoModal } from "./payment-demo-modal";

const PRESETS = [50000, 100000, 250000, 500000];

export function DonateForm({
  campaignId,
  signedIn,
  paymentsEnabled,
  supportEmail,
}: {
  campaignId: string;
  signedIn: boolean;
  paymentsEnabled: boolean;
  supportEmail: string;
}) {
  const [state, action] = useActionState<ActionState, FormData>(
    donateAction,
    {},
  );
  const [amount, setAmount] = useState("100000");
  const [demoOpen, setDemoOpen] = useState(false);

  // Real donations need a signed-in user. In demo mode nothing hits the API —
  // the button only opens the modal — so we let anyone through to see it.
  if (paymentsEnabled && !signedIn) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-soft">Sign in to back this campaign.</p>
        <ButtonLink href="/login" className="w-full">
          Sign in to donate
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      <form
        action={paymentsEnabled ? action : undefined}
        onSubmit={
          paymentsEnabled
            ? undefined
            : (e) => {
                e.preventDefault();
                setDemoOpen(true);
              }
        }
        className="space-y-4"
      >
        <input type="hidden" name="campaign_id" value={campaignId} />

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => {
            const active = amount === String(p);
            return (
              <button
                type="button"
                key={p}
                onClick={() => setAmount(String(p))}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line text-ink-soft hover:border-ink/30"
                }`}
              >
                {compactCurrency(p)}
              </button>
            );
          })}
        </div>

        <Field
          label="Amount (IDR)"
          name="amount"
          type="number"
          min={10000}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={state.fieldErrors?.amount}
        />

        <FormMessage message={state.error} />

        {paymentsEnabled ? (
          <SubmitButton pendingText="Redirecting…" className="w-full">
            Donate now
          </SubmitButton>
        ) : (
          <Button type="submit" className="w-full">
            Donate now
          </Button>
        )}
      </form>

      {!paymentsEnabled && (
        <PaymentDemoModal
          open={demoOpen}
          onClose={() => setDemoOpen(false)}
          supportEmail={supportEmail}
        />
      )}
    </>
  );
}
