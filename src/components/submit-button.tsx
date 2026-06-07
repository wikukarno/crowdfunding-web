"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";

export function SubmitButton({
  children,
  pendingText,
  className = "",
  variant = "primary",
}: {
  children: string;
  pendingText?: string;
  className?: string;
  variant?: "primary" | "dark" | "ghost";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      className={className}
    >
      {pending ? (pendingText ?? "Working…") : children}
    </Button>
  );
}
