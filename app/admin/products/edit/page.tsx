"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  price: number;
  stock: number;
  category: string;
};

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("unisex");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");

      if (!id) {
        setMessage("Nije pronađen proizvod.");
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, brand, model, description, price, stock, category"
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setMessage("Greška: " + error.message);
        setLoading(false);
        return;
      }

      setProduct(data);

      setName(data.name);
      setBrand(data.brand || "");
      setModel(data.model || "");
      setDescription(data.description || "");
      setPrice(String(data.price));
      setStock(String(data.stock));
      setCategory(data.category || "unisex");

      setLoading(false);
    }

    loadProduct();
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) {
      return;
    }

    setSaving(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("products")
      .update({
        name: name,
        brand: brand,
        model: model,
        description: description,
        price: Number(price),
        stock: Number(stock),
        category: category,
      })
      .eq("id", product.id);

    if (error) {
      console.error(error);
      setMessage("Greška: " + error.message);
      setSaving(false);
      return;
    }

    setMessage("Izmene su uspešno sačuvane.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-neutral-400">
            Učitavanje proizvoda...
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-red-400">
            {message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => {
            window.location.href = "/admin/products";
          }}
          className="mb-8 rounded-xl border border-white/10 px-5 py-3 text-sm transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
        >
          Nazad na proizvode
        </button>

        <h1 className="text-4xl font-bold">
          Izmeni proizvod
        </h1>

        <p className="mt-2 text-neutral-400">
          Promeni podatke o satu.
        </p>

        <form
          onSubmit={handleSave}
          className="mt-10 space-y-6"
        >

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Naziv sata
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Brend
            </label>

            <input
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Model
            </label>

            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Kategorija
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            >
              <option value="muski">Muški</option>
              <option value="zenski">Ženski</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Cena (€)
            </label>

            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Količina
            </label>

            <input
              type="number"
              min="0"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-neutral-400">
              Opis
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black transition-all duration-150 hover:bg-neutral-200 active:scale-[0.99] disabled:opacity-50"
          >
            {saving ? "Čuvanje..." : "Sačuvaj izmene"}
          </button>

          {message && (
            <p className="text-sm text-neutral-300">
              {message}
            </p>
          )}

        </form>
      </div>
    </main>
  );
}