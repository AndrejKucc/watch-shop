import Link from "next/link";

export default function PrivacyPage() {
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
            Politika privatnosti
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c2b5a8]">
            Vaša privatnost nam je važna. Ova stranica objašnjava koje
            podatke prikupljamo prilikom poručivanja i kako ih koristimo.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              1. Podaci koje prikupljamo
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Prilikom poručivanja možemo prikupljati podatke koje kupac
              dobrovoljno unese, kao što su ime i prezime, broj telefona,
              email adresa i podaci potrebni za dostavu.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              2. Svrha korišćenja podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Podaci se koriste prvenstveno za obradu porudžbine, komunikaciju
              sa kupcem i organizaciju dostave. Email adresa se koristi i za
              slanje obaveštenja povezanih sa statusom porudžbine.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              3. Čuvanje podataka
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Podaci povezani sa porudžbinama čuvaju se u sistemu koji
              koristimo za upravljanje prodavnicom. Pristup podacima
              ograničen je na potrebe obrade i upravljanja porudžbinama.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              4. Email obaveštenja
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Nakon kreiranja porudžbine kupac može dobiti potvrdu na email
              adresu koju je uneo. Kada se porudžbina pošalje, može biti
              poslato dodatno obaveštenje o promeni statusa.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/95 to-[#211812]/95 p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.06)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              5. Bezbednost
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Preduzimamo razumne tehničke i organizacione mere kako bismo
              zaštitili podatke od neovlašćenog pristupa, izmene ili
              gubitka.
            </p>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-7 shadow-[inset_0_1px_0_rgba(234,212,160,0.07)] sm:p-9">
            <h2 className="text-2xl font-semibold text-[#ead4a0]">
              6. Kontakt
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#c2b5a8]">
              Ako imate pitanja u vezi sa obradom vaših podataka, možete nam
              se obratiti putem kontakt stranice.
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