import Link from "next/link";
import { getToken, getUserName } from "@/lib/session";
import { logoutAction } from "@/lib/actions";
import { api } from "@/lib/api";
import { ButtonLink } from "./button";
import { NavLink } from "./nav-link";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const token = await getToken();
  const signedIn = token !== null;

  let name = signedIn ? await getUserName() : null;
  // Older sessions may not carry the name cookie — fall back to the API.
  if (signedIn && !name) {
    try {
      name = (await api.fetchUser(token!)).name;
    } catch {
      name = null;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-lg leading-none text-paper">
            f
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Fundwell
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
          <NavLink href="/" className="hidden sm:inline-block">
            Discover
          </NavLink>

          {signedIn ? (
            <>
              <NavLink href="/transactions" className="hidden sm:inline-block">
                My donations
              </NavLink>
              <ButtonLink
                href="/campaigns/new"
                variant="ghost"
                className="px-4 py-2"
              >
                Start a campaign
              </ButtonLink>

              <div className="ml-1 flex items-center gap-2.5 border-l border-line pl-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft font-semibold text-accent">
                  {(name ?? "?").charAt(0).toUpperCase()}
                </span>
                <span className="hidden text-sm font-semibold text-ink sm:block">
                  {name}
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="px-2 py-2 text-sm font-medium text-ink-soft transition hover:text-clay"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <NavLink href="/login">Sign in</NavLink>
              <ButtonLink href="/register" className="px-4 py-2">
                Start a campaign
              </ButtonLink>
            </>
          )}
        </nav>

        <MobileNav signedIn={signedIn} name={name} />
      </div>
    </header>
  );
}
