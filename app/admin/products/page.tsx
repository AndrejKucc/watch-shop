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
    <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#30231b] to-[#17110d] px-6 py-12 text-[#f4ebdd]">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => {
            window.location.href = "/admin";
          }}
          className="mb-8 rounded-xl border border-[#d6b878]/30 bg-[#30231b]/80 px-5 py-3 text-sm text-[#ead4a0] transition hover:border-[#d6b878]/60 hover:bg-[#4b3621] hover:text-white"
        >
          ← Nazad na admin
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6b878]">
              Administracija
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#f4ebdd]">
              Proizvodi
            </h1>

            <p className="mt-2 text-[#b8a99a]">
              Svi proizvodi u tvojoj prodavnici.
            </p>
          </div>

          <div className="rounded-2xl border border-[#d6b878]/30 bg-gradient-to-br from-[#30231b] to-[#211812] px-5 py-4 shadow-[inset_0_1px_0_rgba(234,212,160,0.05)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[#b8a99a]">
              Ukupno
            </p>

            <p className="mt-1 text-2xl font-bold text-[#ead4a0]">
              {products.length}
            </p>
          </div>
        </div>

        {loading && (
          <div className="mt-10 rounded-3xl border border-[#d6b878]/20 bg-[#30231b]/80 p-8">
            <p className="text-[#b8a99a]">
              Učitavanje proizvoda...
            </p>
          </div>
        )}

        {message && (
          <div className="mt-10 rounded-3xl border border-[#c46a2d]/40 bg-[#c46a2d]/10 p-8">
            <p className="text-[#f0a08a]">
              {message}
            </p>
          </div>
        )}

        {!loading && !message && products.length === 0 && (
          <div className="mt-10 rounded-3xl border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b] to-[#211812] p-12 text-center">
            <p className="text-lg font-semibold text-[#f4ebdd]">
              Trenutno nema proizvoda.
            </p>

            <p className="mt-2 text-sm text-[#b8a99a]">
              Kada dodaš prvi sat, pojaviće se ovde.
            </p>
          </div>
        )}

        {!loading && !message && products.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-[2rem] border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b] to-[#211812] shadow-[inset_0_1px_0_rgba(234,212,160,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d6b878]/55"
              >
                <div className="relative overflow-hidden bg-[#17110d]">
                  <div className="aspect-[4/3]">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-[#8f8071]">
                          Slika sata
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-[#d6b878]/35 bg-[#211812]/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#ead4a0] backdrop-blur">
                      {getCategoryLabel(product.category)}
                    </span>
                  </div>

                  <div className="absolute right-4 top-4">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold backdrop-blur ${
                        product.stock > 0
                          ? "border-[#d6b878]/35 bg-[#211812]/90 text-[#ead4a0]"
                          : "border-[#c46a2d]/50 bg-[#211812]/95 text-[#f0a08a]"
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
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#b8a99a]">
                    {product.brand || "Bez brenda"}
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#f4ebdd]">
                    {product.name}
                  </h2>

                  {product.model && (
                    <p className="mt-1 text-sm text-[#b8a99a]">
                      {product.model}
                    </p>
                  )}

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#d6b878]/20 pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#8f8071]">
                        Prodajna cena
                      </p>

                      <p className="mt-1 text-2xl font-bold text-[#ead4a0]">
                        {Number(product.price).toFixed(2)} RSD
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#8f8071]">
                        Zaliha
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          product.stock > 0
                            ? "text-[#d8cbbd]"
                            : "text-[#f0a08a]"
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
                    className="mt-6 w-full rounded-xl border border-[#ead4a0]/60 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-4 py-3 font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:brightness-110 active:scale-[0.99]"
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
                    className="mt-3 w-full rounded-xl border border-[#c46a2d]/40 px-4 py-3 text-sm text-[#e7a17b] transition hover:border-[#c46a2d]/70 hover:bg-[#c46a2d]/10 active:scale-[0.99]"
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