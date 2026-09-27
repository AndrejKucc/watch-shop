import Link from "next/link";
import { getProducts } from "@/lib/products";
import { CartButton } from "@/components/cart";
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

export default async function Home() {
  const products = await getProducts();

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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
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
                  Premium satovi
                </p>
              </div>
            </div>
          </Link>

          <CartButton />
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-neutral-500">
            Kolekcija satova
          </p>

          <h2 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            Vreme je za
            <span className="block text-neutral-400">
              pravi izbor.
            </span>
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg sm:leading-8">
            Pažljivo odabrani satovi za one koji cene kvalitet, stil i
            karakter.
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

        <div
          id="satovi"
          className="mt-20 border-b border-white/10 pb-5"
        >
          <h3 className="text-xl font-semibold">
            Izdvojeni satovi
          </h3>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-800/80"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-800">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-sm text-neutral-500">
                      Slika sata
                    </span>
                  </div>
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
                  {Number(product.price).toFixed(2)} €
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div id="kolekcija" className="mt-16 scroll-mt-24">
          <CategoryFilter products={products} />
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
                Premium satovi
              </p>
            </div>

            <nav
              aria-label="Dodatne informacije"
              className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-400"
            >
              <Link
                href="/about"
                className="transition hover:text-white"
              >
                O nama
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                Kontakt
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-white"
              >
                Uslovi kupovine
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-white"
              >
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