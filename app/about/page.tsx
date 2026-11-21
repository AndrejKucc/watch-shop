import Link from "next/link";

export default function AboutPage() {
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
            O nama
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#1F2A3C]/72">
            Dobrodošli u WATCH STORE — mesto za ljubitelje satova koji cene
            kvalitet, karakter i pažljivo odabrane modele.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              Pažljivo odabrani satovi
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#1F2A3C]/72">
              Naša kolekcija je namenjena svima koji žele kvalitetan sat sa
              jasnim identitetom. Svaki model biramo sa posebnom pažnjom,
              vodeći računa o dizajnu, karakteristikama i stanju proizvoda.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.05)]">
              <h2 className="text-xl font-semibold text-[#8A6A33]">
                Kvalitet i detalji
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#1F2A3C]/72">
                Verujemo da sat nije samo dodatak već predmet koji treba da
                ostavi utisak. Zato posebnu pažnju posvećujemo detaljima,
                specifikacijama i prezentaciji svakog proizvoda.
              </p>
            </div>

            <div className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.05)]">
              <h2 className="text-xl font-semibold text-[#8A6A33]">
                Jednostavna kupovina
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#1F2A3C]/72">
                Želimo da kupovina bude jednostavna i jasna — od pregleda
                kolekcije i detalja sata do poručivanja i informacija o
                dostavi.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.07)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              Naša filozofija
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#1F2A3C]/72">
              WATCH STORE gradimo kao prodavnicu u kojoj su proizvod,
              transparentne informacije i iskustvo kupca na prvom mestu.
              Kolekciju ćemo vremenom širiti i pažljivo birati nove modele.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-6 py-3 text-sm font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(31,42,60,0.12)] transition hover:brightness-110 active:scale-95"
            >
              Pogledaj kolekciju
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}