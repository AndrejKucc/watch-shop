import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";
import CollectionHeader from "@/components/collection-header";
import SiteFooter from "@/components/site-footer";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Poklon kutije i poklon setovi",
  description:
    "Izaberite poklon kutiju ili kompletan poklon set u WATCH STORE online prodavnici. Poručite online, plaćanje pouzećem.",
  path: "/pokloni",
});

export default async function PokloniPage() {
  const allProducts = await getProducts();

  const gifts = allProducts.filter(
    (product) =>
      product.product_type === "gift_box" ||
      product.product_type === "gift_set"
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
          eyebrow="Pokloni"
          title="Poklon program"
          description="Izaberi poklon kutiju ili kompletan poklon set za posebnu priliku."
          count={gifts.length}
        />

        <CategoryFilter
          products={gifts}
          filterMode="gifts"
          productLabel="pokloni"
          searchPlaceholder="Pretraži poklon, set ili kutiju..."
          showGenderFilter={false}
        />
      </section>

      <SiteFooter />
    </main>
  );
}