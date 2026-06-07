"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: string;
  className?: string;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`px-3 py-2 text-sm font-medium transition ${
        active
          ? "text-ink underline decoration-accent decoration-2 underline-offset-[7px]"
          : "text-ink-soft hover:text-ink"
      } ${className}`}
    >
      {children}
    </Link>
  );
}
