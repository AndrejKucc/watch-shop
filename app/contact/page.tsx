import Link from "next/link";

export default function ContactPage() {
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
            Kontakt
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400">
            Imate pitanje o nekom satu, porudžbini ili dostavi?
            Kontaktirajte nas i odgovorićemo vam u najkraćem roku.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-xl font-semibold">Email</h2>

            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Za pitanja, porudžbine i sve dodatne informacije možete nam se
              obratiti putem emaila.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-sm text-neutral-500">Email adresa</p>
              <p className="mt-1 text-base text-white">
                Uskoro dostupno
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-xl font-semibold">Telefon</h2>

            <p className="mt-3 text-sm leading-6 text-neutral-400">
              Za bržu komunikaciju i informacije o dostupnosti proizvoda
              možete nas kontaktirati telefonom.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-sm text-neutral-500">Broj telefona</p>
              <p className="mt-1 text-base text-white">
                Uskoro dostupno
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:col-span-2">
            <h2 className="text-xl font-semibold">Informacije o porudžbinama</h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
              Nakon uspešne porudžbine dobićete potvrdu na email adresu koju
              ste uneli prilikom kupovine. Kada porudžbina bude poslata,
              dobićete i obaveštenje o promeni statusa porudžbine.
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
