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
            Korisnički nalog
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#1F2A3C]">
            Napravi nalog
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#1F2A3C]/72">
            Registruj se da bi mogao da objavljuješ i upravljaš
            svojim recenzijama.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="register-name"
                className="block text-sm text-[#8A6A33]"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-[#B8955A]/40 bg-[#1F2A3C]/80 px-4 py-3 text-[#F8F4E7] outline-none placeholder:text-[#1F2A3C]/50 focus:border-[#B8955A]/100 focus:ring-1 focus:ring-[#B8955A]/45"
                placeholder="Unesi svoje ime"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-sm text-[#8A6A33]"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-[#B8955A]/40 bg-[#1F2A3C]/80 px-4 py-3 text-[#F8F4E7] outline-none placeholder:text-[#1F2A3C]/50 focus:border-[#B8955A]/100 focus:ring-1 focus:ring-[#B8955A]/45"
                placeholder="ime@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-sm text-[#8A6A33]"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-[#B8955A]/40 bg-[#1F2A3C]/80 px-4 py-3 text-[#F8F4E7] outline-none placeholder:text-[#1F2A3C]/50 focus:border-[#B8955A]/100 focus:ring-1 focus:ring-[#B8955A]/45"
                placeholder="Najmanje 8 karaktera"
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

            {message && (
              <p
                role="status"
                className="rounded-xl border border-[#B8955A]/40 bg-[#B8955A]/10 px-4 py-3 text-sm leading-6 text-[#8A6A33]"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-5 py-3 font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(31,42,60,0.12)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Kreiranje naloga..." : "Registruj se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1F2A3C]/72">
            Već imaš nalog?{" "}
            <Link
              href="/nalog/prijava"
              className="font-medium text-[#8A6A33] underline decoration-[#8A6A33]/50 underline-offset-4 transition hover:text-white"
            >
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}