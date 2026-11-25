type CollectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  count: number;
};

export default function CollectionHeader({
  eyebrow,
  title,
  description,
  count,
}: CollectionHeaderProps) {
  return (
    <div className="ws-collection-stage relative isolate overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
      <style>{`
        .ws-collection-stage {
          background:
            radial-gradient(ellipse 55% 70% at 88% 10%, rgba(184, 149, 90, 0.32), transparent 70%),
            radial-gradient(ellipse 45% 50% at 4% 100%, rgba(184, 149, 90, 0.14), transparent 70%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.28)),
            #1F2A3C;
          border: 1px solid rgba(184, 149, 90, 0.28);
          box-shadow:
            0 30px 80px rgba(31, 42, 60, 0.28),
            inset 0 1px 0 rgba(248, 244, 231, 0.08);
        }

        .ws-collection-ticks {
          height: 10px;
          background: repeating-linear-gradient(
            90deg,
            rgba(248, 244, 231, 0.30) 0 1px,
            transparent 1px 8px
          );
          -webkit-mask-image: linear-gradient(90deg, #000, transparent);
          mask-image: linear-gradient(90deg, #000, transparent);
        }
      `}</style>

      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-10 -top-12 hidden h-72 w-72 text-[#B8955A]/25 sm:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="78" strokeDasharray="1.2 5" />
        <circle cx="100" cy="100" r="58" />
        <path d="M100 4v14M100 182v14M4 100h14M182 100h14" />
      </svg>

      <div className="relative max-w-3xl">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-[#B8955A]">
          <span aria-hidden="true" className="h-px w-8 bg-[#B8955A]" />
          {eyebrow}
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-[#F8F4E7] sm:text-6xl">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-[#F8F4E7]/70">
          {description}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <span className="rounded-full border border-[#B8955A]/40 bg-[#F8F4E7]/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#F8F4E7]/80">
            {count} {count === 1 ? "proizvod" : "proizvoda"}
          </span>

          <span aria-hidden="true" className="ws-collection-ticks block w-32 sm:w-48" />
        </div>
      </div>
    </div>
  );
}
