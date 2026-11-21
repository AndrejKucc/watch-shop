import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import CategoryFilter from "@/components/category-filter";
import SiteFooter from "@/components/site-footer";

export default async function PokloniPage() {
  const allProducts = await getProducts();

  const gifts = allProducts.filter(
    (product) =>
      product.product_type === "gift_box" ||
      product.product_type === "gift_set"
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
            Pokloni
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#1F2A3C] sm:text-6xl">
            Poklon program
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#1F2A3C]/72">
            Izaberi poklon kutiju ili kompletan poklon set za
            posebnu priliku.
          </p>
        </div>

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