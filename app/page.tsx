import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
import { AccountButton } from "@/components/account-button";
import CategoryFilter from "@/components/category-filter";

const leaves = [
  { left: "2%", delay: "0s", duration: "11s", size: "24px", rotate: "25deg" },
  { left: "7%", delay: "2s", duration: "14s", size: "18px", rotate: "-20deg" },
  { left: "12%", delay: "5s", duration: "12s", size: "28px", rotate: "45deg" },
  { left: "17%", delay: "1s", duration: "15s", size: "20px", rotate: "-35deg" },
  { left: "22%", delay: "7s", duration: "13s", size: "25px", rotate: "15deg" },
  { left: "27%", delay: "3s", duration: "11s", size: "19px", rotate: "-25deg" },
  { left: "32%", delay: "6s", duration: "14s", size: "27px", rotate: "35deg" },
  { left: "37%", delay: "0s", duration: "12s", size: "21px", rotate: "-15deg" },
  { left: "42%", delay: "8s", duration: "15s", size: "26px", rotate: "30deg" },
  { left: "47%", delay: "4s", duration: "11s", size: "18px", rotate: "-30deg" },
  { left: "52%", delay: "2s", duration: "13s", size: "24px", rotate: "20deg" },
  { left: "57%", delay: "7s", duration: "15s", size: "20px", rotate: "-40deg" },
  { left: "62%", delay: "1s", duration: "12s", size: "28px", rotate: "35deg" },
  { left: "67%", delay: "5s", duration: "14s", size: "19px", rotate: "-20deg" },
  { left: "72%", delay: "9s", duration: "11s", size: "25px", rotate: "45deg" },
  { left: "77%", delay: "3s", duration: "13s", size: "21px", rotate: "-35deg" },
  { left: "82%", delay: "6s", duration: "15s", size: "27px", rotate: "15deg" },
  { left: "87%", delay: "0s", duration: "12s", size: "20px", rotate: "-25deg" },
  { left: "92%", delay: "4s", duration: "14s", size: "26px", rotate: "30deg" },
  { left: "97%", delay: "8s", duration: "11s", size: "18px", rotate: "-30deg" },
];

const mainNavigation = [
  { href: "/satovi", label: "Satovi" },
  { href: "/narukvice", label: "Narukvice" },
  { href: "/ogrlice", label: "Ogrlice" },
  { href: "/novcanici", label: "Novčanici" },
  { href: "/pokloni", label: "Pokloni" },
];

const featuredBadges: Record<string, { text: string; className: string }> = {
  recommendation: {
    text: "⭐ NAŠA PREPORUKA",
    className: "border-amber-300/40 bg-amber-400 text-neutral-950",
  },
  best_buy: {
    text: "🔥 BEST BUY",
    className: "border-orange-300/40 bg-orange-500 text-white",
  },
  new_model: {
    text: "✨ NOVI MODEL",
    className: "border-sky-300/40 bg-sky-500 text-white",
  },
  great_price: {
    text: "💰 ODLIČNA CENA",
    className: "border-emerald-300/40 bg-emerald-500 text-neutral-950",
  },
  premium: {
    text: "💎 PREMIUM IZBOR",
    className: "border-violet-300/40 bg-violet-500 text-white",
  },
  bestseller: {
    text: "🏆 BESTSELLER",
    className: "border-rose-300/40 bg-rose-500 text-white",
  },
};

