"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      setError("Ime mora imati između 2 i 60 karaktera.");
      return;
    }

    if (password.length < 8) {
      setError("Lozinka mora imati najmanje 8 karaktera.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { data, error: registerError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
        },
        emailRedirectTo: `${window.location.origin}/nalog/prijava`,
      },
    });

    setLoading(false);

    if (registerError) {
      setError(
        "Registracija nije uspela. Proveri podatke i pokušaj ponovo."
      );
      return;
    }

    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setMessage(
      "Nalog je kreiran ako je registracija uspešna. Proveri email i potvrdi adresu ako se to traži, pa se prijavi."
    );
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
            Korisnički nalog
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#f4ebdd]">
            Napravi nalog
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#c2b5a8]">
            Registruj se da bi mogao da objavljuješ i upravljaš
            svojim recenzijama.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="register-name"
                className="block text-sm text-[#ead4a0]"
              >
                Ime i prezime
              </label>

              <input
                id="register-name"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={60}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#d6b878]/25 bg-[#211812]/80 px-4 py-3 text-[#f4ebdd] outline-none placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-1 focus:ring-[#d6b878]/30"
                placeholder="Unesi svoje ime"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-sm text-[#ead4a0]"
              >
                Email adresa
              </label>

              <input
                id="register-email"
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
                htmlFor="register-password"
                className="block text-sm text-[#ead4a0]"
              >
                Lozinka
              </label>

              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#d6b878]/25 bg-[#211812]/80 px-4 py-3 text-[#f4ebdd] outline-none placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-1 focus:ring-[#d6b878]/30"
                placeholder="Najmanje 8 karaktera"
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

            {message && (
              <p
                role="status"
                className="rounded-xl border border-[#d6b878]/25 bg-[#d6b878]/10 px-4 py-3 text-sm leading-6 text-[#ead4a0]"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-5 py-3 font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(0,0,0,0.2)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Kreiranje naloga..." : "Registruj se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#b8a99a]">
            Već imaš nalog?{" "}
            <Link
              href="/nalog/prijava"
              className="font-medium text-[#ead4a0] underline decoration-[#d6b878]/50 underline-offset-4 transition hover:text-white"
            >
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}