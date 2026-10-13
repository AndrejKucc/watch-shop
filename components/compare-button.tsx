"use client";

import { useCompare } from "@/lib/use-compare";

export function CompareButton({
  productId,
}: {
  productId: string;
}) {
  const {
    compareIds,
    toggleCompare,
    isCompared,
    maxCompare,
  } = useCompare();

  const selected = isCompared(productId);
  const limitReached = compareIds.length >= maxCompare;

  return (
    <button
      type="button"
      onClick={() => toggleCompare(productId)}
      aria-pressed={selected}
      className={`mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.98] ${
        selected
          ? "border-white bg-white text-black"
          : "border-white/10 bg-neutral-950 text-neutral-300 hover:border-white/30 hover:text-white"
      }`}
    >
      <span aria-hidden="true">
        {selected ? "✓" : "⚖"}
      </span>

      {selected
        ? "Izabran za poređenje"
        : limitReached
          ? "Ukloni jedan sat za novi izbor"
          : "Uporedi sat"}
    </button>
  );
}