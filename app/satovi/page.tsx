import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import { AccountButton } from "@/components/account-button";
import { WishlistCountButton } from "@/components/wishlist";
import CategoryFilter from "@/components/category-filter";

const mainNavigation = [
  { href: "/satovi", label: "Satovi" },
  { href: "/narukvice", label: "Narukvice" },
  { href: "/ogrlice", label: "Ogrlice" },
  { href: "/novcanici", label: "Novčanici" },
  { href: "/pokloni", label: "Pokloni" },
];

export default async function WatchesPage() {
  const allProducts = await getProducts();

  const watches = allProducts.filter(
    (product) => product.product_type === "watch",
  );

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#241A13] text-[#F5EEE3]">
      {/* GORNJA NAVIGACIJA */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#241A13]/90 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-4 sm:py-5">
            <Link href="/" className="group min-w-0">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#D4AF7A]/40 shadow-lg transition duration-300 group-hover:scale-105 group-hover:border-[#D4AF7A]/80">
                  <Image
                    src="/images/logo.png"
                    alt="WATCH SHOP logo"
                    fill
                    priority
                    sizes="56px"
                    className="object-cover"
                  />
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
              <WishlistCountButton />
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
                className="shrink-0 rounded-xl border border-transparent bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-[#D8C7B0] transition hover:border-[#D4AF7A]/25 hover:bg-[#D4AF7A]/[0.12] hover:text-[#F1DDBA]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* NASLOV STRANICE */}
      <section className="relative overflow-hidden border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_75%_35%,rgba(212,175,122,0.15),transparent_48%),linear-gradient(115deg,#241A13_0%,#352719_54%,#1A120D_100%)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-[350px] w-[350px] rounded-full bg-[#D4AF7A]/10 blur-[100px]"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#D4AF7A]">
              WATCH SHOP
            </p>

            <h2 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-[#F5EEE3] sm:text-7xl">
              Satovi
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#D3C5B3] sm:text-lg sm:leading-8">
              Pažljivo odabrani satovi za muškarce, žene i unisex kolekciju.
            </p>
          </div>
        </div>
      </section>

      {/* KOLEKCIJA SATOVA */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="border-b border-white/[0.09] pb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF7A] sm:text-xs">
                Pažljivo odabrana kolekcija
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#F5EEE3] sm:text-3xl">
                Kolekcija satova
              </h3>
            </div>

            <p className="text-sm text-[#B9A58C]">
              {watches.length}{" "}
              {watches.length === 1 ? "proizvod" : "proizvoda"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CategoryFilter
            products={watches}
            filterMode="watches"
            productLabel="satovi"
            searchPlaceholder="Pretraži sat, brend ili model..."
            showGenderFilter={true}
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
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#D4AF7A]/40 shadow-lg sm:h-14 sm:w-14">
                <Image
                  src="/images/logo.png"
                  alt="WATCH SHOP logo"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

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