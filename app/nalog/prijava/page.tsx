"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(
        "Prijava nije uspela. Proveri email, lozinku i da li je email potvrđen."
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-neutral-400 transition hover:text-white"
        >
          ← Nazad u prodavnicu
        </Link>

        <div className="mt-10 rounded-3xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
            Dobro došao nazad
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Prijava
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Prijavi se da bi mogao da ostavljaš i uređuješ svoje recenzije.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm text-neutral-300"
              >
                Email adresa
              </label>

              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none focus:border-white/40"
                placeholder="ime@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm text-neutral-300"
              >
                Lozinka
              </label>

              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none focus:border-white/40"
                placeholder="Unesi lozinku"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? "Prijavljivanje..." : "Prijavi se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Nemaš nalog?{" "}
            <Link
              href="/nalog/registracija"
              className="text-white underline underline-offset-4"
            >
              Registruj se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}