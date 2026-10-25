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
          ? "border-[#ead4a0] bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(214,184,120,0.15)]"
          : "border-[#d6b878]/25 bg-gradient-to-b from-[#30231b] to-[#211812] text-[#c2b5a8] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[#d6b878]/60 hover:text-[#ead4a0] hover:shadow-[0_0_14px_rgba(214,184,120,0.08)]"
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