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
    <main className="min-h-screen bg-[#211812] text-[#f4ebdd]">
      <header className="border-b border-[#d6b878]/20 bg-gradient-to-b from-[#30231b] to-[#211812]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-[#ead4a0] transition-colors hover:text-[#d6b878]"
          >
            WATCH SHOP
          </Link>

          <CartButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#c49a55]">
            WATCH SHOP
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#f4ebdd] sm:text-6xl">
            Satovi
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#b8a99a]">
            Pažljivo odabrani satovi za muškarce, žene i unisex kolekciju.
          </p>
        </div>

        <CategoryFilter
          products={watches}
          filterMode="watches"
          productLabel="satovi"
          searchPlaceholder="Pretraži sat, brend ili model..."
          showGenderFilter={true}
        />
      </section>

      <footer className="border-t border-[#d6b878]/20 bg-[#17110d]/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[#a99987] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} WATCH SHOP</p>

          <div className="flex gap-6">
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-[#ead4a0]"
            >
              Početna
            </Link>

            <Link
              href="/narukvice"
              className="transition-colors duration-200 hover:text-[#ead4a0]"
            >
              Narukvice
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}