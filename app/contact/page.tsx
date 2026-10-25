import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#2b2018] to-[#17110d] text-[#f4ebdd]">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-[#b8a99a] transition-colors duration-200 hover:text-[#ead4a0]"
          >
            ← Nazad na početnu
          </Link>

          <p className="mt-10 text-sm uppercase tracking-[0.3em] text-[#c49a55]">
            WATCH SHOP
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#f4ebdd] sm:text-5xl">
            Kontakt
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#b8a99a]">
            Imate pitanje o nekom satu, porudžbini ili dostavi?
            Kontaktirajte nas i odgovorićemo vam u najkraćem roku.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.12)]">
            <h2 className="text-xl font-semibold text-[#ead4a0]">
              Email
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
              Za pitanja, porudžbine i sve dodatne informacije možete nam se
              obratiti putem emaila.
            </p>

            <div className="mt-6 rounded-2xl border border-[#d6b878]/15 bg-[#17110d]/60 px-5 py-4">
              <p className="text-sm text-[#a99987]">Email adresa</p>
              <p className="mt-1 text-base text-[#f4ebdd]">
                Uskoro dostupno
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.12)]">
            <h2 className="text-xl font-semibold text-[#ead4a0]">
              Telefon
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
              Za bržu komunikaciju i informacije o dostupnosti proizvoda
              možete nas kontaktirati telefonom.
            </p>

            <div className="mt-6 rounded-2xl border border-[#d6b878]/15 bg-[#17110d]/60 px-5 py-4">
              <p className="text-sm text-[#a99987]">Broj telefona</p>
              <p className="mt-1 text-base text-[#f4ebdd]">
                Uskoro dostupno
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_14px_35px_rgba(0,0,0,0.15)] md:col-span-2">
            <h2 className="text-xl font-semibold text-[#ead4a0]">
              Informacije o porudžbinama
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#b8a99a]">
              Nakon uspešne porudžbine dobićete potvrdu na email adresu koju
              ste uneli prilikom kupovine. Kada porudžbina bude poslata,
              dobićete i obaveštenje o promeni statusa porudžbine.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl border border-[#ead4a0]/60 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-6 py-3 text-sm font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_5px_16px_rgba(214,184,120,0.12)] transition duration-200 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_7px_20px_rgba(214,184,120,0.2)] active:scale-95"
            >
              Pogledaj kolekciju
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}