"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/lib/actions";
import { Field } from "@/components/field";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";

export default function LoginPage() {
  const [state, action] = useActionState<ActionState, FormData>(
    loginAction,
    {},
  );

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
      <h1 className="font-display text-4xl tracking-tight">Welcome back</h1>
      <p className="mt-2 text-ink-soft">Sign in to back and manage campaigns.</p>

      <form action={action} className="mt-8 space-y-4">
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
          autoComplete="current-password"
          placeholder="••••••••"
          error={state.fieldErrors?.password}
        />
        <FormMessage message={state.error} />
        <SubmitButton pendingText="Signing in…" className="w-full">
          Sign in
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        New here?{" "}
        <Link href="/register" className="font-semibold text-accent">
          Create an account
        </Link>
      </p>
    </div>
  );
}
