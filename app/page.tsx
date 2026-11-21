import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import { AccountButton } from "@/components/account-button";
import { WishlistCountButton } from "@/components/wishlist";
import CategoryFilter from "@/components/category-filter";

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

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F3F6FB] text-[#1F2A3C] selection:bg-[#7F8FA9] selection:text-white">
      <style>{`
        :root {
          color-scheme: light;
        }

        html {
          scroll-behavior: smooth;
          background: #F3F6FB;
        }

        /* Paleta (po uzoru na sliku): led-bela #F3F6FB · čelik-plava #3E4C66 · srebrno-plava #7F8FA9 · tamna #1F2A3C */

        .ws-glass {
          background: rgba(243, 246, 251, 0.74);
          border: 1px solid rgba(127, 143, 169, 0.22);
          -webkit-backdrop-filter: blur(22px) saturate(145%);
          backdrop-filter: blur(22px) saturate(145%);
        }

        .ws-glass-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.62),
            rgba(127, 143, 169, 0.10)
          );
          border: 1px solid rgba(127, 143, 169, 0.32);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
        }

        /* Staklo za tamnu sekciju (originalni izgled) */
        .ws-glass-card-dark {
          background: linear-gradient(
            135deg,
            rgba(174, 187, 208, 0.10),
            rgba(255, 255, 255, 0.018)
          );
          border: 1px solid rgba(174, 187, 208, 0.15);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
        }

        .ws-hero {
          background:
            radial-gradient(ellipse at 78% 30%, rgba(127, 143, 169, 0.22), transparent 50%),
            radial-gradient(ellipse at 8% 90%, rgba(255, 255, 255, 0.75), transparent 45%),
            linear-gradient(115deg, #F9FBFE 0%, #E6ECF5 55%, #CFD9E7 100%);
        }

        .ws-title-gradient {
          background: linear-gradient(
            105deg,
            #2E3B52 0%,
            #5A6B86 55%,
            #8796B2 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .ws-primary-button {
          background: linear-gradient(135deg, #4A5977, #3E4C66);
          border: 1px solid #5A6B86;
          box-shadow: 0 10px 28px rgba(62, 76, 102, 0.28);
          color: #FFFFFF;
          transition: transform 200ms ease, border-color 200ms ease, filter 200ms ease;
        }

        .ws-primary-button:hover {
          border-color: #6F82A3;
          filter: brightness(1.12);
          transform: translateY(-2px);
        }

        .ws-product-card {
          background: linear-gradient(160deg, #FFFFFF 0%, #F6F8FC 100%);
          border: 1px solid rgba(127, 143, 169, 0.30);
          box-shadow: 0 10px 30px rgba(60, 40, 20, 0.07);
          transition: transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
        }

        .ws-product-card:hover {
          transform: translateY(-5px);
          border-color: #5A6B86;
          box-shadow: 0 24px 55px rgba(60, 40, 20, 0.16);
        }

        .ws-watch-image {
          background:
            radial-gradient(ellipse at 50% 45%, rgba(127, 143, 169, 0.18), transparent 62%),
            linear-gradient(145deg, #DEE6F1, #C6D2E2);
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .ws-primary-button,
          .ws-product-card {
            transition: none;
          }
        }
      `}</style>

      {/* GORNJA NAVIGACIJA */}
      <header className="ws-glass sticky top-0 z-50 border-b border-[#7F8FA9]/25">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
            <Link href="/" className="group min-w-0">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#7F8FA9]/50 shadow-md transition duration-300 group-hover:scale-105 group-hover:border-[#7F8FA9]">
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

                  <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#4E5E7A] sm:text-[10px] sm:tracking-[0.25em]">
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
            className="grid grid-cols-5 gap-2 border-t border-[#7F8FA9]/20 py-3 sm:gap-4"
          >
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border border-transparent px-1 py-2 text-[#44506A] transition-all duration-300 hover:border-[#7F8FA9]/45 hover:bg-[#7F8FA9]/10 hover:text-[#1F2A3C]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#7F8FA9]/40 bg-white/60 text-[#4E5E7A] transition-all duration-300 group-hover:scale-110 group-hover:border-[#5A6B86] group-hover:bg-[#7F8FA9]/10">
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

      {/* LUKSUZNI HERO DEO */}
      <section className="ws-hero relative isolate overflow-hidden border-b border-[#7F8FA9]/25">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#7F8FA9]/20 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-0 -z-10 h-[360px] w-[360px] rounded-full bg-white/70 blur-[100px]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-24">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7F8FA9]/40 bg-white/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#4E5E7A] sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7F8FA9]" />
              Vreme je za nešto posebno
            </div>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.04] tracking-tight text-[#1F2A3C] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Muški i ženski
              <span className="ws-title-gradient block">ručni satovi.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#44506A] sm:text-lg sm:leading-8">
              Otkrij kolekciju muških i ženskih ručnih satova u WATCH STORE-u.
              Pronađi elegantne, moderne i pažljivo odabrane satove, kao i
              narukvice, ogrlice, novčanike i poklone za svaki stil.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#kolekcija"
                className="ws-primary-button inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold"
              >
                Pogledaj kolekciju
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#1F2A3C]/10 pt-6">
              <div>
                <p className="text-lg font-semibold text-[#1F2A3C]">Stil</p>
                <p className="mt-1 text-xs text-[#5F6B7E]">
                  Za svaki trenutak
                </p>
              </div>

              <div className="h-10 w-px bg-[#1F2A3C]/15" />

              <div>
                <p className="text-lg font-semibold text-[#1F2A3C]">
                  Pažljivo birano
                </p>
                <p className="mt-1 text-xs text-[#5F6B7E]">
                  Detalji koji znače
                </p>
              </div>
            </div>
          </div>

          {/* GLAVNA SLIKA SATA */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full bg-[#7F8FA9]/25 blur-[70px]"
            />

            <div className="ws-glass-card relative overflow-hidden rounded-[2rem] p-2 shadow-[0_25px_70px_rgba(60,40,20,0.20)] sm:rounded-[2.5rem] sm:p-3">
              <div className="ws-watch-image relative isolate flex aspect-[4/4.5] items-center justify-center overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                <img
                  src="/images/hero-watch.png"
                  alt="Muški i ženski ručni satovi iz WATCH STORE kolekcije"
                  fetchPriority="high"
                  className="absolute inset-0 z-0 h-full w-full rounded-[1.5rem] object-cover sm:rounded-[2rem]"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[1] rounded-[1.5rem] bg-gradient-to-t from-[#0F1A2E]/85 via-[#0F1A2E]/10 to-black/5 sm:rounded-[2rem]"
                />

                <div className="relative z-10 mt-auto w-full px-4 pb-10 pt-64 text-center sm:px-6 sm:pb-14 sm:pt-72">
                  <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#AEBBD0] sm:text-xs">
                    WATCH STORE · PREMIUM SELECTION
                  </p>

                  <p className="mt-3 text-2xl font-medium tracking-wide text-[#F3F6FB] sm:text-3xl">
                    Vreme je za pravi izbor.
                  </p>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#DCE4EF]">
                    Pronađi detalj koji upotpunjuje tvoj stil.
                  </p>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-3 h-24 w-24 rounded-full bg-[#7F8FA9]/20 blur-3xl"
            />
          </div>
        </div>
      </section>

      {/* IZDVOJENI SATOVI */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-10 h-64 w-64 rounded-full bg-[#7F8FA9]/10 blur-[90px]"
        />

        <div
          id="satovi"
          className="relative scroll-mt-36 flex flex-col justify-between gap-4 border-b border-[#1F2A3C]/10 pb-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4E5E7A] sm:text-xs">
              Pažljivo odabrana kolekcija
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1F2A3C] sm:text-3xl">
              Izdvojeni satovi
            </h2>

            <p className="mt-2 text-sm text-[#44506A]">
              Naš izbor satova koji privlače pažnju.
            </p>
          </div>

          <Link
            href="/satovi"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#7F8FA9] bg-[#3E4C66] px-4 py-2.5 text-sm font-medium text-[#FFFFFF] transition hover:bg-[#4A5977] hover:text-white"
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
                className="ws-product-card group overflow-hidden rounded-[1.75rem]"
              >
                <div className="ws-watch-image relative aspect-[4/3] overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={`${product.name} – ručni sat`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-[#5F6B7E]">
                        Slika sata
                      </span>
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F2A3C]/35 via-transparent to-black/0"
                  />

                  {badge && (
                    <span
                      className={`absolute left-4 top-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center rounded-xl border px-3 py-2 text-[9px] font-bold tracking-[0.1em] shadow-lg backdrop-blur-xl sm:text-[10px] ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  )}

                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#1F2A3C]/70 text-lg text-white opacity-0 backdrop-blur-xl transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    ↗
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-[#4E5E7A]">
                    {product.brand || "WATCH STORE"}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#1F2A3C] sm:text-2xl">
                    {product.name}
                  </h3>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#1F2A3C]/10 pt-4">
                    <div className="min-w-0">
                      {hasDiscount && (
                        <p className="mb-1 text-sm font-medium text-[#5F6B7E] line-through decoration-[#7F8FA9]/70">
                          {oldPrice.toLocaleString("sr-RS", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          RSD
                        </p>
                      )}

                      <p className="text-xl font-bold tracking-tight text-[#4E5E7A]">
                        {currentPrice.toLocaleString("sr-RS", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        <span className="text-sm font-medium text-[#5F6B7E]">
                          RSD
                        </span>
                      </p>
                    </div>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#7F8FA9]/50 bg-[#7F8FA9]/10 text-[#4E5E7A] transition group-hover:border-[#5A6B86] group-hover:bg-[#3E4C66] group-hover:text-[#FFFFFF]">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {displayedWatches.length === 0 && (
            <p className="text-[#5F6B7E]">
              Trenutno nema satova za prikaz.
            </p>
          )}
        </div>
      </section>

      {/* SVI PROIZVODI — tamna espreso sekcija (filter ostaje u svom originalnom izgledu) */}
      <section className="relative border-t border-[#7F8FA9]/25 bg-[#1F2A3C] text-[#F3F6FB]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div id="kolekcija" className="relative scroll-mt-36">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/[0.09] pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#AEBBD0] sm:text-xs">
                  Istraži naš izbor
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#F3F6FB] sm:text-3xl">
                  Svi proizvodi
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A9B5C8]">
                  Pronađi pravi proizvod i prilagodi prikaz svojim željama.
                </p>
              </div>

              <div className="ws-glass-card-dark flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-xs text-[#DCE4EF]">
                <span className="h-2 w-2 rounded-full bg-[#AEBBD0]" />
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
      <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#16202F] text-[#F3F6FB]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#AEBBD0]/15 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#AEBBD0]/40 shadow-lg sm:h-14 sm:w-14">
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
                  className="text-sm font-bold tracking-[0.22em] text-[#F3F6FB] transition hover:text-[#AEBBD0]"
                >
                  WATCH STORE
                </Link>

                <p className="mt-2 text-sm text-[#A9B5C8]">
                  Premium satovi i aksesoari
                </p>
              </div>
            </div>

            <nav
              aria-label="Navigacija u podnožju"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#C9D3E3]"
            >
              <Link href="/about" className="transition hover:text-[#AEBBD0]">
                O nama
              </Link>

              <Link href="/contact" className="transition hover:text-[#AEBBD0]">
                Kontakt
              </Link>

              <Link href="/terms" className="transition hover:text-[#AEBBD0]">
                Uslovi kupovine
              </Link>

              <Link href="/privacy" className="transition hover:text-[#AEBBD0]">
                Privatnost
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/[0.08] pt-6 text-xs text-[#8D9AB0]">
            © {new Date().getFullYear()} WATCH STORE. Sva prava zadržana.
          </div>
        </div>
      </footer>
    </main>
  );
}