export default async function Home() {
  const products = await getProducts();

  const watches = products.filter(
    (product) => product.product_type === "watch",
  );

  const featuredWatches = watches.filter(
    (product) => product.is_featured === true,
  );

  const displayedWatches = (
    featuredWatches.length > 0 ? featuredWatches : watches
  ).slice(0, 6);

  return (
    <main className="relative min-h-screen bg-neutral-950 text-white">
      <style>{`
        @keyframes autumnFall {
          0% {
            transform: translate3d(0, -12vh, 0) rotate(0deg);
            opacity: 0;
          }

          10% {
            opacity: 0.8;
          }

          50% {
            transform: translate3d(45px, 50vh, 0) rotate(180deg);
          }

          90% {
            opacity: 0.65;
          }

          100% {
            transform: translate3d(-35px, 115vh, 0) rotate(360deg);
            opacity: 0;
          }
        }

        .autumn-leaf {
          position: fixed;
          top: -40px;
          z-index: 5;
          pointer-events: none;
          user-select: none;
          animation-name: autumnFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .autumn-leaf {
            animation: none;
            display: none;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-5 overflow-hidden"
      >
        {leaves.map((leaf, index) => (
          <span
            key={index}
            className="autumn-leaf"
            style={{
              left: leaf.left,
              animationDelay: leaf.delay,
              animationDuration: leaf.duration,
              fontSize: leaf.size,
              transform: `rotate(${leaf.rotate})`,
            }}
          >
            {index % 3 === 0 ? "🍁" : index % 3 === 1 ? "🍂" : "🍃"}
          </span>
        ))}
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex items-center justify-between py-5">
            <Link href="/" className="group">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition group-hover:border-white/30">
                  <span className="text-sm">⌚</span>
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-[0.18em] sm:text-2xl">
                    WATCH SHOP
                  </h1>

                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-neutral-500 sm:text-xs">
                    Premium satovi i aksesoari
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <AccountButton />
              <CartButton />
            </div>
          </div>

          <nav
            aria-label="Glavna navigacija"
            className="flex gap-2 overflow-x-auto border-t border-white/10 py-3"
          >
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
            Kolekcija za svaki stil
          </p>

          <h2 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            Vreme je za
            <span className="block text-neutral-400">pravi izbor.</span>
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            Otkrij satove, narukvice, ogrlice, novčanike i poklone pažljivo
            odabrane za svaki stil i priliku.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#kolekcija"
              className="rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:bg-neutral-200 active:scale-95"
            >
              Pogledaj kolekciju
            </a>
          </div>
        </div>

        <div id="satovi" className="mt-20 border-b border-white/10 pb-5">
          <h3 className="text-xl font-semibold">Izdvojeni satovi</h3>

          <p className="mt-2 text-sm text-neutral-500">
            Naš izbor satova koji privlače pažnju.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedWatches.map((product) => {
            const badgeKey =
              typeof product.featured_badge === "string"
                ? product.featured_badge
                : "";

            const badge = featuredBadges[badgeKey];

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-800/80"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-neutral-500">
                        Slika sata
                      </span>
                    </div>
                  )}

                  {badge && (
                    <span
                      className={`absolute left-4 top-4 z-10 inline-flex max-w-[calc(100%-2rem)] items-center rounded-md border px-3 py-2 text-[10px] font-extrabold tracking-[0.08em] shadow-lg sm:text-xs ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                    {product.brand || "Watch Shop"}
                  </p>

                  <h4 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {product.name}
                  </h4>

                  <p className="mt-5 border-t border-white/10 pt-4 text-2xl font-bold tracking-tight">
                    {Number(product.price).toLocaleString("sr-RS", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    RSD
                  </p>
                </div>
              </Link>
            );
          })}

          {displayedWatches.length === 0 && (
            <p className="text-neutral-500">
              Trenutno nema satova za prikaz.
            </p>
          )}
        </div>

        <div id="kolekcija" className="mt-20 scroll-mt-24">
          <div className="mb-8 border-b border-white/10 pb-5">
            <h3 className="text-2xl font-semibold">Svi proizvodi</h3>

            <p className="mt-2 text-sm text-neutral-500">
              Pronađi pravi proizvod i prilagodi prikaz svojim željama.
            </p>
          </div>

          <CategoryFilter
  products={products}
  filterMode="basic"
  productLabel="proizvodi"
  searchPlaceholder="Pretraži sat, narukvicu, ogrlicu, novčanik ili poklon..."
  showGenderFilter={false}
/>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 bg-neutral-950/90">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em]">
                WATCH SHOP
              </p>

              <p className="mt-2 text-sm text-neutral-500">
                Premium satovi i aksesoari
              </p>
            </div>

            <nav
              aria-label="Navigacija u podnožju"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400"
            >
              <Link href="/about" className="transition hover:text-white">
                O nama
              </Link>

              <Link href="/contact" className="transition hover:text-white">
                Kontakt
              </Link>

              <Link href="/terms" className="transition hover:text-white">
                Uslovi kupovine
              </Link>

              <Link href="/privacy" className="transition hover:text-white">
                Privatnost
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-xs text-neutral-600">
            © {new Date().getFullYear()} WATCH SHOP. Sva prava zadržana.
          </div>
        </div>
      </footer>
    </main>
  );
}