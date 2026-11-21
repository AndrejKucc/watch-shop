"use client";

import { useEffect, useState } from "react";

export default function RestockNotificationButton({
  productId,
  variant = "default",
}: {
  productId: string;
  variant?: "default" | "cart";
}) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState("");

  const cartButtonClass =
    "mt-6 w-full rounded-2xl border px-5 py-3 font-semibold transition-all duration-200 active:scale-95";

  const cartGoldClass =
    "border-[#B8955A]/90 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_5px_16px_rgba(184,149,90,0.12)] hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_7px_20px_rgba(184,149,90,0.2)]";

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      try {
        const response = await fetch(
          `/api/restock-notifications?productId=${encodeURIComponent(productId)}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!active) return;

        setLoggedIn(Boolean(result.loggedIn));
        setSubscribed(Boolean(result.subscribed));
      } catch {
        if (active) {
          setLoggedIn(false);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    checkStatus();

    return () => {
      active = false;
    };
  }, [productId]);

  async function subscribe() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/restock-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Došlo je do greške.");
      }

      setSubscribed(true);
      setMessage("Uspešno ste prijavljeni za obaveštenje.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Došlo je do greške."
      );
    } finally {
      setLoading(false);
    }
  }

  if (variant === "cart") {
    if (loading) {
      return (
        <button
          type="button"
          disabled
          className={`${cartButtonClass} cursor-wait border-[#1F2A3C]/15 bg-[#FFFFFF] text-[#1F2A3C]/72`}
        >
          Učitavanje...
        </button>
      );
    }

    if (!loggedIn) {
      return (
        <button
          type="button"
          disabled
          className={`${cartButtonClass} cursor-not-allowed border-[#1F2A3C]/15 bg-[#FFFFFF] text-[#1F2A3C]/60`}
        >
          Nije na stanju
        </button>
      );
    }

    if (subscribed) {
      return (
        <div className="w-full">
          <button
            type="button"
            disabled
            className={`${cartButtonClass} cursor-default ${cartGoldClass}`}
          >
            ✓ Prijavljeni ste za obaveštenje
          </button>

          {message && (
            <p className="mt-2 text-center text-xs text-[#8A6A33]">
              {message}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        <button
          type="button"
          onClick={subscribe}
          disabled={loading}
          className={`${cartButtonClass} ${cartGoldClass} disabled:opacity-50`}
        >
          Obavesti me kada bude dostupno
        </button>

        {message && (
          <p role="alert" className="mt-2 text-center text-xs text-[#B4501F]">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <span className="rounded-full border border-[#B8955A]/45 bg-[#F8F4E7]/90 px-4 py-2 text-xs font-semibold text-[#B4501F]">
        Nije na stanju
      </span>
    );
  }

  if (loading) {
    return (
      <span className="rounded-full border border-[#B8955A]/45 bg-[#1F2A3C]/90 px-4 py-2 text-xs text-[#F8F4E7]">
        Učitavanje...
      </span>
    );
  }

  if (subscribed) {
    return (
      <div className="text-center">
        <span className="inline-block rounded-full border border-[#B8955A]/60 bg-[#B8955A]/15 px-4 py-2 text-xs font-semibold text-[#8A6A33]">
          ✓ Prijavili ste se za obaveštenje
        </span>

        {message && (
          <p className="mt-2 text-xs text-[#8A6A33]">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={subscribe}
        disabled={loading}
        className="rounded-full border border-[#B8955A]/75 bg-[#1F2A3C]/95 px-5 py-3 text-xs font-semibold text-[#F8F4E7] shadow-lg transition hover:border-[#B8955A]/100 hover:bg-[#1F2A3C]/85 disabled:opacity-50"
      >
        Obavesti me kada bude dostupno
      </button>

      {message && (
        <p role="alert" className="mt-2 text-xs text-[#B4501F]">
          {message}
        </p>
      )}
    </div>
  );
}