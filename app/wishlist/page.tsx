import Link from "next/link";
import WishlistContent from "@/components/wishlist-content";
import SiteFooter from "@/components/site-footer";

export const metadata = {
  title: "Moja lista želja",
  description: "Proizvodi koje ste sačuvali na svojoj listi želja.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-[#F8F4E7] text-[#1F2A3C]">
      <header className="border-b border-[#B8955A]/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.18em]"
          >
            WATCH STORE
          </Link>

          <Link href="/" className="text-sm text-[#8A6A33] transition hover:text-[#1F2A3C]">
  Nastavi kupovinu →
</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#8A6A33]">
            WATCH STORE
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Moja lista želja
          </h1>

          <p className="mt-4 text-sm text-[#1F2A3C]/72">
            Svi proizvodi koje želiš da sačuvaš na jednom mestu.
          </p>
        </div>

        <WishlistContent />
      </section>

      <SiteFooter />
    </main>
  );
}