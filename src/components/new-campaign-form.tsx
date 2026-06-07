"use client";

import { useActionState } from "react";
import {
  createCampaignAction,
  type ActionState,
} from "@/lib/actions";
import { Field, TextareaField } from "./field";
import { SubmitButton } from "./submit-button";
import { FormMessage } from "./form-message";

export function NewCampaignForm() {
  const [state, action] = useActionState<ActionState, FormData>(
    createCampaignAction,
    {},
  );

  return (
    <form action={action} className="mt-8 space-y-5">
      <Field
        label="Campaign title"
        name="name"
        placeholder="Clean water for Desa Sukamaju"
        error={state.fieldErrors?.name}
      />
      <Field
        label="Short summary"
        name="short_description"
        placeholder="One sentence that sums up your campaign"
        error={state.fieldErrors?.short_description}
      />
      <TextareaField
        label="Description"
        name="description"
        rows={7}
        placeholder="Tell backers what you're raising for, why it matters, and how the funds will be used."
        error={state.fieldErrors?.description}
      />
      <Field
        label="Funding goal (IDR)"
        name="goal_amount"
        type="number"
        min={10000}
        step={1000}
        placeholder="10000000"
        error={state.fieldErrors?.goal_amount}
      />
      <Field
        label="Perks"
        name="perks"
        placeholder="Sticker pack, Thank-you note, Early access"
        hint="Separate perks with commas."
        error={state.fieldErrors?.perks}
      />
      <FormMessage message={state.error} />
      <SubmitButton pendingText="Publishing…">Publish campaign</SubmitButton>
    </form>
  );
}
