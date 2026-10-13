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
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        Učitavanje naloga...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-neutral-400 transition hover:text-white"
        >
          ← Nazad u prodavnicu
        </Link>

        <section className="mt-8 rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            WATCH SHOP
          </p>

          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Moj nalog
          </h1>

          <p className="mt-3 text-neutral-400">
            Dobro došao u svoj korisnički nalog.
          </p>

          <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
            <div>
              <p className="text-sm text-neutral-500">Ime i prezime</p>
              <p className="mt-1 text-lg">
                {user.user_metadata?.full_name || "Nije uneto"}
              </p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">Email adresa</p>
              <p className="mt-1 break-all text-lg">
                {user.email || "Nije dostupna"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Nastavi kupovinu
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
            >
              Odjavi se
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}