import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import { AccountButton } from "@/components/account-button";
import CategoryFilter from "@/components/category-filter";

const mainNavigation = [
  { href: "/satovi", label: "Satovi" },
  { href: "/narukvice", label: "Narukvice" },
  { href: "/ogrlice", label: "Ogrlice" },
  { href: "/novcanici", label: "Novčanici" },
  { href: "/pokloni", label: "Pokloni" },
];

const featuredBadges: Record<string, { text: string; className: string }> = {
  recommendation: {
    text: "NAŠA PREPORUKA",
    className: "border-emerald-300/30 bg-[#163D30]/90 text-emerald-100",
  },
  best_buy: {
    text: "BEST BUY",
    className: "border-[#8F2638]/60 bg-[#8F2638]/90 text-white",
  },
  new_model: {
    text: "NOVI MODEL",
    className: "border-white/20 bg-white/10 text-white",
  },
  great_price: {
    text: "ODLIČNA CENA",
    className: "border-emerald-300/30 bg-[#163D30]/90 text-emerald-100",
  },
  premium: {
    text: "PREMIUM IZBOR",
    className: "border-white/20 bg-[#262B28]/90 text-white",
  },
  bestseller: {
    text: "BESTSELLER",
    className: "border-[#8F2638]/50 bg-[#8F2638]/90 text-white",
  },
};

