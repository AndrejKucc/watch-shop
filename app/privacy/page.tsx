import Link from "next/link";

export default function PrivacyPage() {
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
            Politika privatnosti
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[#1F2A3C]/72">
            Vaša privatnost nam je važna. Ova stranica objašnjava koje
            podatke prikupljamo prilikom poručivanja i kako ih koristimo.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              1. Podaci koje prikupljamo
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Prilikom poručivanja možemo prikupljati podatke koje kupac
              dobrovoljno unese, kao što su ime i prezime, broj telefona,
              email adresa i podaci potrebni za dostavu.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              2. Svrha korišćenja podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Podaci se koriste prvenstveno za obradu porudžbine, komunikaciju
              sa kupcem i organizaciju dostave. Email adresa se koristi i za
              slanje obaveštenja povezanih sa statusom porudžbine.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              3. Čuvanje podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Podaci povezani sa porudžbinama čuvaju se u sistemu koji
              koristimo za upravljanje prodavnicom. Pristup podacima
              ograničen je na potrebe obrade i upravljanja porudžbinama.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              4. Email obaveštenja
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Nakon kreiranja porudžbine kupac može dobiti potvrdu na email
              adresu koju je uneo. Kada se porudžbina pošalje, može biti
              poslato dodatno obaveštenje o promeni statusa.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/95 to-[#F8F4E7]/95 p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              5. Bezbednost
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Preduzimamo razumne tehničke i organizacione mere kako bismo
              zaštitili podatke od neovlašćenog pristupa, izmene ili
              gubitka.
            </p>
          </section>

          <section className="rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-7 shadow-[inset_0_1px_0_rgba(184,149,90,0.07)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#8A6A33]">
              6. Kontakt
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1F2A3C]/72">
              Ako imate pitanja u vezi sa obradom vaših podataka, možete nam
              se obratiti putem kontakt stranice.
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