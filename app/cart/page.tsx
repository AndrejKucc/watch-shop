"use client";

import Link from "next/link";
import { useCart } from "@/components/cart";

export default function CartPage() {
  const {
    items,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <main className="min-h-screen bg-[#211812] px-5 py-10 text-[#f4ebdd] sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-[#d6b878]/20 pb-8">
          <Link
            href="/"
            className="inline-flex rounded-xl border border-[#d6b878]/25 bg-gradient-to-b from-[#d6b878]/10 to-[#4b3621]/20 px-4 py-2.5 text-sm text-[#b8a99a] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:border-[#d6b878]/50 hover:from-[#d6b878]/20 hover:text-[#f4ebdd] active:scale-95"
          >
            ← Nastavi kupovinu
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6b878]">
              Tvoja kupovina
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Korpa
            </h1>

            <p className="mt-3 text-base text-[#b8a99a]">
              Pregledaj izabrane satove pre nego što pošalješ porudžbinu.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b] to-[#211812] p-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d6b878]/25 bg-[#4b3621]/40 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Korpa je prazna
            </h2>

            <p className="mt-2 text-[#b8a99a]">
              Dodaj neki sat iz naše kolekcije.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] to-[#d6b878] px-6 py-3.5 font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(0,0,0,0.2)] transition hover:brightness-110 active:scale-95"
            >
              Pogledaj kolekciju
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[2rem] border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b] to-[#241a14] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#d6b878]/35 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-[#d6b878]/10 bg-gradient-to-br from-[#4b3621]/50 to-[#211812] sm:h-32 sm:w-32">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#b8a99a]">
                          Slika sata
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold sm:text-xl">
                            {item.name}
                          </h2>

                          <p className="mt-1 text-sm text-[#b8a99a]">
                            {item.price.toFixed(2)} RSD po komadu
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex-shrink-0 rounded-xl px-2 py-1 text-sm text-[#b8a99a] transition hover:bg-[#c46a2d]/10 hover:text-[#c46a2d]"
                        >
                          Ukloni
                        </button>
                      </div>

                      <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8f8071]">
                            Količina
                          </p>

                          <div className="mt-2 flex items-center rounded-xl border border-[#d6b878]/20 bg-[#211812] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              aria-label={`Smanji količinu za ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[#d6b878] transition hover:bg-gradient-to-b hover:from-[#ead4a0] hover:to-[#d6b878] hover:text-[#211812] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#d6b878]"
                            >
                              −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#d6b878]/15 px-3 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              disabled={item.quantity >= item.stock}
                              aria-label={`Povećaj količinu za ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[#d6b878] transition hover:bg-gradient-to-b hover:from-[#ead4a0] hover:to-[#d6b878] hover:text-[#211812] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#d6b878]"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8f8071]">
                            Ukupno
                          </p>

                          <p className="mt-1 text-xl font-bold tracking-tight text-[#ead4a0] sm:text-2xl">
                            {(item.price * item.quantity).toFixed(2)} RSD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-[2rem] border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] to-[#211812] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:sticky lg:top-24">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#d6b878]">
                Pregled porudžbine
              </p>

              <div className="mt-6 space-y-4 border-b border-[#d6b878]/20 pb-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#b8a99a]">
                    Proizvodi
                  </span>

                  <span className="font-medium">
                    {items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    kom.
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#b8a99a]">
                    Dostava
                  </span>

                  <span className="font-medium">
                    Pouzećem
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#b8a99a]">
                  Ukupno
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight text-[#ead4a0]">
                  {totalPrice.toFixed(2)} RSD
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center rounded-2xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-6 py-4 font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_5px_16px_rgba(0,0,0,0.25)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Nastavi na porudžbinu →
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-[#8f8071]">
                Plaćanje pouzećem
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}