import { Progress } from "./progress";

const backers = [
  { initial: "A", bg: "bg-clay/20 text-clay" },
  { initial: "S", bg: "bg-accent-soft text-accent" },
  { initial: "R", bg: "bg-ink/10 text-ink" },
  { initial: "M", bg: "bg-clay/20 text-clay" },
];

export function HeroShowcase() {
  return (
    <div className="relative hidden lg:block" aria-hidden="true">
      {/* depth: a second card peeking behind */}
      <div className="absolute -right-2 top-8 h-[88%] w-[92%] -rotate-6 rounded-[var(--radius)] border border-line bg-paper-2/70" />

      {/* main campaign card */}
      <div className="relative rotate-1 overflow-hidden rounded-[var(--radius)] border border-line bg-paper shadow-[0_30px_80px_-40px_rgba(27,23,19,0.45)]">
        <div className="relative h-44 bg-gradient-to-br from-accent to-accent-deep">
          <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-paper/10" />
          <div className="absolute right-8 top-10 h-16 w-16 rounded-full bg-paper/10" />
          <span className="absolute bottom-4 left-6 font-display text-2xl text-paper/95">
            Clean Water Project
          </span>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm text-ink-soft">
            Safe, running water for 200 families in Desa Sukamaju.
          </p>

          <Progress value={64} />

          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-ink">
              Rp 16jt{" "}
              <span className="font-normal text-ink-soft">of Rp 25jt</span>
            </span>
            <span className="font-display text-xl text-accent">64%</span>
          </div>

          <div className="flex items-center gap-3 border-t border-line pt-4">
            <div className="flex -space-x-2">
              {backers.map((b, i) => (
                <span
                  key={i}
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 border-paper text-xs font-semibold ${b.bg}`}
                >
                  {b.initial}
                </span>
              ))}
            </div>
            <span className="text-sm text-ink-soft">+128 backers</span>
          </div>
        </div>
      </div>

      {/* floating donation pulse */}
      <div className="float absolute -left-6 top-24 rounded-full border border-line bg-paper px-4 py-2.5 shadow-[0_16px_40px_-20px_rgba(27,23,19,0.4)]">
        <p className="text-xs text-ink-soft">New donation</p>
        <p className="font-display text-base text-accent">+ Rp 250.000</p>
      </div>

      {/* floating goal pill */}
      <div className="float-slow absolute -bottom-4 right-6 flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-[0_16px_40px_-20px_rgba(27,23,19,0.4)]">
        <span className="h-2 w-2 rounded-full bg-accent" />
        Goal in reach
      </div>
    </div>
  );
}
