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
      className={`mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition duration-200 active:scale-[0.98] ${
        selected
          ? "border-[#B8955A]/100 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(184,149,90,0.15)]"
          : "border-[#B8955A]/40 bg-gradient-to-b from-[#FFFFFF] to-[#F8F4E7] text-[#1F2A3C]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[#B8955A]/90 hover:text-[#8A6A33] hover:shadow-[0_0_14px_rgba(184,149,90,0.08)]"
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