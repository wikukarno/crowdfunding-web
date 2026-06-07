import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight">
            Fundwell<span className="text-accent">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            A crowdfunding platform — a Next.js client for a Go &amp; PostgreSQL
            REST API.
          </p>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-ink">Explore</p>
          <ul className="space-y-2 text-ink-soft">
            <li>
              <Link href="/" className="transition hover:text-ink">
                Discover campaigns
              </Link>
            </li>
            <li>
              <Link href="/register" className="transition hover:text-ink">
                Start a campaign
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="mb-3 font-semibold text-ink">Source</p>
          <ul className="space-y-2 text-ink-soft">
            <li>
              <a
                href="https://github.com/wikukarno/crowdfunding-web"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-accent"
              >
                Frontend (Next.js)
              </a>
            </li>
            <li>
              <a
                href="https://github.com/wikukarno/crowdfunding"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-accent"
              >
                API (Go · PostgreSQL)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-sm text-ink-soft sm:flex-row">
          <p>© {year} Wiku Karno. All rights reserved.</p>
          <p>Built with Next.js &amp; Go.</p>
        </div>
      </div>
    </footer>
  );
}
