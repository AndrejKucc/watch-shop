"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart";
import { galleryThumbUrl } from "@/lib/image";

export default function CartPage() {
  const {
    items,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    appliedCoupon,
    couponDiscount,
    finalTotal,
    couponLoading,
    couponMessage,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");

  async function handleApplyCoupon() {
    const success = await applyCoupon(couponInput);

    if (success) {
      setCouponInput("");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F4E7] px-5 py-10 text-[#1F2A3C] sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-[#B8955A]/30 pb-8">
          <Link
            href="/"
            className="inline-flex rounded-xl border border-[#B8955A]/40 bg-gradient-to-b from-[#B8955A]/10 to-[#B8955A]/5 px-4 py-2.5 text-sm text-[#1F2A3C]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:border-[#B8955A]/75 hover:from-[#B8955A]/20 hover:text-[#1F2A3C] active:scale-95"
          >
            ← Nastavi kupovinu
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8A6A33]">
              Tvoja kupovina
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Korpa
            </h1>

            <p className="mt-3 text-base text-[#1F2A3C]/72">
              Pregledaj izabrane satove pre nego što pošalješ porudžbinu.
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF] to-[#F8F4E7] p-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#B8955A]/40 bg-[#B8955A]/10 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Korpa je prazna
            </h2>

            <p className="mt-2 text-[#1F2A3C]/72">
              Dodaj neki sat iz naše kolekcije.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] to-[#1F2A3C] px-6 py-3.5 font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(31,42,60,0.12)] transition hover:brightness-110 active:scale-95"
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
                  className="rounded-[2rem] border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF] to-[#F8F4E7] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#B8955A]/50 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-[#B8955A]/15 bg-gradient-to-br from-[#B8955A]/15 to-[#F8F4E7] sm:h-32 sm:w-32">
                      {item.image ? (
                        <img
                          src={galleryThumbUrl(item.image)}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          onError={(event) => {
                            const original = item.image as string;

                            if (event.currentTarget.src !== original) {
                              event.currentTarget.src = original;
                            }
                          }}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#1F2A3C]/72">
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

                          <p className="mt-1 text-sm text-[#1F2A3C]/72">
                            {item.price.toFixed(2)} RSD po komadu
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex-shrink-0 rounded-xl px-2 py-1 text-sm text-[#1F2A3C]/72 transition hover:bg-[#c46a2d]/10 hover:text-[#c46a2d]"
                        >
                          Ukloni
                        </button>
                      </div>

                      <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#1F2A3C]/60">
                            Količina
                          </p>

                          <div className="mt-2 flex items-center rounded-xl border border-[#B8955A]/30 bg-[#F8F4E7] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity <= 1}
                              aria-label={`Smanji količinu za ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[#8A6A33] transition hover:bg-gradient-to-b hover:from-[#B8955A] hover:to-[#B8955A] hover:text-[#1F2A3C] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#8A6A33]"
                            >
                              −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#B8955A]/20 px-3 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.id)}
                              disabled={item.quantity >= item.stock}
                              aria-label={`Povećaj količinu za ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[#8A6A33] transition hover:bg-gradient-to-b hover:from-[#B8955A] hover:to-[#B8955A] hover:text-[#1F2A3C] disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#8A6A33]"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#1F2A3C]/60">
                            Ukupno
                          </p>

                          <p className="mt-1 text-xl font-bold tracking-tight text-[#8A6A33] sm:text-2xl">
                            {(item.price * item.quantity).toFixed(2)} RSD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-[2rem] border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] to-[#F8F4E7] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:sticky lg:top-24">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#8A6A33]">
                Pregled porudžbine
              </p>

              <div className="mt-6 space-y-4 border-b border-[#B8955A]/30 pb-6">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#1F2A3C]/72">
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
                  <span className="text-[#1F2A3C]/72">
                    Dostava
                  </span>

                  <span className="font-medium">
                    Pouzećem
                  </span>
                </div>
              </div>

              {/* KU PON */}
              <div className="mt-6 rounded-2xl border border-[#B8955A]/30 bg-[#FFFFFF]/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6A33]">
                  Imaš kupon kod?
                </p>

                {!appliedCoupon ? (
                  <>
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(event) =>
                          setCouponInput(event.target.value.toUpperCase())
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            void handleApplyCoupon();
                          }
                        }}
                        placeholder="Unesi kod"
                        maxLength={30}
                        className="min-w-0 flex-1 rounded-xl border border-[#B8955A]/40 bg-[#1F2A3C] px-3 py-3 text-sm font-mono text-[#F8F4E7] outline-none placeholder:text-[#1F2A3C]/50 focus:border-[#B8955A]/100"
                      />

                      <button
                        type="button"
                        onClick={() => void handleApplyCoupon()}
                        disabled={couponLoading || !couponInput.trim()}
                        className="rounded-xl border border-[#B8955A]/60 bg-gradient-to-b from-[#1F2A3C] to-[#1F2A3C] px-4 py-3 text-sm font-semibold text-[#F8F4E7] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "Primeni"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm font-bold tracking-wider text-[#8A6A33]">
                          {appliedCoupon.code}
                        </p>
                        <p className="mt-1 text-xs text-[#1F2A3C]/72">
                          {appliedCoupon.discountPercent}% popusta
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="rounded-lg border border-[#c46a2d]/30 px-3 py-2 text-xs text-[#B4501F] transition hover:bg-[#c46a2d]/10"
                      >
                        Ukloni
                      </button>
                    </div>
                  </div>
                )}

                {couponMessage && (
                  <p
                    role="status"
                    className={`mt-3 text-xs leading-5 ${
                      appliedCoupon
                        ? "text-[#8A6A33]"
                        : couponMessage.includes("uklonjen")
                          ? "text-[#1F2A3C]/72"
                          : "text-[#B4501F]"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#1F2A3C]/72">
                    Cena proizvoda
                  </span>

                  <span className="text-[#1F2A3C]">
                    {totalPrice.toFixed(2)} RSD
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#8A6A33]">
                      Popust ({appliedCoupon.discountPercent}%)
                    </span>

                    <span className="font-semibold text-[#8A6A33]">
                      -{couponDiscount.toFixed(2)} RSD
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-[#B8955A]/30 pt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#1F2A3C]/72">
                  Ukupno za plaćanje
                </p>

                <p className="mt-2 text-4xl font-bold tracking-tight text-[#8A6A33]">
                  {finalTotal.toFixed(2)} RSD
                </p>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center rounded-2xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-6 py-4 font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_5px_16px_rgba(31,42,60,0.15)] transition hover:brightness-110 active:scale-[0.98]"
              >
                Nastavi na porudžbinu →
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-[#1F2A3C]/60">
                Plaćanje pouzećem
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}