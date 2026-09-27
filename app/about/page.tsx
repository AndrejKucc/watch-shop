import Link from "next/link";

export default function AboutPage() {
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
            O nama
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400">
            Dobrodošli u WATCH SHOP — mesto za ljubitelje satova koji cene
            kvalitet, karakter i pažljivo odabrane modele.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              Pažljivo odabrani satovi
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-400">
              Naša kolekcija je namenjena svima koji žele kvalitetan sat sa
              jasnim identitetom. Svaki model biramo sa posebnom pažnjom,
              vodeći računa o dizajnu, karakteristikama i stanju proizvoda.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-xl font-semibold">Kvalitet i detalji</h2>

              <p className="mt-3 text-sm leading-7 text-neutral-400">
                Verujemo da sat nije samo dodatak već predmet koji treba da
                ostavi utisak. Zato posebnu pažnju posvećujemo detaljima,
                specifikacijama i prezentaciji svakog proizvoda.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h2 className="text-xl font-semibold">Jednostavna kupovina</h2>

              <p className="mt-3 text-sm leading-7 text-neutral-400">
                Želimo da kupovina bude jednostavna i jasna — od pregleda
                kolekcije i detalja sata do poručivanja i informacija o
                dostavi.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <h2 className="text-2xl font-semibold">
              Naša filozofija
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-400">
              WATCH SHOP gradimo kao prodavnicu u kojoj su proizvod,
              transparentne informacije i iskustvo kupca na prvom mestu.
              Kolekciju ćemo vremenom širiti i pažljivo birati nove modele.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 active:scale-95"
            >
              Pogledaj kolekciju
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}