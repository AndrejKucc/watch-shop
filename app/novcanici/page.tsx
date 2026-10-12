import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";

export default async function NovcaniciPage() {
  const allProducts = await getProducts();

  const wallets = allProducts.filter(
    (product) => product.product_type === "wallet"
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-white"
          >
            WATCH SHOP
          </Link>

          <CartButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-neutral-500">
            Dodaci
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Novčanici
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-400">
            Pogledaj naš izbor novčanika i pronađi praktičan i
            elegantan dodatak za svaki dan.
          </p>
        </div>

        <CategoryFilter
          products={wallets}
          productLabel="novčanici"
          searchPlaceholder="Pretraži novčanik, brend ili model..."
          showGenderFilter={false}
        />
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} WATCH SHOP</p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Početna
            </Link>

            <Link
              href="/satovi"
              className="transition hover:text-white"
            >
              Satovi
            </Link>

            <Link
              href="/narukvice"
              className="transition hover:text-white"
            >
              Narukvice
            </Link>

            <Link
              href="/ogrlice"
              className="transition hover:text-white"
            >
              Ogrlice
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}