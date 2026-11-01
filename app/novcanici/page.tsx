import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";
import SiteFooter from "@/components/site-footer";

export default async function NovcaniciPage() {
  const allProducts = await getProducts();

  const wallets = allProducts.filter(
    (product) => product.product_type === "wallet"
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
            Dodaci
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#f4ebdd] sm:text-6xl">
            Novčanici
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#b8a99a]">
            Pogledaj naš izbor novčanika i pronađi praktičan i
            elegantan dodatak za svaki dan.
          </p>
        </div>

        <CategoryFilter
          products={wallets}
          filterMode="wallets"
          productLabel="novčanici"
          searchPlaceholder="Pretraži novčanik, brend ili model..."
          showGenderFilter={false}
        />
      </section>

      <SiteFooter />
    </main>
  );
}