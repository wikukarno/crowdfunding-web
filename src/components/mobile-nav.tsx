"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/lib/actions";

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-4 py-3 text-base font-medium text-ink transition hover:bg-paper-2"
    >
      {children}
    </Link>
  );
}

export function MobileNav({
  signedIn,
  name,
}: {
  signedIn: boolean;
  name: string | null;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink"
      >
        <span className="relative block h-3 w-4">
          <span
            className={`absolute left-0 block h-0.5 w-4 bg-ink transition-all ${
              open ? "top-1.5 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 block h-0.5 w-4 bg-ink transition-all ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-4 bg-ink transition-all ${
              open ? "top-1.5 -rotate-45" : "top-3"
            }`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-line bg-paper shadow-[0_20px_40px_-24px_rgba(27,23,19,0.4)]">
          <div className="mx-auto max-w-6xl space-y-1 px-3 py-4">
            {signedIn && name && (
              <div className="mb-2 flex items-center gap-3 px-4 py-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft font-semibold text-accent">
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-ink">{name}</span>
              </div>
            )}

            <MobileLink href="/" onClick={close}>
              Discover
            </MobileLink>

            {signedIn ? (
              <>
                <MobileLink href="/transactions" onClick={close}>
                  My donations
                </MobileLink>
                <MobileLink href="/campaigns/new" onClick={close}>
                  Start a campaign
                </MobileLink>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-clay transition hover:bg-paper-2"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <MobileLink href="/login" onClick={close}>
                  Sign in
                </MobileLink>
                <MobileLink href="/register" onClick={close}>
                  Start a campaign
                </MobileLink>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
