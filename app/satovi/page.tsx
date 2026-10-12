import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";

export default async function WatchesPage() {
  const allProducts = await getProducts();

  const watches = allProducts.filter(
    (product) => product.product_type === "watch"
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
          <Link href="/" className="group">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition group-hover:border-white/30">
                <span className="text-sm">⌚</span>
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-[0.18em] sm:text-2xl">
                  WATCH SHOP
                </h1>

                <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-neutral-500 sm:text-xs">
                  Premium satovi
                </p>
              </div>
            </div>
          </Link>

          <CartButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
            WATCH SHOP
          </p>

          <h2 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            Satovi
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            Pažljivo odabrani satovi za muškarce, žene i unisex kolekciju.
          </p>
        </div>

        <div className="mt-16 border-b border-white/10 pb-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-xl font-semibold">
              Kolekcija satova
            </h3>

            <p className="text-sm text-neutral-500">
              {watches.length} {watches.length === 1 ? "proizvod" : "proizvoda"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <CategoryFilter products={watches} />
        </div>
      </section>

      <footer className="border-t border-white/10 bg-neutral-950/90">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em]">
                WATCH SHOP
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Premium satovi
              </p>
            </div>

            <nav
              aria-label="Dodatne informacije"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400"
            >
              <Link
                href="/"
                className="transition hover:text-white"
              >
                Početna
              </Link>

              <Link
                href="/about"
                className="transition hover:text-white"
              >
                O nama
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                Kontakt
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-white"
              >
                Uslovi kupovine
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-white"
              >
                Privatnost
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-xs text-neutral-600">
            © {new Date().getFullYear()} WATCH SHOP. Sva prava zadržana.
          </div>
        </div>
      </footer>
    </main>
  );
}