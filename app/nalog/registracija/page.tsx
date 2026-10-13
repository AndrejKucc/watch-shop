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
            Korisnički nalog
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Napravi nalog
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Registruj se da bi mogao da objavljuješ i upravljaš
            svojim recenzijama.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="register-name"
                className="block text-sm text-neutral-300"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none focus:border-white/40"
                placeholder="Unesi svoje ime"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-sm text-neutral-300"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none focus:border-white/40"
                placeholder="ime@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-sm text-neutral-300"
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
                className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none focus:border-white/40"
                placeholder="Najmanje 8 karaktera"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p role="status" className="text-sm leading-6 text-emerald-400">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? "Kreiranje naloga..." : "Registruj se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            Već imaš nalog?{" "}
            <Link
              href="/nalog/prijava"
              className="text-white underline underline-offset-4"
            >
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}