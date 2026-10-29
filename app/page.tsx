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
    className:
      "border-[#D4AF7A]/30 bg-[#4B3621]/90 text-[#F1DDBA]",
  },
  best_buy: {
    text: "BEST BUY",
    className: "border-[#CC5500]/60 bg-[#CC5500]/90 text-white",
  },
  new_model: {
    text: "NOVI MODEL",
    className: "border-white/20 bg-white/10 text-white",
  },
  great_price: {
    text: "ODLIČNA CENA",
    className:
      "border-[#D4AF7A]/30 bg-[#4B3621]/90 text-[#F1DDBA]",
  },
  premium: {
    text: "PREMIUM IZBOR",
    className: "border-white/20 bg-[#352719]/90 text-white",
  },
  bestseller: {
    text: "BESTSELLER",
    className: "border-[#CC5500]/50 bg-[#CC5500]/90 text-white",
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
    <main className="relative min-h-screen overflow-x-clip bg-[#241A13] text-[#F5EEE3] selection:bg-[#D4AF7A] selection:text-[#241A13]">
      <style>{`
        :root {
          color-scheme: dark;
        }

        html {
          scroll-behavior: smooth;
          background: #241A13;
        }

        .ws-glass {
          background: rgba(36, 26, 19, 0.72);
          border: 1px solid rgba(212, 175, 122, 0.14);
          -webkit-backdrop-filter: blur(22px) saturate(145%);
          backdrop-filter: blur(22px) saturate(145%);
        }

        .ws-glass-card {
          background: linear-gradient(
            135deg,
            rgba(212, 175, 122, 0.10),
            rgba(255, 255, 255, 0.018)
          );
          border: 1px solid rgba(212, 175, 122, 0.15);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
        }

        .ws-hero {
          background:
            radial-gradient(ellipse at 75% 35%, rgba(212, 175, 122, 0.19), transparent 48%),
            radial-gradient(ellipse at 10% 85%, rgba(204, 85, 0, 0.14), transparent 42%),
            linear-gradient(115deg, #241A13 0%, #352719 54%, #1A120D 100%);
        }

        .ws-title-gradient {
          background: linear-gradient(
            105deg,
            #F5EEE3 0%,
            #E9D2A6 48%,
            #D4AF7A 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ws-primary-button {
          background: linear-gradient(135deg, #E2C18B, #B99155);
          border: 1px solid rgba(241, 221, 186, 0.40);
          box-shadow: 0 8px 30px rgba(10, 6, 3, 0.25);
          color: #241A13;
          transition: transform 200ms ease, border-color 200ms ease, filter 200ms ease;
        }

        .ws-primary-button:hover {
          border-color: rgba(255, 235, 196, 0.75);
          filter: brightness(1.08);
          transform: translateY(-2px);
        }

        .ws-secondary-button {
          background: rgba(204, 85, 0, 0.13);
          border: 1px solid rgba(204, 85, 0, 0.50);
          transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
        }

        .ws-secondary-button:hover {
          background: rgba(204, 85, 0, 0.25);
          border-color: rgba(230, 126, 49, 0.75);
          transform: translateY(-2px);
        }

        .ws-nav-link {
          position: relative;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.025);
          transition: color 200ms ease, background 200ms ease, border-color 200ms ease;
        }

        .ws-nav-link:hover {
          color: #F1DDBA;
          background: rgba(212, 175, 122, 0.12);
          border-color: rgba(212, 175, 122, 0.25);
        }

        .ws-product-card {
          background: linear-gradient(145deg, #3A2A1D 0%, #2E2117 52%, #241A13 100%);
          border: 1px solid rgba(212, 175, 122, 0.13);
          transition: transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
        }

        .ws-product-card:hover {
          transform: translateY(-5px);
          border-color: rgba(212, 175, 122, 0.48);
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.24);
        }

        .ws-watch-image {
          background:
            radial-gradient(ellipse at 50% 45%, rgba(212, 175, 122, 0.16), transparent 62%),
            linear-gradient(145deg, #443020, #211710);
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF7A]/20 bg-gradient-to-br from-[#6B4B2C] to-[#241A13] transition duration-300 group-hover:border-[#D4AF7A]/45">
                  <span className="text-xl" aria-hidden="true">
                    ⌚
                  </span>
                </div>

                <div className="min-w-0">
                  <h1 className="text-base font-bold tracking-[0.13em] text-[#F5EEE3] sm:text-xl sm:tracking-[0.18em]">
                    WATCH SHOP
                  </h1>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#D4AF7A] sm:text-[10px] sm:tracking-[0.25em]">
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
                className="ws-nav-link shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium text-[#D8C7B0]"
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
          className="pointer-events-none absolute -right-24 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#D4AF7A]/15 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-[360px] w-[360px] rounded-full bg-[#CC5500]/10 blur-[100px]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF7A]/20 bg-[#4B3621]/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#E9D2A6] sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF7A]" />
              Vreme je za nešto posebno
            </div>

            <h2 className="mt-7 text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Stil koji
              <span className="ws-title-gradient block">traje zauvek.</span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#D3C5B3] sm:text-lg sm:leading-8">
              Otkrij satove, narukvice, ogrlice, novčanike i poklone pažljivo
              odabrane za one koji znaju da su detalji ono što čini razliku.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#kolekcija"
                className="ws-primary-button inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold"
              >
                Pogledaj kolekciju
                <span aria-hidden="true">↗</span>
              </a>

              <Link
                href="/satovi"
                className="ws-secondary-button inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-[#F1DDBA]"
              >
                Istraži satove
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.09] pt-6">
              <div>
                <p className="text-lg font-semibold text-[#F5EEE3]">Stil</p>
                <p className="mt-1 text-xs text-[#B9A58C]">
                  Za svaki trenutak
                </p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-lg font-semibold text-[#F5EEE3]">
                  Pažljivo birano
                </p>
                <p className="mt-1 text-xs text-[#B9A58C]">
                  Detalji koji znače
                </p>
              </div>
            </div>
          </div>

          {/* GLAVNA SLIKA SATA — BEZ DONJEG POLJA I STRELICE */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full bg-[#D4AF7A]/20 blur-[70px]"
            />

            <div className="ws-glass-card relative overflow-hidden rounded-[2rem] p-3 shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:rounded-[2.5rem] sm:p-4">
              <div className="ws-watch-image relative isolate flex aspect-[4/4.5] items-center justify-center overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                {/* DEKORATIVNI KRUGOVI */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[42%] h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF7A]/10"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[42%] h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF7A]/10"
                />

                {/* SLIKA SATA */}
                <img
                  src="/images/hero-watch.png"
                  alt="Premium sat iz WATCH SHOP kolekcije"
                  fetchPriority="high"
                  className="absolute inset-0 z-0 h-full w-full rounded-[1.5rem] object-contain p-5 sm:rounded-[2rem] sm:p-8"
                />

                {/* TAMNI PRELIV ZA ČITLJIVOST TEKSTA */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] rounded-[1.5rem] bg-gradient-to-t from-[#1A120D]/90 via-[#1A120D]/10 to-black/10 sm:rounded-[2rem]"
                />

                {/* POSTOJEĆI TEKST PREKO SLIKE */}
                <div className="relative z-10 mt-auto w-full px-4 pb-10 pt-64 text-center sm:px-6 sm:pb-14 sm:pt-72">
                  <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#D4AF7A] sm:text-xs">
                    WATCH SHOP · PREMIUM SELECTION
                  </p>

                  <p className="mt-3 text-2xl font-medium tracking-wide text-[#F5EEE3] sm:text-3xl">
                    Vreme je za pravi izbor.
                  </p>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#D3C5B3]">
                    Pronađi detalj koji upotpunjuje tvoj stil.
                  </p>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-3 h-24 w-24 rounded-full bg-[#CC5500]/15 blur-3xl"
            />
          </div>
        </div>
      </section>

      {/* IZDVOJENI SATOVI */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#D4AF7A]/10 blur-[90px]"
        />

        <div
          id="satovi"
          className="relative scroll-mt-36 flex flex-col justify-between gap-4 border-b border-white/[0.09] pb-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF7A] sm:text-xs">
              Pažljivo odabrana kolekcija
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5EEE3] sm:text-3xl">
              Izdvojeni satovi
            </h3>

            <p className="mt-2 text-sm text-[#C5B5A0]">
              Naš izbor satova koji privlače pažnju.
            </p>
          </div>

          <Link
            href="/satovi"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#E2D4C1] transition hover:border-[#D4AF7A]/30 hover:bg-[#4B3621]/45 hover:text-white"
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
                      <span className="text-sm text-[#C5B5A0]">
                        Slika sata
                      </span>
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241A13]/60 via-transparent to-black/5"
                  />

                  {badge && (
                    <span
                      className={`absolute left-4 top-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center rounded-xl border px-3 py-2 text-[9px] font-bold tracking-[0.1em] shadow-lg backdrop-blur-xl sm:text-[10px] ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  )}

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#241A13]/70 text-lg text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    ↗
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#D4AF7A]">
                    {product.brand || "Watch Shop"}
                  </p>

                  <h4 className="mt-3 text-xl font-semibold tracking-tight text-[#F5EEE3] sm:text-2xl">
                    {product.name}
                  </h4>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.09] pt-4">
                    <p className="text-xl font-bold tracking-tight text-white">
                      {Number(product.price).toLocaleString("sr-RS", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-sm font-medium text-[#C5B5A0]">
                        RSD
                      </span>
                    </p>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D4AF7A]/15 bg-[#4B3621]/50 text-[#E9D2A6] transition group-hover:border-[#D4AF7A]/35 group-hover:bg-[#4B3621]/80">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {displayedWatches.length === 0 && (
            <p className="text-[#C5B5A0]">
              Trenutno nema satova za prikaz.
            </p>
          )}
        </div>

        {/* SVI PROIZVODI */}
        <div id="kolekcija" className="relative mt-20 scroll-mt-36 sm:mt-24">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/[0.09] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF7A] sm:text-xs">
                Istraži naš izbor
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5EEE3] sm:text-3xl">
                Svi proizvodi
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#C5B5A0]">
                Pronađi pravi proizvod i prilagodi prikaz svojim željama.
              </p>
            </div>

            <div className="ws-glass-card flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#E2D4C1]">
              <span className="h-2 w-2 rounded-full bg-[#D4AF7A]" />
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
      <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#1D140E]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#D4AF7A]/15 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                href="/"
                className="text-sm font-bold tracking-[0.22em] text-[#F5EEE3] transition hover:text-[#D4AF7A]"
              >
                WATCH SHOP
              </Link>

              <p className="mt-2 text-sm text-[#C5B5A0]">
                Premium satovi i aksesoari
              </p>
            </div>

            <nav
              aria-label="Navigacija u podnožju"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#D8C7B0]"
            >
              <Link
                href="/about"
                className="transition hover:text-[#D4AF7A]"
              >
                O nama
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-[#D4AF7A]"
              >
                Kontakt
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-[#D4AF7A]"
              >
                Uslovi kupovine
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-[#D4AF7A]"
              >
                Privatnost
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/[0.08] pt-6 text-xs text-[#AD9A83]">
            © {new Date().getFullYear()} WATCH SHOP. Sva prava zadržana.
          </div>
        </div>
      </footer>
    </main>
  );
}