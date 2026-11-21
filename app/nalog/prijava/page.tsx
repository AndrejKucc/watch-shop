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
    <main className="min-h-screen bg-gradient-to-br from-[#F8F4E7] via-[#FFFFFF] to-[#FFFFFF]/100 px-5 py-16 text-[#1F2A3C]">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-[#1F2A3C]/72 transition hover:text-[#8A6A33]"
        >
          ← Nazad u prodavnicu
        </Link>

        <div className="mt-10 rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF]/95 via-[#FFFFFF]/95 to-[#F8F4E7]/95 p-6 shadow-[inset_0_1px_0_rgba(184,149,90,0.08),0_12px_40px_rgba(31,42,60,0.12)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8A6A33]">
            Dobro došao nazad
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#1F2A3C]">
            Prijava
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#1F2A3C]/72">
            Prijavi se da bi mogao da ostavljaš i uređuješ svoje recenzije.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm text-[#8A6A33]"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-[#B8955A]/40 bg-[#1F2A3C]/80 px-4 py-3 text-[#F8F4E7] outline-none placeholder:text-[#1F2A3C]/50 focus:border-[#B8955A]/100 focus:ring-1 focus:ring-[#B8955A]/45"
                placeholder="ime@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm text-[#8A6A33]"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-[#B8955A]/40 bg-[#1F2A3C]/80 px-4 py-3 text-[#F8F4E7] outline-none placeholder:text-[#1F2A3C]/50 focus:border-[#B8955A]/100 focus:ring-1 focus:ring-[#B8955A]/45"
                placeholder="Unesi lozinku"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-[#c46a2d]/40 bg-[#c46a2d]/10 px-4 py-3 text-sm text-[#B4501F]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-5 py-3 font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(31,42,60,0.12)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Prijavljivanje..." : "Prijavi se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1F2A3C]/72">
            Nemaš nalog?{" "}
            <Link
              href="/nalog/registracija"
              className="font-medium text-[#8A6A33] underline decoration-[#8A6A33]/50 underline-offset-4 transition hover:text-white"
            >
              Registruj se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}