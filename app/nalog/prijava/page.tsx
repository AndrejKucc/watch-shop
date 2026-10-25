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
    <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#2b2018] to-[#17110d] px-5 py-16 text-[#f4ebdd]">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm text-[#b8a99a] transition hover:text-[#ead4a0]"
        >
          ← Nazad u prodavnicu
        </Link>

        <div className="mt-10 rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b]/95 via-[#2b2018]/95 to-[#211812]/95 p-6 shadow-[inset_0_1px_0_rgba(234,212,160,0.08),0_12px_40px_rgba(0,0,0,0.2)] sm:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d6b878]">
            Dobro došao nazad
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#f4ebdd]">
            Prijava
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#c2b5a8]">
            Prijavi se da bi mogao da ostavljaš i uređuješ svoje recenzije.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm text-[#ead4a0]"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-[#d6b878]/25 bg-[#211812]/80 px-4 py-3 text-[#f4ebdd] outline-none placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-1 focus:ring-[#d6b878]/30"
                placeholder="ime@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm text-[#ead4a0]"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-[#d6b878]/25 bg-[#211812]/80 px-4 py-3 text-[#f4ebdd] outline-none placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-1 focus:ring-[#d6b878]/30"
                placeholder="Unesi lozinku"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-[#c46a2d]/40 bg-[#c46a2d]/10 px-4 py-3 text-sm text-[#f0a477]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-5 py-3 font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(0,0,0,0.2)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Prijavljivanje..." : "Prijavi se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#b8a99a]">
            Nemaš nalog?{" "}
            <Link
              href="/nalog/registracija"
              className="font-medium text-[#ead4a0] underline decoration-[#d6b878]/50 underline-offset-4 transition hover:text-white"
            >
              Registruj se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}