export default async function Home() {
  const products = await getProducts();

  const watches = products.filter(
    (product) => product.product_type === "watch",
  );

  const featuredWatches = watches.filter(
    (product) => product.is_featured === true,
  );

  const displayedWatches = (
    featuredWatches.length > 0 ? featuredWatches : watches
  ).slice(0, 6);

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#191C1B] text-[#F3F3EE] selection:bg-[#163D30] selection:text-white">
      <style>{`
        :root {
          color-scheme: dark;
        }

        html {
          scroll-behavior: smooth;
          background: #191C1B;
        }

        .ws-glass {
          background: rgba(25, 28, 27, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.09);
          -webkit-backdrop-filter: blur(22px) saturate(145%);
          backdrop-filter: blur(22px) saturate(145%);
        }

        .ws-glass-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.075),
            rgba(255, 255, 255, 0.018)
          );
          border: 1px solid rgba(255, 255, 255, 0.095);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
        }

        .ws-hero {
          background:
            radial-gradient(ellipse at 75% 35%, rgba(22, 61, 48, 0.42), transparent 48%),
            radial-gradient(ellipse at 10% 85%, rgba(143, 38, 56, 0.13), transparent 42%),
            linear-gradient(115deg, #191C1B 0%, #1D2621 54%, #111513 100%);
        }

        .ws-title-gradient {
          background: linear-gradient(
            105deg,
            #F3F3EE 0%,
            #D6E3D9 48%,
            #8EB59F 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ws-primary-button {
          background: linear-gradient(135deg, #205640, #163D30);
          border: 1px solid rgba(145, 190, 160, 0.32);
          box-shadow: 0 8px 30px rgba(10, 35, 25, 0.25);
          transition: transform 200ms ease, border-color 200ms ease, filter 200ms ease;
        }

        .ws-primary-button:hover {
          border-color: rgba(175, 220, 190, 0.6);
          filter: brightness(1.12);
          transform: translateY(-2px);
        }

        .ws-secondary-button {
          background: rgba(143, 38, 56, 0.13);
          border: 1px solid rgba(143, 38, 56, 0.5);
          transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
        }

        .ws-secondary-button:hover {
          background: rgba(143, 38, 56, 0.25);
          border-color: rgba(205, 85, 105, 0.75);
          transform: translateY(-2px);
        }

        .ws-nav-link {
          position: relative;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.025);
          transition: color 200ms ease, background 200ms ease, border-color 200ms ease;
        }

        .ws-nav-link:hover {
          color: #E4F0E8;
          background: rgba(22, 61, 48, 0.42);
          border-color: rgba(122, 169, 143, 0.22);
        }

        .ws-product-card {
          background: linear-gradient(145deg, #242A26 0%, #1D221F 52%, #191C1B 100%);
          border: 1px solid rgba(255, 255, 255, 0.085);
          transition: transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
        }

        .ws-product-card:hover {
          transform: translateY(-5px);
          border-color: rgba(93, 151, 117, 0.48);
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.24);
        }

        .ws-watch-image {
          background:
            radial-gradient(ellipse at 50% 45%, rgba(22, 61, 48, 0.30), transparent 62%),
            linear-gradient(145deg, #252D28, #171B19);
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .ws-primary-button,
          .ws-secondary-button,
          .ws-nav-link,
          .ws-product-card {
            transition: none;
          }
        }
      `}</style>

      {/* GORNJA NAVIGACIJA */}
      <header className="ws-glass sticky top-0 z-50 border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
            <Link href="/" className="group min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100/15 bg-gradient-to-br from-[#234C3A] to-[#191C1B] transition duration-300 group-hover:border-emerald-200/40">
                  <span className="text-xl" aria-hidden="true">
                    ⌚
                  </span>
                </div>

                <div className="min-w-0">
                  <h1 className="text-base font-bold tracking-[0.13em] text-[#F3F3EE] sm:text-xl sm:tracking-[0.18em]">
                    WATCH SHOP
                  </h1>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#94B3A0] sm:text-[10px] sm:tracking-[0.25em]">
                    Premium satovi i aksesoari
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <AccountButton />
              <CartButton />
            </div>
          </div>

          <nav
            aria-label="Glavna navigacija"
            className="flex gap-2 overflow-x-auto border-t border-white/[0.07] py-3"
          >
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="ws-nav-link shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium text-[#C7D0C9]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* LUKSUZNI HERO DEO */}
      <section className="ws-hero relative isolate overflow-hidden border-b border-white/[0.06]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#163D30]/30 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-[360px] w-[360px] rounded-full bg-[#8F2638]/10 blur-[100px]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100/15 bg-[#163D30]/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#B8D5C1] sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8EB59F]" />
              Vreme je za nešto posebno
            </div>

            <h2 className="mt-7 text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Stil koji
              <span className="ws-title-gradient block">traje zauvek.</span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#BAC5BD] sm:text-lg sm:leading-8">
              Otkrij satove, narukvice, ogrlice, novčanike i poklone pažljivo
              odabrane za one koji znaju da su detalji ono što čini razliku.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#kolekcija"
                className="ws-primary-button inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white"
              >
                Pogledaj kolekciju
                <span aria-hidden="true">↗</span>
              </a>

              <Link
                href="/satovi"
                className="ws-secondary-button inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-[#F1D8DC]"
              >
                Istraži satove
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.09] pt-6">
              <div>
                <p className="text-lg font-semibold text-[#F3F3EE]">Stil</p>
                <p className="mt-1 text-xs text-[#9DAAA1]">
                  Za svaki trenutak
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-lg font-semibold text-[#F3F3EE]">
                  Pažljivo birano
                </p>
                <p className="mt-1 text-xs text-[#9DAAA1]">
                  Detalji koji znače
                </p>
              </div>
            </div>
          </div>

          {/* VIZUELNI PROSTOR ZA LUKSUZNU FOTOGRAFIJU SATA */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full bg-[#163D30]/40 blur-[70px]"
            />

            <div className="ws-glass-card relative overflow-hidden rounded-[2rem] p-3 sm:rounded-[2.5rem] sm:p-4">
              <div className="ws-watch-image relative flex aspect-[4/4.5] items-center justify-center overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(87,133,105,0.19),transparent_55%)]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101512]/90 via-transparent to-black/10"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/[0.06]"
                />

                <div className="relative z-10 px-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-100/15 bg-[#163D30]/35 text-4xl shadow-2xl shadow-black/30 backdrop-blur-xl sm:h-24 sm:w-24">
                    ⌚
                  </div>

                  <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.35em] text-[#9CBBA7] sm:text-xs">
                    WATCH SHOP · PREMIUM SELECTION
                  </p>

                  <p className="mt-3 text-2xl font-medium tracking-wide text-[#F3F3EE] sm:text-3xl">
                    Vreme je za pravi izbor.
                  </p>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#B7C2BA]">
                    Pronađi detalj koji upotpunjuje tvoj stil.
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#191C1B]/65 px-4 py-3 backdrop-blur-xl sm:bottom-5 sm:left-5 sm:right-5">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-[#93B49F]">
                      Tvoja sledeća priča
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      Počinje pravim detaljem
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#8F2638]/40 bg-[#8F2638]/20 text-lg text-[#E5A7B1]"
                  >
                    ↗
                  </span>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-3 h-24 w-24 rounded-full bg-[#8F2638]/15 blur-3xl"
            />
          </div>
        </div>
      </section>

      {/* IZDVOJENI SATOVI */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#163D30]/10 blur-[90px]"
        />

        <div
          id="satovi"
          className="relative flex flex-col justify-between gap-4 border-b border-white/[0.09] pb-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8EB59F] sm:text-xs">
              Pažljivo odabrana kolekcija
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#F3F3EE] sm:text-3xl">
              Izdvojeni satovi
            </h3>

            <p className="mt-2 text-sm text-[#AEBAB1]">
              Naš izbor satova koji privlače pažnju.
            </p>
          </div>

          <Link
            href="/satovi"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#D5DED7] transition hover:border-emerald-200/25 hover:bg-[#163D30]/30 hover:text-white"
          >
            Svi satovi <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedWatches.map((product) => {
            const badgeKey =
              typeof product.featured_badge === "string"
                ? product.featured_badge
                : "";

            const badge = featuredBadges[badgeKey];

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="ws-product-card group overflow-hidden rounded-[1.75rem]"
              >
                <div className="ws-watch-image relative aspect-[4/3] overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-[#AEBAB1]">
                        Slika sata
                      </span>
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#191C1B]/60 via-transparent to-black/5"
                  />

                  {badge && (
                    <span
                      className={`absolute left-4 top-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center rounded-xl border px-3 py-2 text-[9px] font-bold tracking-[0.1em] shadow-lg backdrop-blur-xl sm:text-[10px] ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  )}

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#191C1B]/65 text-lg text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    ↗
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#8EB59F]">
                    {product.brand || "Watch Shop"}
                  </p>

                  <h4 className="mt-3 text-xl font-semibold tracking-tight text-[#F3F3EE] sm:text-2xl">
                    {product.name}
                  </h4>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.09] pt-4">
                    <p className="text-xl font-bold tracking-tight text-white">
                      {Number(product.price).toLocaleString("sr-RS", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-sm font-medium text-[#AEBAB1]">
                        RSD
                      </span>
                    </p>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100/10 bg-[#163D30]/30 text-[#A9CFB7] transition group-hover:border-emerald-100/30 group-hover:bg-[#163D30]/60">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {displayedWatches.length === 0 && (
            <p className="text-[#AEBAB1]">
              Trenutno nema satova za prikaz.
            </p>
          )}
        </div>

        {/* SVI PROIZVODI */}
        <div id="kolekcija" className="relative mt-20 scroll-mt-36 sm:mt-24">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/[0.09] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8EB59F] sm:text-xs">
                Istraži naš izbor
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#F3F3EE] sm:text-3xl">
                Svi proizvodi
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#AEBAB1]">
                Pronađi pravi proizvod i prilagodi prikaz svojim željama.
              </p>
            </div>

            <div className="ws-glass-card flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#C7D0C9]">
              <span className="h-2 w-2 rounded-full bg-[#8EB59F]" />
              Pronađi svoj stil
            </div>
          </div>

          <CategoryFilter
            products={products}
            filterMode="basic"
            productLabel="proizvodi"
            searchPlaceholder="Pretraži sat, narukvicu, ogrlicu, novčanik ili poklon..."
            showGenderFilter={false}
          />
        </div>
      </section>

      {/* PODNOŽJE */}
      <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#141816]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#163D30]/20 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                href="/"
                className="text-sm font-bold tracking-[0.22em] text-[#F3F3EE] transition hover:text-[#B8D5C1]"
              >
                WATCH SHOP
              </Link>

              <p className="mt-2 text-sm text-[#AEBAB1]">
                Premium satovi i aksesoari
              </p>
            </div>

            <nav
              aria-label="Navigacija u podnožju"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#B9C4BC]"
            >
              <Link
                href="/about"
                className="transition hover:text-[#A9CFB7]"
              >
                O nama
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-[#A9CFB7]"
              >
                Kontakt
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-[#A9CFB7]"
              >
                Uslovi kupovine
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-[#A9CFB7]"
              >
                Privatnost
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/[0.08] pt-6 text-xs text-[#849188]">
            © {new Date().getFullYear()} WATCH SHOP. Sva prava zadržana.
          </div>
        </div>
      </footer>
    </main>
  );
}