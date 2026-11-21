import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";
import SiteFooter from "@/components/site-footer";

export default async function OgrlicePage() {
  const allProducts = await getProducts();

  const necklaces = allProducts.filter(
    (product) => product.product_type === "necklace"
  );

  return (
    <main className="min-h-screen bg-[#F8F4E7] text-[#1F2A3C]">
      <header className="border-b border-[#B8955A]/30 bg-gradient-to-b from-[#FFFFFF] to-[#F8F4E7]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-[#8A6A33] transition-colors hover:text-[#8A6A33]"
          >
            WATCH STORE
          </Link>

          <CartButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#8A6A33]">
            Dodaci
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#1F2A3C] sm:text-6xl">
            Ogrlice
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#1F2A3C]/72">
            Pogledaj naš izbor ogrlica i pronađi elegantan detalj za
            svakodnevni stil ili poseban poklon.
          </p>
        </div>

        <CategoryFilter
          products={necklaces}
          filterMode="accessories"
          productLabel="ogrlice"
          searchPlaceholder="Pretraži ogrlicu, brend ili model..."
         showGenderFilter={true}
        />
      </section>

      <SiteFooter />
    </main>
  );
}