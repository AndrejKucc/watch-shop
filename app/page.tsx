import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import { AccountButton } from "@/components/account-button";
import { WishlistCountButton } from "@/components/wishlist";
import CategoryFilter from "@/components/category-filter";
import HeroShowcase, { type HeroSlide } from "@/components/hero-showcase";
import { ProductImage } from "@/components/product-image";

const mainNavigation = [
  {
    href: "/satovi",
    label: "Satovi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="7" y="6" width="10" height="12" rx="3" />
        <path d="M9 6V3h6v3M9 18v3h6v-3M12 9v3l2 1" />
      </svg>
    ),
  },
  {
    href: "/narukvice",
    label: "Narukvice",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M5 8c0-2 3-4 7-4s7 2 7 4-3 4-7 4-7-2-7-4Z" />
        <path d="M5 8v8c0 2 3 4 7 4s7-2 7-4V8" />
        <path d="M5 12c0 2 3 4 7 4s7-2 7-4" />
      </svg>
    ),
  },
  {
    href: "/ogrlice",
    label: "Ogrlice",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M4 4c1 8 4 13 8 13s7-5 8-13" />
        <path d="M12 17v2" />
        <path d="m12 19-2 2h4l-2-2Z" />
      </svg>
    ),
  },
  {
    href: "/novcanici",
    label: "Novčanici",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M3 9h18M16 14h2" />
        <path d="M6 6V4h12v2" />
      </svg>
    ),
  },
  {
    href: "/pokloni",
    label: "Pokloni",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="3" y="10" width="18" height="11" rx="1" />
        <path d="M2 7h20v3H2zM12 7v14M12 7H8a2 2 0 1 1 2-2c0 2 2 2 2 2Zm0 0h4a2 2 0 1 0-2-2c0 2-2 2-2 2Z" />
      </svg>
    ),
  },
];

