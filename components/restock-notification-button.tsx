"use client";

import { useEffect, useState } from "react";

export default function RestockNotificationButton({
  productId,
}: {
  productId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState("");

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

  if (!loggedIn) {
    return (
      <span className="rounded-full border border-[#d6b878]/30 bg-[#211812]/90 px-4 py-2 text-xs font-semibold text-[#FFD0A3]">
        Nije na stanju
      </span>
    );
  }

  if (loading) {
    return (
      <span className="rounded-full border border-[#d6b878]/30 bg-[#211812]/90 px-4 py-2 text-xs text-[#ead4a0]">
        Učitavanje...
      </span>
    );
  }

  if (subscribed) {
    return (
      <div className="text-center">
        <span className="inline-block rounded-full border border-[#d6b878]/40 bg-[#d6b878]/15 px-4 py-2 text-xs font-semibold text-[#ead4a0]">
          ✓ Prijavili ste se za obaveštenje
        </span>

        {message && (
          <p className="mt-2 text-xs text-[#d6b878]">{message}</p>
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
        className="rounded-full border border-[#d6b878]/50 bg-[#211812]/95 px-5 py-3 text-xs font-semibold text-[#ead4a0] shadow-lg transition hover:border-[#ead4a0] hover:bg-[#4b3621] disabled:opacity-50"
      >
        Obavesti me kada bude dostupno
      </button>

      {message && (
        <p role="alert" className="mt-2 text-xs text-[#FFD0A3]">
          {message}
        </p>
      )}
    </div>
  );
}