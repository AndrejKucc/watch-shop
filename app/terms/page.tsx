import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#2b2018] to-[#17110d] text-[#f4ebdd]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-[#b8a99a] transition hover:text-[#ead4a0]"
          >
            ← Nazad na početnu
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-[#d6b878]">
            WATCH SHOP
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#f4ebdd] sm:text-5xl">
            Uslovi kupovine
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c2b5a8]">
            Molimo vas da pre kupovine pročitate osnovne informacije o
            poručivanju, plaćanju, dostavi i obradi porudžbina.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              1. Poručivanje
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Proizvod možete poručiti dodavanjem u korpu i popunjavanjem
              podataka potrebnih za dostavu. Nakon uspešnog slanja porudžbine,
              kupac dobija potvrdu na email adresu koju je uneo prilikom
              kupovine.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              2. Plaćanje
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Trenutno je dostupno plaćanje pouzećem. Kupac plaća poručeni
              iznos prilikom preuzimanja pošiljke.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              3. Dostava
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Porudžbina se šalje na adresu koju kupac unese prilikom
              poručivanja. Kada porudžbina bude poslata, kupac dobija
              obaveštenje putem emaila.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              4. Dostupnost proizvoda
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Dostupnost proizvoda prikazana na sajtu zavisi od trenutnog
              stanja zaliha. U slučaju promene dostupnosti, kupac može biti
              kontaktiran radi dogovora o daljem postupanju.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              5. Tačnost podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Kupac je odgovoran za tačnost podataka koje unosi prilikom
              poručivanja, naročito imena, telefona, email adrese i podataka
              za dostavu.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.07)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              6. Kontakt
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Za dodatna pitanja u vezi sa proizvodima, porudžbinama ili
              dostavom možete nas kontaktirati putem naše kontakt stranice.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex rounded-2xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-6 py-3 text-sm font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(0,0,0,0.2)] transition hover:brightness-110 active:scale-95"
            >
              Kontakt
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}