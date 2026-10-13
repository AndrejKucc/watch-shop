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
      <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                WATCH SHOP
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                Admin panel
              </h1>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
            >
              Odjavi se
            </button>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => {
                window.location.href = "/admin/products";
              }}
              className="rounded-3xl border border-white/10 bg-neutral-900 p-8 text-left transition hover:border-white/30"
            >
              <div className="text-3xl">⌚</div>

              <h2 className="mt-5 text-xl font-semibold">
                Proizvodi
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Dodaj, izmeni ili obriši satove.
              </p>
            </button>

            <Link
              href="/admin/orders"
              className="rounded-3xl border border-white/10 bg-neutral-900 p-8 text-left transition hover:border-white/30"
            >
              <div className="text-3xl">📦</div>

              <h2 className="mt-5 text-xl font-semibold">
                Porudžbine
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Pregledaj porudžbine kupaca.
              </p>
            </Link>

            <button
              onClick={() => {
                window.location.href = "/admin/add-product";
              }}
              className="rounded-3xl border border-white/10 bg-neutral-900 p-8 text-left transition hover:border-white/30"
            >
              <div className="text-3xl">➕</div>

              <h2 className="mt-5 text-xl font-semibold">
                Dodaj proizvod
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Dodaj novi sat u prodavnicu.
              </p>
            </button>

            <Link
              href="/admin/reviews"
              className="rounded-3xl border border-white/10 bg-neutral-900 p-8 text-left transition hover:border-white/30"
            >
              <div className="text-3xl">⭐</div>

              <h2 className="mt-5 text-xl font-semibold">
                Recenzije
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Pregledaj ocene i briši neželjene recenzije.
              </p>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8">
        <h1 className="text-3xl font-bold">
          Admin
        </h1>

        <p className="mt-2 text-neutral-400">
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
              className="mb-2 block text-sm text-neutral-400"
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
              className="w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 outline-none focus:border-white/30"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm text-neutral-400"
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
                className="w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 pr-24 outline-none focus:border-white/30"
                placeholder="********"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400 hover:text-white"
              >
                {showPassword ? "Sakrij" : "Prikaži"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </button>

          {message && (
            <p role="alert" className="text-sm text-red-400">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}