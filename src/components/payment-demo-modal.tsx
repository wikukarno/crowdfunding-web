"use client";

import { useEffect, useRef } from "react";
import { Button, buttonClasses } from "./button";

/**
 * Shown when live payments are switched off (demo mode). It nudges the visitor
 * to email support so they can request a live walkthrough of the checkout.
 *
 * Implements the dialog focus contract: focus moves into the modal on open,
 * Tab is trapped inside it, Escape closes, and focus returns to the trigger on
 * close (so keyboard/AT users can't drift into the form behind the overlay).
 */
export function PaymentDemoModal({
  open,
  onClose,
  supportEmail,
}: {
  open: boolean;
  onClose: () => void;
  supportEmail: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Keep onClose in a ref so the focus effect depends only on `open` and never
  // re-runs (re-stealing focus) when the parent re-renders with a new handler.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const restoreFocusTo = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        cardRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      restoreFocusTo?.focus();
    };
  }, [open]);

  if (!open) return null;

  const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
    "Enable a live payment demo",
  )}&body=${encodeURIComponent(
    "Hi Wiku,\n\nI'd like to see the live Midtrans payment flow on your crowdfunding demo. " +
      "Could you switch it on for a quick walkthrough?\n\nThanks!",
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      <div
        ref={cardRef}
        className="relative w-full max-w-md rounded-[var(--radius)] border border-line bg-paper p-7 shadow-[0_30px_80px_-30px_rgba(27,23,19,0.5)]"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
          <span aria-hidden>●</span> Demo mode
        </span>

        <h2
          id="demo-modal-title"
          className="mt-4 font-display text-2xl leading-tight text-ink"
        >
          Live payments are switched off
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          This crowdfunding app is a portfolio project, so the real Midtrans
          checkout is disabled by default. Want to see the full payment flow in
          action? Reach out and I&apos;ll enable a live demo for you.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <a
            href={mailto}
            className={buttonClasses(
              "primary",
              "w-full min-w-0 break-words sm:flex-1",
            )}
          >
            Email {supportEmail}
          </a>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto sm:flex-none sm:px-8"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
}
