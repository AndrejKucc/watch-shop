"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  price: number;
  stock: number;
  category: string | null;
  images: string[] | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadProducts() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select("id, name, brand, model, price, stock, category, images")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Greška: " + error.message);
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function getCategoryLabel(category: string | null) {
    if (category === "muski") return "Muški";
    if (category === "zenski") return "Ženski";
    return "Unisex";
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => {
            window.location.href = "/admin";
          }}
          className="mb-8 rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
        >
          ← Nazad na admin
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              Administracija
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Proizvodi
            </h1>

            <p className="mt-2 text-neutral-400">
              Svi proizvodi u tvojoj prodavnici.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Ukupno
            </p>

            <p className="mt-1 text-2xl font-bold">
              {products.length}
            </p>
          </div>
        </div>

        {loading && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-neutral-900 p-8">
            <p className="text-neutral-400">
              Učitavanje proizvoda...
            </p>
          </div>
        )}

        {message && (
          <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <p className="text-red-400">
              {message}
            </p>
          </div>
        )}

        {!loading && !message && products.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-neutral-900 p-12 text-center">
            <p className="text-lg font-semibold">
              Trenutno nema proizvoda.
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Kada dodaš prvi sat, pojaviće se ovde.
            </p>
          </div>
        )}

        {!loading && !message && products.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative overflow-hidden bg-neutral-800">
                  <div className="aspect-[4/3]">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-white backdrop-blur">
                      {getCategoryLabel(product.category)}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur ${
                        product.stock > 0
                          ? "border-white/10 bg-black/60 text-white"
                          : "border-red-500/30 bg-red-500/20 text-red-300"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} ${
                            product.stock === 1 ? "komad" : "komada"
                          }`
                        : "Nema na stanju"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                    {product.brand || "Bez brenda"}
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    {product.name}
                  </h2>

                  {product.model && (
                    <p className="mt-1 text-sm text-neutral-500">
                      {product.model}
                    </p>
                  )}

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">
                        Prodajna cena
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        {Number(product.price).toFixed(2)} €
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">
                        Zaliha
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          product.stock > 0
                            ? "text-neutral-300"
                            : "text-red-400"
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      window.location.href = `/admin/products/edit?id=${product.id}`;
                    }}
                    className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-neutral-200 active:scale-[0.99]"
                  >
                    Izmeni proizvod
                  </button>

                  <button
                    onClick={async () => {
                      const potvrda = window.confirm(
                        "Da li stvarno želiš da obrišeš ovaj proizvod?"
                      );

                      if (!potvrda) {
                        return;
                      }

                      const supabase = createClient();

                      const { error } = await supabase
                        .from("products")
                        .delete()
                        .eq("id", product.id);

                      if (error) {
                        console.error(error);
                        setMessage("Greška: " + error.message);
                        return;
                      }

                      setProducts((trenutniProizvodi) =>
                        trenutniProizvodi.filter(
                          (stavka) => stavka.id !== product.id
                        )
                      );
                    }}
                    className="mt-3 w-full rounded-xl border border-red-500/30 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 active:scale-[0.99]"
                  >
                    Obriši proizvod
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}