import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8F4E7] via-[#FFFFFF] to-[#FFFFFF]/100 text-[#1F2A3C]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-[#1F2A3C]/72 transition-colors duration-200 hover:text-[#8A6A33]"
          >
            ← Nazad na početnu
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-[#8A6A33]">
            WATCH STORE
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1F2A3C] sm:text-5xl">
            Kontakt
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#1F2A3C]/72">
            Imate pitanje o nekom satu, porudžbini ili dostavi?
            Kontaktirajte nas i odgovorićemo vam u najkraćem roku.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_30px_rgba(31,42,60,0.072)]">
            <h2 className="text-xl font-semibold text-[#8A6A33]">
              Email
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#1F2A3C]/72">
              Za pitanja, porudžbine i sve dodatne informacije možete nam se
              obratiti putem emaila.
            </p>

            <div className="mt-6 rounded-2xl border border-[#B8955A]/20 bg-[#FFFFFF]/60 px-5 py-4">
              <p className="text-sm text-[#1F2A3C]/60">Email adresa</p>
              <p className="mt-1 text-base text-[#1F2A3C]">
                info@watchstore.rs
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_30px_rgba(31,42,60,0.072)]">
            <h2 className="text-xl font-semibold text-[#8A6A33]">
              Telefon
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#1F2A3C]/72">
              Za bržu komunikaciju i informacije o dostupnosti proizvoda
              možete nas kontaktirati telefonom.
            </p>

            <div className="mt-6 rounded-2xl border border-[#B8955A]/20 bg-[#FFFFFF]/60 px-5 py-4">
              <p className="text-sm text-[#1F2A3C]/60">Broj telefona</p>
              <p className="mt-1 text-base text-[#1F2A3C]">
                +381 63 707 3074
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_35px_rgba(31,42,60,0.09)] md:col-span-2">
            <h2 className="text-xl font-semibold text-[#8A6A33]">
              Informacije o porudžbinama
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#1F2A3C]/72">
              Nakon uspešne porudžbine dobićete potvrdu na email adresu koju
              ste uneli prilikom kupovine. Kada porudžbina bude poslata,
              dobićete i obaveštenje o promeni statusa porudžbine.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl border border-[#B8955A]/90 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-6 py-3 text-sm font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_5px_16px_rgba(184,149,90,0.12)] transition duration-200 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_7px_20px_rgba(184,149,90,0.2)] active:scale-95"
            >
              Pogledaj kolekciju
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}