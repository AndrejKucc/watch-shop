"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { AddToCartButton } from "@/components/cart";
import { useWishlist } from "@/components/wishlist";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  price: number;
  stock: number;
  images: string[] | null;
};

export default function WishlistContent() {
  const { productIds, loading, removeFromWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      if (loading) return;

      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      setFetching(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("public_products_v2")
        .select("id, name, brand, price, stock, images")
        .in("id", productIds);

      if (!active) return;

      if (error) {
        console.error("Greška pri učitavanju liste želja:", error);
        setProducts([]);
      } else {
        const sortedProducts = (data || []).sort(
          (a, b) =>
            productIds.indexOf(a.id) - productIds.indexOf(b.id)
        );

        setProducts(sortedProducts as Product[]);
      }

      setFetching(false);
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [productIds, loading]);

  async function handleRemove(productId: string) {
    await removeFromWishlist(productId);

    setProducts((current) =>
      current.filter((product) => product.id !== productId)
    );
  }

  if (loading || fetching) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm tracking-widest text-[#d6b878]">
          UČITAVANJE LISTE ŽELJA...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
        <span className="text-6xl text-[#d6b878]">♡</span>

        <h2 className="mt-6 text-2xl font-semibold">
          Tvoja lista želja je prazna
        </h2>

        <p className="mt-3 max-w-md text-sm leading-7 text-[#b8a99a]">
          Sačuvaj proizvode koji ti se dopadaju klikom na srce
          i pronađi ih ovde kada god poželiš.
        </p>

        <Link
          href="/satovi"
          className="mt-8 rounded-full border border-[#d6b878]/50 bg-[#d6b878] px-7 py-3 text-sm font-semibold text-[#211812] transition hover:bg-[#e6ca91]"
        >
          Pogledaj proizvode
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const image = product.images?.[0];

        return (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-[#d6b878]/20 bg-[#2b2018]"
          >
            <Link
              href={`/product/${product.id}`}
              className="relative block aspect-square overflow-hidden bg-[#211812]"
            >
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#b8a99a]">
                  Nema slike
                </div>
              )}
            </Link>

            <div className="p-5">
              {product.brand && (
                <p className="text-xs uppercase tracking-widest text-[#d6b878]">
                  {product.brand}
                </p>
              )}

              <Link href={`/product/${product.id}`}>
                <h2 className="mt-2 text-lg font-semibold text-[#f4ebdd] hover:text-[#d6b878]">
                  {product.name}
                </h2>
              </Link>

              <p className="mt-3 text-xl font-semibold text-[#f4ebdd]">
                {Number(product.price).toLocaleString("sr-RS")} RSD
              </p>

              <p
                className={`mt-2 text-xs ${
                  product.stock > 0
                    ? "text-[#d6b878]"
                    : "text-[#c46a2d]"
                }`}
              >
                {product.stock > 0 ? "✓ Na stanju" : "Nije na stanju"}
              </p>

              <div className="mt-5">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: image ?? null,
                    stock: product.stock,
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                className="mt-4 w-full rounded-xl border border-[#d6b878]/20 px-4 py-3 text-sm text-[#c2b5a8] transition hover:border-red-400/40 hover:text-red-300"
              >
                ♡ Ukloni sa liste želja
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}