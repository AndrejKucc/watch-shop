import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-neutral-400 transition hover:text-white"
          >
            ← Nazad na početnu
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-neutral-500">
            WATCH SHOP
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Politika privatnosti
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-400">
            Vaša privatnost nam je važna. Ova stranica objašnjava koje
            podatke prikupljamo prilikom poručivanja i kako ih koristimo.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              1. Podaci koje prikupljamo
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Prilikom poručivanja možemo prikupljati podatke koje kupac
              dobrovoljno unese, kao što su ime i prezime, broj telefona,
              email adresa i podaci potrebni za dostavu.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              2. Svrha korišćenja podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Podaci se koriste prvenstveno za obradu porudžbine, komunikaciju
              sa kupcem i organizaciju dostave. Email adresa se koristi i za
              slanje obaveštenja povezanih sa statusom porudžbine.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              3. Čuvanje podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Podaci povezani sa porudžbinama čuvaju se u sistemu koji
              koristimo za upravljanje prodavnicom. Pristup podacima
              ograničen je na potrebe obrade i upravljanja porudžbinama.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              4. Email obaveštenja
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Nakon kreiranja porudžbine kupac može dobiti potvrdu na email
              adresu koju je uneo. Kada se porudžbina pošalje, može biti
              poslato dodatno obaveštenje o promeni statusa.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              5. Bezbednost
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Preduzimamo razumne tehničke i organizacione mere kako bismo
              zaštitili podatke od neovlašćenog pristupa, izmene ili
              gubitka.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              6. Kontakt
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Ako imate pitanja u vezi sa obradom vaših podataka, možete nam
              se obratiti putem kontakt stranice.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 active:scale-95"
            >
              Kontakt
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}