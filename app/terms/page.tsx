import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8F4E7] via-[#FFFFFF] to-[#FFFFFF]/100 text-[#1F2A3C]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-[#1F2A3C]/72 transition hover:text-[#8A6A33]"
          >
            ← Nazad na početnu
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-[#8A6A33]">
            WATCH STORE
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1F2A3C] sm:text-5xl">
            Uslovi kupovine
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[#1F2A3C]/72">
            Molimo vas da pre kupovine pročitate osnovne informacije o
            poručivanju, plaćanju, dostavi i obradi porudžbina.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              1. Poručivanje
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Proizvod možete poručiti dodavanjem u korpu i popunjavanjem
              podataka potrebnih za dostavu. Nakon uspešnog slanja porudžbine,
              kupac dobija potvrdu na email adresu koju je uneo prilikom
              kupovine.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              2. Plaćanje
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Trenutno je dostupno plaćanje pouzećem. Kupac plaća poručeni
              iznos prilikom preuzimanja pošiljke.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              3. Dostava
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Porudžbina se šalje na adresu koju kupac unese prilikom
              poručivanja. Kada porudžbina bude poslata, kupac dobija
              obaveštenje putem emaila.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              4. Dostupnost proizvoda
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Dostupnost proizvoda prikazana na sajtu zavisi od trenutnog
              stanja zaliha. U slučaju promene dostupnosti, kupac može biti
              kontaktiran radi dogovora o daljem postupanju.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              5. Tačnost podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Kupac je odgovoran za tačnost podataka koje unosi prilikom
              poručivanja, naročito imena, telefona, email adrese i podataka
              za dostavu.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.07)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              6. Kontakt
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Za dodatna pitanja u vezi sa proizvodima, porudžbinama ili
              dostavom možete nas kontaktirati putem naše kontakt stranice.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-2xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-6 py-3 text-sm font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(31,42,60,0.12)] transition hover:brightness-110 active:scale-95"
            >
              Kontakt
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}