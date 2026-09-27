import Link from "next/link";

export default function TermsPage() {
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
            Uslovi kupovine
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-400">
            Molimo vas da pre kupovine pročitate osnovne informacije o
            poručivanju, plaćanju, dostavi i obradi porudžbina.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              1. Poručivanje
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Proizvod možete poručiti dodavanjem u korpu i popunjavanjem
              podataka potrebnih za dostavu. Nakon uspešnog slanja porudžbine,
              kupac dobija potvrdu na email adresu koju je uneo prilikom
              kupovine.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              2. Plaćanje
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Trenutno je dostupno plaćanje pouzećem. Kupac plaća poručeni
              iznos prilikom preuzimanja pošiljke.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              3. Dostava
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Porudžbina se šalje na adresu koju kupac unese prilikom
              poručivanja. Kada porudžbina bude poslata, kupac dobija
              obaveštenje putem emaila.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              4. Dostupnost proizvoda
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Dostupnost proizvoda prikazana na sajtu zavisi od trenutnog
              stanja zaliha. U slučaju promene dostupnosti, kupac može biti
              kontaktiran radi dogovora o daljem postupanju.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              5. Tačnost podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Kupac je odgovoran za tačnost podataka koje unosi prilikom
              poručivanja, naročito imena, telefona, email adrese i podataka
              za dostavu.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              6. Kontakt
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-400">
              Za dodatna pitanja u vezi sa proizvodima, porudžbinama ili
              dostavom možete nas kontaktirati putem naše kontakt stranice.
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