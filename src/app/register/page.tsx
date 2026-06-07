"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionState } from "@/lib/actions";
import { Field } from "@/components/field";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";

export default function RegisterPage() {
  const [state, action] = useActionState<ActionState, FormData>(
    registerAction,
    {},
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="font-display text-4xl tracking-tight">
        Create your account
      </h1>
      <p className="mt-2 text-ink-soft">
        Start a campaign or support the ones you love.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Wiku Karno"
          error={state.fieldErrors?.name}
        />
        <Field
          label="Occupation"
          name="occupation"
          autoComplete="organization-title"
          placeholder="Software Engineer"
          error={state.fieldErrors?.occupation}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={state.fieldErrors?.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          error={state.fieldErrors?.password}
        />
        <FormMessage message={state.error} />
        <SubmitButton pendingText="Creating account…" className="w-full">
          Create account
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent">
          Sign in
        </Link>
      </p>
    </div>
  );
}
