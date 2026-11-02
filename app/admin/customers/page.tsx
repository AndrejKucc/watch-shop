"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Favorite = {
  id: string;
  name: string;
  brand: string | null;
};

type Customer = {
  id: string;
  email: string;
  favorites: Favorite[];
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch("/api/admin/customers", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Greška pri učitavanju.");
        }

        setCustomers(result.customers || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Došlo je do greške."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  async function copyEmails(emails: string[], label: string) {
    const text = emails.join(", ");

    if (!text) {
      setCopied("Nema email adresa za kopiranje.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);

      setTimeout(() => setCopied(""), 2500);
    } catch {
      setCopied("Kopiranje nije uspelo.");
    }
  }

  const customersWithFavorites = customers.filter(
    (customer) => customer.favorites.length > 0
  );

  const allEmails = customers.map((customer) => customer.email);

  const favoriteEmails = customersWithFavorites.map(
    (customer) => customer.email
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#211812] text-[#d6b878]">
        UČITAVANJE KORISNIKA...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#30231b] to-[#17110d] px-5 py-10 text-[#f4ebdd] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm text-[#d6b878] hover:text-white"
            >
              ← Nazad na admin panel
            </Link>

            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#d6b878]">
              WATCH SHOP
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
              Korisnici i omiljeni proizvodi
            </h1>

            <p className="mt-3 text-sm text-[#b8a99a]">
              Pregled registrovanih korisnika i njihovih lista želja.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl border border-[#d6b878]/30 px-5 py-3 text-sm text-[#ead4a0] transition hover:bg-[#4b3621]"
          >
            Admin panel
          </Link>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-400/30 bg-red-950/20 p-6 text-red-300">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#d6b878]/20 bg-[#30231b] p-6">
                <p className="text-sm text-[#b8a99a]">
                  Ukupno registrovanih korisnika
                </p>

                <p className="mt-3 text-4xl font-bold text-[#ead4a0]">
                  {customers.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#d6b878]/20 bg-[#30231b] p-6">
                <p className="text-sm text-[#b8a99a]">
                  Korisnici sa omiljenim proizvodima
                </p>

                <p className="mt-3 text-4xl font-bold text-[#ead4a0]">
                  {customersWithFavorites.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#d6b878]/20 bg-[#30231b] p-6">
                <p className="text-sm text-[#b8a99a]">
                  Ukupno sačuvanih omiljenih proizvoda
                </p>

                <p className="mt-3 text-4xl font-bold text-[#ead4a0]">
                  {customers.reduce(
                    (total, customer) =>
                      total + customer.favorites.length,
                    0
                  )}
                </p>
              </div>
            </div>

            <section className="mt-8 rounded-2xl border border-[#d6b878]/20 bg-[#30231b] p-6">
              <h2 className="text-xl font-semibold text-[#ead4a0]">
                Sve email adrese
              </h2>

              <p className="mt-2 text-sm text-[#b8a99a]">
                Email adrese svih registrovanih korisnika.
              </p>

              <button
                type="button"
                onClick={() =>
                  copyEmails(allEmails, "Sve email adrese su kopirane!")
                }
                className="mt-5 rounded-xl bg-[#d6b878] px-6 py-3 text-sm font-semibold text-[#211812] transition hover:bg-[#ead4a0]"
              >
                📋 Kopiraj sve email adrese
              </button>
            </section>

            <section className="mt-6 rounded-2xl border border-[#d6b878]/20 bg-[#30231b] p-6">
              <h2 className="text-xl font-semibold text-[#ead4a0]">
                Korisnici koji imaju omiljene proizvode
              </h2>

              <p className="mt-2 text-sm text-[#b8a99a]">
                Samo korisnici koji trenutno imaju proizvode u svojoj listi želja.
              </p>

              <button
                type="button"
                onClick={() =>
                  copyEmails(
                    favoriteEmails,
                    "Email adrese korisnika sa omiljenim proizvodima su kopirane!"
                  )
                }
                className="mt-5 rounded-xl border border-[#d6b878]/50 px-6 py-3 text-sm font-semibold text-[#ead4a0] transition hover:bg-[#4b3621]"
              >
                📋 Kopiraj email adrese korisnika sa omiljenim proizvodima
              </button>
            </section>

            {copied && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-[#d6b878]/30 bg-[#d6b878]/10 p-4 text-sm text-[#ead4a0]"
              >
                {copied}
              </div>
            )}

            <section className="mt-10">
              <h2 className="mb-5 text-2xl font-semibold text-[#ead4a0]">
                Spisak korisnika
              </h2>

              {customers.length === 0 ? (
                <p className="rounded-2xl border border-[#d6b878]/20 bg-[#30231b] p-6 text-[#b8a99a]">
                  Nema registrovanih korisnika.
                </p>
              ) : (
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <article
                      key={customer.id}
                      className="rounded-2xl border border-[#d6b878]/20 bg-[#30231b] p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-all font-semibold text-[#ead4a0]">
                            {customer.email}
                          </p>

                          <p className="mt-1 text-xs text-[#b8a99a]">
                            {customer.favorites.length} omiljenih proizvoda
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            copyEmails(
                              [customer.email],
                              `Kopiran email: ${customer.email}`
                            )
                          }
                          className="shrink-0 rounded-lg border border-[#d6b878]/40 px-4 py-2 text-xs text-[#ead4a0] transition hover:bg-[#4b3621]"
                        >
                          📋 Kopiraj email
                        </button>
                      </div>

                      <div className="mt-5 border-t border-[#d6b878]/15 pt-4">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#b8a99a]">
                          Omiljeni proizvodi
                        </p>

                        {customer.favorites.length === 0 ? (
                          <p className="text-sm text-[#8f8071]">
                            Ovaj korisnik nema omiljenih proizvoda.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {customer.favorites.map((favorite) => (
                              <Link
                                key={favorite.id}
                                href={`/product/${favorite.id}`}
                                className="rounded-lg border border-[#d6b878]/20 bg-[#211812] px-3 py-2 text-sm text-[#ead4a0] transition hover:border-[#d6b878]/60"
                              >
                                {favorite.brand
                                  ? `${favorite.brand} — `
                                  : ""}
                                {favorite.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <p className="mt-8 text-xs leading-6 text-[#8f8071]">
              Napomena: Za slanje promotivnih poruka koristi samo email adrese
              korisnika koji su dali odgovarajući pristanak za marketing.
              Sama registracija ili čuvanje proizvoda u listi želja ne znači
              automatski pristanak na promotivne poruke.
            </p>
          </>
        )}
      </div>
    </main>
  );
}