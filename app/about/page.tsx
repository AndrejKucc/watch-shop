import Link from "next/link";

export default function AboutPage() {
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
            O nama
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#c2b5a8]">
            Dobrodošli u WATCH SHOP — mesto za ljubitelje satova koji cene
            kvalitet, karakter i pažljivo odabrane modele.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              Pažljivo odabrani satovi
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#c2b5a8]">
              Naša kolekcija je namenjena svima koji žele kvalitetan sat sa
              jasnim identitetom. Svaki model biramo sa posebnom pažnjom,
              vodeći računa o dizajnu, karakteristikama i stanju proizvoda.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.05)]">
              <h2 className="text-xl font-semibold text-[#ead4a0]">
                Kvalitet i detalji
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#c2b5a8]">
                Verujemo da sat nije samo dodatak već predmet koji treba da
                ostavi utisak. Zato posebnu pažnju posvećujemo detaljima,
                specifikacijama i prezentaciji svakog proizvoda.
              </p>
            </div>

            <div className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.05)]">
              <h2 className="text-xl font-semibold text-[#ead4a0]">
                Jednostavna kupovina
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#c2b5a8]">
                Želimo da kupovina bude jednostavna i jasna — od pregleda
                kolekcije i detalja sata do poručivanja i informacija o
                dostavi.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.07)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              Naša filozofija
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#c2b5a8]">
              WATCH SHOP gradimo kao prodavnicu u kojoj su proizvod,
              transparentne informacije i iskustvo kupca na prvom mestu.
              Kolekciju ćemo vremenom širiti i pažljivo birati nove modele.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-6 py-3 text-sm font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(0,0,0,0.2)] transition hover:brightness-110 active:scale-95"
            >
              Pogledaj kolekciju
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}