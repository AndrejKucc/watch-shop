"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/cart";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  images: string[] | null;
};

const categories = [
  { value: "sve", label: "Svi" },
  { value: "muski", label: "Muški" },
  { value: "zenski", label: "Ženski" },
  { value: "unisex", label: "Unisex" },
];

export default function CategoryFilter({
  products,
}: {
  products: Product[];
}) {
  const [category, setCategory] = useState("sve");
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "sve" || product.category === category;

      const searchableText = [
        product.name,
        product.brand,
        product.model,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <>
      <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-900/60 p-4 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pretraži sat, brend ili model..."
              aria-label="Pretraži satove"
              className="h-14 w-full rounded-2xl border border-white/10 bg-neutral-950 pl-12 pr-12 text-base text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Obriši pretragu"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => {
              const active = category === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    active
                      ? "bg-white text-black"
                      : "border border-white/10 bg-neutral-950 text-neutral-300 hover:border-white/20 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">
            {search || category !== "sve"
              ? "Rezultati pretrage"
              : "Svi satovi"}
          </p>

          <p className="mt-1 text-lg font-semibold">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "proizvod"
              : filteredProducts.length < 5
                ? "proizvoda"
                : "proizvoda"}
          </p>
        </div>

        {(search || category !== "sve") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("sve");
            }}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-400 transition hover:border-white/20 hover:text-white"
          >
            Resetuj filtere
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-800/80"
          >
            <Link
              href={`/product/${product.id}`}
              className="block"
            >
              <div className="relative overflow-hidden bg-neutral-800">
                <div className="aspect-[4/3]">
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

                <div className="absolute left-4 top-4">
                  <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
                    {product.category === "muski"
                      ? "Muški"
                      : product.category === "zenski"
                        ? "Ženski"
                        : "Unisex"}
                  </span>
                </div>

                {product.stock <= 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                    <span className="rounded-full border border-white/10 bg-neutral-950/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300">
                      Nije na stanju
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6 pb-2">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                  {product.brand || "Watch Shop"}
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  {product.name}
                </h3>

                {product.model && (
                  <p className="mt-1 text-sm text-neutral-500">
                    {product.model}
                  </p>
                )}
              </div>
            </Link>

            <div className="p-6 pt-4">
              <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">
                    Cena
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                    {Number(product.price).toFixed(2)} €
                  </p>
                </div>

                <span
                  className={
                    product.stock > 0
                      ? "text-right text-xs text-neutral-500"
                      : "text-right text-xs text-red-400"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} ${
                        product.stock === 1 ? "komad" : "komada"
                      }`
                    : "Nije na stanju"}
                </span>
              </div>

              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.images?.[0] ?? null,
                  stock: product.stock,
                }}
              />
            </div>
          </article>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full rounded-[2rem] border border-white/10 bg-neutral-900 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-neutral-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Nema rezultata
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Nismo pronašli sat koji odgovara tvojoj pretrazi ili izabranoj
              kategoriji.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("sve");
              }}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 active:scale-95"
            >
              Prikaži sve satove
            </button>
          </div>
        )}
      </div>
    </>
  );
}