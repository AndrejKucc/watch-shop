"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type AccountUser = {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadAccount() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !user) {
        router.replace("/nalog/prijava");
        return;
      }

      setUser(user);
      setLoading(false);
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("Odjava nije uspela. Pokušaj ponovo.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#211812] via-[#2b2018] to-[#17110d] text-[#d6b878]">
        Učitavanje naloga...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#2b2018] to-[#17110d] px-5 py-16 text-[#f4ebdd]">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-[#b8a99a] transition hover:text-[#ead4a0]"
        >
          ← Nazad u prodavnicu
        </Link>

        <section className="mt-8 rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-6 shadow-[inset_0_1px_0_rgba(234,212,160,0.08),0_12px_40px_rgba(0,0,0,0.2)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b878]">
            WATCH SHOP
          </p>

          <h1 className="mt-4 text-3xl font-bold text-[#f4ebdd] sm:text-4xl">
            Moj nalog
          </h1>

          <p className="mt-3 text-[#c2b5a8]">
            Dobro došao u svoj korisnički nalog.
          </p>

          <div className="mt-8 space-y-5 border-t border-[#d6b878]/20 pt-6">
            <div>
              <p className="text-sm text-[#b8a99a]">Ime i prezime</p>
              <p className="mt-1 text-lg text-[#f4ebdd]">
                {user.user_metadata?.full_name || "Nije uneto"}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#b8a99a]">Email adresa</p>
              <p className="mt-1 break-all text-lg text-[#f4ebdd]">
                {user.email || "Nije dostupna"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-5 py-3 text-sm font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:brightness-110 active:scale-95"
            >
              Nastavi kupovinu
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-[#d6b878]/30 bg-[#211812]/60 px-5 py-3 text-sm font-semibold text-[#ead4a0] transition hover:border-[#d6b878]/60 hover:bg-[#4b3621]/50 active:scale-95"
            >
              Odjavi se
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#c46a2d]/40 bg-[#c46a2d]/10 px-4 py-3 text-sm text-[#f0a477]"
            >
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}