import Link from "next/link";
import WishlistContent from "@/components/wishlist-content";

export const metadata = {
  title: "Moja lista želja",
  description: "Proizvodi koje ste sačuvali na svojoj listi želja.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-[#211812] text-[#f4ebdd]">
      <header className="border-b border-[#d6b878]/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.18em]"
          >
            WATCH SHOP
          </Link>

          <Link href="/" className="text-sm text-[#d6b878] transition hover:text-[#f4ebdd]">
  Nastavi kupovinu →
</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6b878]">
            WATCH SHOP
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Moja lista želja
          </h1>

          <p className="mt-4 text-sm text-[#b8a99a]">
            Svi proizvodi koje želiš da sačuvaš na jednom mestu.
          </p>
        </div>

        <WishlistContent />
      </section>

      <footer className="border-t border-[#d6b878]/20">
        <div className="mx-auto max-w-7xl px-5 py-8 text-center text-sm text-[#b8a99a] sm:px-6">
          WATCH SHOP — Premium satovi i modni dodaci
        </div>
      </footer>
    </main>
  );
}