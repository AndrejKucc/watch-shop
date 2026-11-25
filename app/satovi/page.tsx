import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";
import CollectionHeader from "@/components/collection-header";
import SiteFooter from "@/components/site-footer";

export default async function WatchesPage() {
  const allProducts = await getProducts();

  const watches = allProducts.filter(
    (product) => product.product_type === "watch"
  );

  return (
    <main className="min-h-screen bg-[#F8F4E7] text-[#1F2A3C]">
      <header className="sticky top-0 z-30 border-b border-[#B8955A]/30 bg-[#F8F4E7]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-[#1F2A3C] transition-transform duration-150 active:scale-95"
          >
            WATCH STORE
          </Link>

          <CartButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-8">
        <CollectionHeader
          eyebrow="Kolekcija"
          title="Satovi"
          description="Pažljivo odabrani satovi za muškarce, žene i unisex kolekciju."
          count={watches.length}
        />

        <CategoryFilter
          products={watches}
          filterMode="watches"
          productLabel="satovi"
          searchPlaceholder="Pretraži sat, brend ili model..."
          showGenderFilter={true}
        />
      </section>

      <SiteFooter />
    </main>
  );
}