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
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-white/10 pb-8">
          <Link
            href="/"
            className="inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-sm text-neutral-400 transition hover:bg-white hover:text-black active:scale-95"
          >
            ← Nastavi kupovinu
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              Tvoja kupovina
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Korpa
            </h1>

            <p className="mt-3 text-base text-neutral-500">
              Pregledaj izabrane satove pre nego što pošalješ porudžbinu.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-neutral-900 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-neutral-800 text-2xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Korpa je prazna
            </h2>

            <p className="mt-2 text-neutral-500">
              Dodaj neki sat iz naše kolekcije.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-neutral-200 active:scale-95"
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
                  className="rounded-[2rem] border border-white/10 bg-neutral-900 p-4 transition hover:border-white/15 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-800 sm:h-32 sm:w-32">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-neutral-500">
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

                          <p className="mt-1 text-sm text-neutral-500">
                            {item.price.toFixed(2)} RSD po komadu
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex-shrink-0 rounded-xl px-2 py-1 text-sm text-neutral-500 transition hover:bg-white/5 hover:text-red-400"
                        >
                          Ukloni
                        </button>
                      </div>

                      <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                            Količina
                          </p>

                          <div className="mt-2 flex items-center rounded-xl border border-white/10 bg-neutral-950 p-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              aria-label={`Smanji količinu za ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-neutral-300 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-neutral-300"
                            >
                              −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-white/10 px-3 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              disabled={item.quantity >= item.stock}
                              aria-label={`Povećaj količinu za ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-neutral-300 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-neutral-300"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-600">
                            Ukupno
                          </p>

                          <p className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                            {(item.price * item.quantity).toFixed(2)} RSD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-neutral-900 p-6 lg:sticky lg:top-24">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                Pregled porudžbine
              </p>

              <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-neutral-500">
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
                  <span className="text-neutral-500">
                    Dostava
                  </span>

                  <span className="font-medium">
                    Pouzećem
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Ukupno
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight">
                  {totalPrice.toFixed(2)} RSD
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-neutral-200 active:scale-[0.98]"
              >
                Nastavi na porudžbinu →
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-neutral-600">
                Plaćanje pouzećem
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}