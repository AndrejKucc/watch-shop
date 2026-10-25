"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) {
      setMessage("Pogrešan email ili lozinka.");
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    setLoading(false);
  }

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    setLoggedIn(false);
    setEmail("");
    setPassword("");
  }

  if (loggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#30231b] to-[#17110d] px-6 py-12 text-[#f4ebdd]">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#d6b878]">
                WATCH SHOP
              </p>

              <h1 className="mt-2 text-4xl font-bold text-[#f4ebdd]">
                Admin panel
              </h1>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#d6b878]/35 bg-[#30231b]/80 px-5 py-3 text-sm text-[#ead4a0] transition hover:border-[#d6b878]/70 hover:bg-[#4b3621] hover:text-white"
            >
              Odjavi se
            </button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => {
                window.location.href = "/admin/products";
              }}
              className="rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] to-[#211812] p-8 text-left shadow-[inset_0_1px_0_rgba(234,212,160,0.05)] transition hover:border-[#d6b878]/65 hover:bg-[#4b3621]"
            >
              <div className="text-3xl">⌚</div>

              <h2 className="mt-5 text-xl font-semibold text-[#ead4a0]">
                Proizvodi
              </h2>

              <p className="mt-2 text-sm text-[#b8a99a]">
                Dodaj, izmeni ili obriši satove.
              </p>
            </button>

            <Link
              href="/admin/orders"
              className="rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] to-[#211812] p-8 text-left shadow-[inset_0_1px_0_rgba(234,212,160,0.05)] transition hover:border-[#d6b878]/65 hover:bg-[#4b3621]"
            >
              <div className="text-3xl">📦</div>

              <h2 className="mt-5 text-xl font-semibold text-[#ead4a0]">
                Porudžbine
              </h2>

              <p className="mt-2 text-sm text-[#b8a99a]">
                Pregledaj porudžbine kupaca.
              </p>
            </Link>

            <button
              onClick={() => {
                window.location.href = "/admin/add-product";
              }}
              className="rounded-3xl border border-[#c46a2d]/35 bg-gradient-to-br from-[#30231b] to-[#211812] p-8 text-left shadow-[inset_0_1px_0_rgba(234,212,160,0.05)] transition hover:border-[#c46a2d]/75 hover:bg-[#4b3621]"
            >
              <div className="text-3xl">➕</div>

              <h2 className="mt-5 text-xl font-semibold text-[#ead4a0]">
                Dodaj proizvod
              </h2>

              <p className="mt-2 text-sm text-[#b8a99a]">
                Dodaj novi sat u prodavnicu.
              </p>
            </button>

            <Link
              href="/admin/reviews"
              className="rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] to-[#211812] p-8 text-left shadow-[inset_0_1px_0_rgba(234,212,160,0.05)] transition hover:border-[#d6b878]/65 hover:bg-[#4b3621]"
            >
              <div className="text-3xl">⭐</div>

              <h2 className="mt-5 text-xl font-semibold text-[#ead4a0]">
                Recenzije
              </h2>

              <p className="mt-2 text-sm text-[#b8a99a]">
                Pregledaj ocene i briši neželjene recenzije.
              </p>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#211812] via-[#30231b] to-[#17110d] px-6 text-[#f4ebdd]">
      <div className="w-full max-w-md rounded-3xl border border-[#d6b878]/30 bg-gradient-to-br from-[#30231b] via-[#211812] to-[#17110d] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(234,212,160,0.08)]">
        <h1 className="text-3xl font-bold text-[#ead4a0]">
          Admin
        </h1>

        <p className="mt-2 text-[#b8a99a]">
          Prijavi se da upravljaš prodavnicom.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleLogin();
          }}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm text-[#c2b5a8]"
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-[#d6b878]/25 bg-[#17110d] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm text-[#c2b5a8]"
            >
              Lozinka
            </label>

            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-[#d6b878]/25 bg-[#17110d] px-4 py-3 pr-24 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                placeholder="********"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#b8a99a] transition hover:text-[#ead4a0]"
              >
                {showPassword ? "Sakrij" : "Prikaži"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-[#ead4a0]/60 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-4 py-3 font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </button>

          {message && (
            <p role="alert" className="text-sm text-[#f0a08a]">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}