const featuredBadges: Record<string, { text: string; className: string }> = {
  recommendation: {
    text: "NAŠA PREPORUKA",
    className: "border-[#D4AF7A]/30 bg-[#4B3621]/90 text-[#F1DDBA]",
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
    className: "border-[#D4AF7A]/30 bg-[#4B3621]/90 text-[#F1DDBA]",
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

  const currentYear = new Date().getFullYear();

  // Sati koji se listaju u heroju (samo oni koji imaju sliku)
  const heroSlides: HeroSlide[] = displayedWatches
    .filter(
      (product) =>
        Array.isArray(product.images) &&
        typeof product.images[0] === "string" &&
        product.images[0] !== "",
    )
    .map((product) => {
      const badgeKey =
        typeof product.featured_badge === "string"
          ? product.featured_badge
          : "";

      const oldPrice = Number(product.old_price);

      return {
        id: String(product.id),
        name: String(product.name),
        brand: product.brand || "WATCH STORE",
        href: `/product/${product.id}`,
        cta: "Pogledaj sat",
        image: product.images[0] as string,
        price: Number.isFinite(Number(product.price))
          ? Number(product.price)
          : null,
        oldPrice:
          product.old_price !== null &&
          product.old_price !== undefined &&
          Number.isFinite(oldPrice)
            ? oldPrice
            : null,
        badge: featuredBadges[badgeKey] ?? null,
      };
    });

  const slides: HeroSlide[] =
    heroSlides.length > 0
      ? heroSlides
      : [
          {
            id: "hero-fallback",
            name: "Vreme je za pravi izbor.",
            brand: "WATCH STORE · PREMIUM SELECTION",
            href: "/satovi",
            cta: "Pogledaj satove",
            image: "/images/hero-watch.png",
            price: null,
            oldPrice: null,
            subtitle: "Pronađi detalj koji upotpunjuje tvoj stil.",
            badge: null,
          },
        ];

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F8F4E7] text-[#1F2A3C] selection:bg-[#B8955A] selection:text-white">
      <style>{`
        :root {
          color-scheme: light;
        }

        html {
          scroll-behavior: smooth;
          background: #F8F4E7;
        }

        /* Paleta: osnova #F8F4E7 · navy #1F2A3C · zlato #B8955A · tamno zlato #8A6A33 */

        .ws-glass {
          background: rgba(248, 244, 231, 0.74);
          border: 1px solid rgba(184, 149, 90, 0.22);
          -webkit-backdrop-filter: blur(22px) saturate(145%);
          backdrop-filter: blur(22px) saturate(145%);
        }

        .ws-glass-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.62),
            rgba(184, 149, 90, 0.10)
          );
          border: 1px solid rgba(184, 149, 90, 0.32);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
        }

        /* Tamni filmski okvir (hero + izdvojeni satovi) */
        .ws-stage {
          position: relative;
          background:
            radial-gradient(ellipse 60% 55% at 74% 22%, rgba(184, 149, 90, 0.30), transparent 70%),
            radial-gradient(ellipse 50% 40% at 6% 96%, rgba(184, 149, 90, 0.14), transparent 70%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0) 38%, rgba(0, 0, 0, 0.30)),
            #1F2A3C;
          border: 1px solid rgba(184, 149, 90, 0.28);
          box-shadow:
            0 40px 100px rgba(31, 42, 60, 0.35),
            inset 0 1px 0 rgba(248, 244, 231, 0.08);
        }

        /* fino zrno preko tamnog okvira */
        .ws-grain {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.07;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }

        .ws-serif {
          font-family: Georgia, "Times New Roman", serif;
        }

        .ws-title-gradient {
          background: linear-gradient(105deg, #B8955A 0%, #F8F4E7 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ws-dark-glass {
          background: rgba(248, 244, 231, 0.055);
          border: 1px solid rgba(248, 244, 231, 0.12);
          -webkit-backdrop-filter: blur(16px);
          backdrop-filter: blur(16px);
        }

        .ws-gold-button {
          background: #B8955A;
          color: #1F2A3C;
          border: 1px solid rgba(248, 244, 231, 0.35);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.30);
          transition: transform 200ms ease, filter 200ms ease;
        }

        .ws-gold-button:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
        }

        .ws-ghost-button {
          border: 1px solid rgba(248, 244, 231, 0.28);
          color: #F8F4E7;
          transition: border-color 200ms ease, background 200ms ease, color 200ms ease;
        }

        .ws-ghost-button:hover {
          border-color: #B8955A;
          background: rgba(184, 149, 90, 0.14);
          color: #F8F4E7;
        }

        .ws-hairline {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(184, 149, 90, 0.65),
            transparent
          );
        }

        .ws-ticks {
          height: 10px;
          background: repeating-linear-gradient(
            90deg,
            rgba(248, 244, 231, 0.35) 0 1px,
            transparent 1px 8px
          );
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
        }

        .ws-ring {
          animation: ws-spin 90s linear infinite;
        }

        .ws-card-dark {
          background: linear-gradient(
            160deg,
            rgba(248, 244, 231, 0.10),
            rgba(248, 244, 231, 0.025) 60%
          );
          border: 1px solid rgba(248, 244, 231, 0.10);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.22);
          transition:
            transform 320ms ease,
            border-color 320ms ease,
            box-shadow 320ms ease;
        }

        .ws-card-dark:hover {
          transform: translateY(-6px);
          border-color: rgba(184, 149, 90, 0.70);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.38);
        }

        .ws-rise {
          animation: ws-rise 900ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }

        .ws-ambient-mask {
          -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
        }

        .ws-fade-in {
          animation: ws-fade-in 1100ms ease both;
        }

        .ws-progress {
          transform-origin: left;
          animation: ws-progress 6500ms linear forwards;
        }

        @keyframes ws-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes ws-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        /* Telefon: bez teških efekata zamućenja (brže listanje) */
        @media (max-width: 767px) {
          .ws-glass {
            background: rgba(248, 244, 231, 0.97);
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
          }

          .ws-glass-card,
          .ws-dark-glass {
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
          }

          .ws-dark-glass {
            background: rgba(248, 244, 231, 0.09);
          }

          .ws-card-dark {
            box-shadow: 0 8px 22px rgba(0, 0, 0, 0.22);
          }
        }

        @keyframes ws-rise {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ws-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .ws-ring,
          .ws-rise,
          .ws-fade-in {
            animation: none;
          }

          .ws-progress {
            animation: none;
            transform: none;
          }

          .ws-card-dark,
          .ws-gold-button,
          .ws-ghost-button {
            transition: none;
          }
        }
      `}</style>

      {/* GORNJA NAVIGACIJA */}
      <header className="ws-glass sticky top-0 z-50 border-b border-[#B8955A]/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
            <Link href="/" className="group min-w-0">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#B8955A]/50 shadow-md transition duration-300 group-hover:scale-105 group-hover:border-[#B8955A]">
                  <Image
                    src="/images/logo1.png"
                    alt="WATCH STORE logo"
                    fill
                    priority
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-base font-bold tracking-[0.13em] text-[#1F2A3C] sm:text-xl sm:tracking-[0.18em]">
                    WATCH STORE
                  </span>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#8A6A33] sm:text-[10px] sm:tracking-[0.25em]">
                    Premium satovi i aksesoari
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <AccountButton />
              <WishlistCountButton />
              <CartButton />
            </div>
          </div>

          {/* KATEGORIJE SA IKONICAMA */}
          <nav
            aria-label="Glavna navigacija"
            className="grid grid-cols-5 gap-2 border-t border-[#B8955A]/20 py-3 sm:gap-4"
          >
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-transparent px-1 py-2 text-[#1F2A3C]/80 transition-all duration-300 hover:border-[#B8955A]/45 hover:bg-[#B8955A]/10 hover:text-[#1F2A3C]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B8955A]/40 bg-white/60 text-[#8A6A33] transition-all duration-300 group-hover:scale-110 group-hover:border-[#B8955A] group-hover:bg-[#B8955A]/10">
                  {item.icon}
                </span>

                <span className="text-[10px] font-medium tracking-wide sm:text-xs">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* TAMNI FILMSKI OKVIR: hero + izdvojeni satovi */}
      <div className="px-3 pt-4 sm:px-6 sm:pt-6">
        <div className="ws-stage mx-auto max-w-[1400px] overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem]">
          <div aria-hidden="true" className="ws-grain hidden md:block" />

          {/* HERO: karusel satova sa pozadinom koja prati sat */}
          <HeroShowcase
            slides={slides}
            quickLinks={mainNavigation.map((item) => ({
              href: item.href,
              label: item.label,
            }))}
            year={currentYear}
          />

          {/* IZDVOJENI SATOVI */}
          <section
            id="satovi"
            className="relative z-10 scroll-mt-36 px-6 pb-12 pt-4 sm:px-10 sm:pb-16"
          >
            <div aria-hidden="true" className="ws-hairline mb-12 sm:mb-14" />

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B8955A] sm:text-xs">
                  <span className="h-px w-8 bg-[#B8955A]" />
                  Pažljivo odabrana kolekcija
                </p>

                <h2 className="ws-serif mt-4 text-3xl font-normal tracking-tight text-[#F8F4E7] sm:text-5xl">
                  Izdvojeni satovi
                </h2>

                <p className="mt-3 text-sm text-[#F8F4E7]/65">
                  Naš izbor satova koji privlače pažnju.
                </p>
              </div>

              <Link
                href="/satovi"
                className="ws-ghost-button inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                Svi satovi <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayedWatches.map((product, index) => {
                const badgeKey =
                  typeof product.featured_badge === "string"
                    ? product.featured_badge
                    : "";

                const badge = featuredBadges[badgeKey];

                const oldPrice = Number(product.old_price);
                const currentPrice = Number(product.price);

                const hasDiscount =
                  product.old_price !== null &&
                  product.old_price !== undefined &&
                  Number.isFinite(oldPrice) &&
                  oldPrice > currentPrice;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="ws-card-dark group overflow-hidden rounded-[1.75rem] p-3"
                  >
                    <div className="relative aspect-[4/4.2] overflow-hidden rounded-[1.25rem] bg-[#F8F4E7]/5">
                      {product.images && product.images[0] ? (
                        <ProductImage
                          src={product.images[0]}
                          alt={`${product.name} – ručni sat`}
                          sizes="(min-width: 1024px) 420px, (min-width: 640px) 45vw, 92vw"
                          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm text-[#F8F4E7]/50">
                            Slika sata
                          </span>
                        </div>
                      )}

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F2A3C]/60 via-transparent to-black/0"
                      />

                      {badge && (
                        <span
                          className={`absolute left-4 top-4 z-10 inline-flex max-w-[calc(100%-4.5rem)] items-center rounded-xl border px-3 py-2 text-[9px] font-bold tracking-[0.1em] shadow-lg md:backdrop-blur-xl sm:text-[10px] ${badge.className}`}
                        >
                          {badge.text}
                        </span>
                      )}

                      <span className="absolute right-4 top-4 z-10 text-[10px] font-medium tracking-[0.25em] text-[#F8F4E7]/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#B8955A] bg-[#1F2A3C]/70 text-lg text-[#F8F4E7] opacity-0 md:backdrop-blur-xl transition-all duration-300 group-hover:opacity-100">
                        ↗
                      </span>
                    </div>

                    <div className="px-3 pb-3 pt-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8955A]">
                        {product.brand || "WATCH STORE"}
                      </p>

                      <h3 className="ws-serif mt-3 text-xl font-normal tracking-tight text-[#F8F4E7] sm:text-2xl">
                        {product.name}
                      </h3>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#F8F4E7]/10 pt-4">
                        <div className="min-w-0">
                          {hasDiscount && (
                            <p className="mb-1 text-sm font-medium text-[#F8F4E7]/45 line-through decoration-[#B8955A]/70">
                              {oldPrice.toLocaleString("sr-RS", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              RSD
                            </p>
                          )}

                          <p className="text-xl font-bold tracking-tight text-[#F8F4E7]">
                            {currentPrice.toLocaleString("sr-RS", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span className="text-sm font-medium text-[#B8955A]">
                              RSD
                            </span>
                          </p>
                        </div>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#B8955A]/50 text-[#B8955A] transition group-hover:border-[#B8955A] group-hover:bg-[#B8955A] group-hover:text-[#1F2A3C]">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {displayedWatches.length === 0 && (
                <p className="text-[#F8F4E7]/60">
                  Trenutno nema satova za prikaz.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* SVI PROIZVODI — svetla sekcija; samo filter i kartice proizvoda su plavi */}
      <section className="relative text-[#1F2A3C]">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pb-20 sm:pt-20">
          <div id="kolekcija" className="relative scroll-mt-36">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#1F2A3C]/10 pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8A6A33] sm:text-xs">
                  Istraži naš izbor
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1F2A3C] sm:text-3xl">
                  Svi proizvodi
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#1F2A3C]/70">
                  Pronađi pravi proizvod i prilagodi prikaz svojim željama.
                </p>
              </div>

              <div className="ws-glass-card flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#1F2A3C]/85">
                <span className="h-2 w-2 rounded-full bg-[#B8955A]" />
                Pronađi svoj stil
              </div>
            </div>

            <CategoryFilter
              products={products}
              filterMode="basic"
              productLabel="proizvodi"
              searchPlaceholder="Pretraži sat, narukvicu, ogrlicu, novčanik ili poklon..."
              showGenderFilter={true}
            />
          </div>
        </div>
      </section>

      {/* PODNOŽJE */}
      <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#1F2A3C] text-[#F8F4E7]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#B8955A]/15 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#B8955A]/40 shadow-lg sm:h-14 sm:w-14">
                <Image
                  src="/images/logo1.png"
                  alt="WATCH STORE logo"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div>
                <Link
                  href="/"
                  className="text-sm font-bold tracking-[0.22em] text-[#F8F4E7] transition hover:text-[#B8955A]"
                >
                  WATCH STORE
                </Link>

                <p className="mt-2 text-sm text-[#F8F4E7]/70">
                  Premium satovi i aksesoari
                </p>
              </div>
            </div>

            <nav
              aria-label="Navigacija u podnožju"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#F8F4E7]/80"
            >
              <Link href="/about" className="transition hover:text-[#B8955A]">
                O nama
              </Link>

              <Link href="/contact" className="transition hover:text-[#B8955A]">
                Kontakt
              </Link>

              <Link href="/terms" className="transition hover:text-[#B8955A]">
                Uslovi kupovine
              </Link>

              <Link href="/privacy" className="transition hover:text-[#B8955A]">
                Privatnost
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/[0.08] pt-6 text-xs text-[#F8F4E7]/60">
            © {new Date().getFullYear()} WATCH STORE. Sva prava zadržana.
          </div>
        </div>
      </footer>
    </main>
  );
}
