import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";
import CollectionHeader from "@/components/collection-header";
import SiteFooter from "@/components/site-footer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Novčanici",
  description:
    "Pogledajte izbor novčanika u WATCH STORE online prodavnici. Poručite online, plaćanje pouzećem.",
  path: "/novcanici",
});

export default async function NovcaniciPage() {
  const allProducts = await getProducts();

  const wallets = allProducts.filter(
    (product) => product.product_type === "wallet"
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
          eyebrow="Dodaci"
          title="Novčanici"
          description="Pogledaj naš izbor novčanika i pronađi praktičan i elegantan dodatak za svaki dan."
          count={wallets.length}
        />

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