"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type SpecificationField = {
  key: string;
  label: string;
};

const specificationGroups: {
  title: string;
  fields: SpecificationField[];
}[] = [
  {
    title: "Kućište",
    fields: [
      { key: "case_diameter", label: "Prečnik" },
      { key: "case_thickness", label: "Debljina" },
      { key: "case_material", label: "Materijal" },
      { key: "case_shape", label: "Oblik" },
      { key: "case_color", label: "Boja" },
      { key: "water_resistance", label: "Vodootpornost" },
    ],
  },
  {
    title: "Mehanizam",
    fields: [
      { key: "movement_type", label: "Tip mehanizma" },
      { key: "movement_manufacturer", label: "Proizvođač" },
      { key: "movement_caliber", label: "Kalibar" },
    ],
  },
  {
    title: "Cifer",
    fields: [
      { key: "dial_color", label: "Boja" },
      { key: "dial_indices", label: "Indeksi" },
      { key: "lume", label: "Luminacija" },
      { key: "date_function", label: "Datum" },
      { key: "chronograph", label: "Hronograf" },
      { key: "gmt", label: "GMT" },
    ],
  },
  {
    title: "Staklo",
    fields: [
      { key: "crystal_material", label: "Materijal" },
    ],
  },
  {
    title: "Narukvica / kaiš",
    fields: [
      { key: "bracelet_material", label: "Materijal" },
      { key: "bracelet_color", label: "Boja" },
      { key: "bracelet_width", label: "Širina" },
    ],
  },
];

const allSpecificationFields = specificationGroups.flatMap(
  (group) => group.fields
);

type Product = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  reference: string | null;
  year: number | null;
  description: string | null;
  price: number;
  purchase_price: number | null;
  stock: number;
  category: string;
  images: string[] | null;
  [key: string]: unknown;
};

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [reference, setReference] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("unisex");

  const [price, setPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [specifications, setSpecifications] = useState<
    Record<string, string>
  >({});

  const [visibleSpecifications, setVisibleSpecifications] = useState<
    Record<string, boolean>
  >({});

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
          `
            id,
            name,
            brand,
            model,
            reference,
            year,
            description,
            price,
            purchase_price,
            stock,
            category,
            images,
            case_diameter,
            case_thickness,
            case_material,
            case_shape,
            case_color,
            water_resistance,
            movement_type,
            movement_manufacturer,
            movement_caliber,
            dial_color,
            dial_indices,
            lume,
            date_function,
            chronograph,
            gmt,
            crystal_material,
            bracelet_material,
            bracelet_color,
            bracelet_width
          `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setMessage("Greška: " + error.message);
        setLoading(false);
        return;
      }

      setProduct(data as Product);

      setName(data.name || "");
      setBrand(data.brand || "");
      setModel(data.model || "");
      setReference(data.reference || "");
      setYear(data.year ? String(data.year) : "");
      setCategory(data.category || "unisex");

      setPrice(String(data.price ?? ""));
      setPurchasePrice(
        data.purchase_price !== null && data.purchase_price !== undefined
          ? String(data.purchase_price)
          : ""
      );
      setStock(String(data.stock ?? ""));
      setDescription(data.description || "");

      const loadedSpecifications: Record<string, string> = {};
      const loadedVisibility: Record<string, boolean> = {};

    for (const field of allSpecificationFields) {
  const value = (data as Record<string, unknown>)[field.key];

  loadedSpecifications[field.key] =
    value !== null && value !== undefined
      ? String(value)
      : "";

  loadedVisibility[field.key] =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";
}

      setSpecifications(loadedSpecifications);
      setVisibleSpecifications(loadedVisibility);

      setExistingImages(
        Array.isArray(data.images)
          ? data.images
          : []
      );

      setLoading(false);
    }

    loadProduct();
  }, []);

  function updateSpecification(key: string, value: string) {
    setSpecifications((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleSpecificationVisibility(key: string) {
    setVisibleSpecifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    setImageFiles(files);
  }

  function removeExistingImage(index: number) {
    setExistingImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) {
      return;
    }

    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const parsedPrice = Number(price);

      const parsedPurchasePrice =
        purchasePrice.trim() === ""
          ? null
          : Number(purchasePrice);

      const parsedStock = Number(stock);

      const parsedYear =
        year.trim() === ""
          ? null
          : Number(year);

      if (!name.trim()) {
        throw new Error("Naziv sata je obavezan.");
      }

      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        throw new Error("Cena mora biti veća od 0.");
      }

      if (
        parsedPurchasePrice !== null &&
        (!Number.isFinite(parsedPurchasePrice) ||
          parsedPurchasePrice < 0)
      ) {
        throw new Error("Nabavna cena nije ispravna.");
      }

      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        throw new Error("Količina na stanju nije ispravna.");
      }

      if (
        parsedYear !== null &&
        (!Number.isInteger(parsedYear) ||
          parsedYear < 1800 ||
          parsedYear > new Date().getFullYear())
      ) {
        throw new Error("Godina nije ispravna.");
      }

      const supabase = createClient();

      const newImageUrls: string[] = [];

      for (const imageFile of imageFiles) {
        const fileExtension =
          imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName =
          `${crypto.randomUUID()}.${fileExtension}`;

        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `Greška pri uploadu slike "${imageFile.name}": ${uploadError.message}`
          );
        }

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }

      const finalImages = [
        ...existingImages,
        ...newImageUrls,
      ];

      const specificationData: Record<string, string | null> = {};

      for (const field of allSpecificationFields) {
        const value =
          specifications[field.key]?.trim() || "";

        specificationData[field.key] =
          value !== "" &&
          visibleSpecifications[field.key]
            ? value
            : null;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          brand: brand.trim() || null,
          model: model.trim() || null,
          reference: reference.trim() || null,
          year: parsedYear,
          category,
          description: description.trim() || null,
          price: parsedPrice,
          purchase_price: parsedPurchasePrice,
          stock: parsedStock,
          images: finalImages,
          ...specificationData,
        })
        .eq("id", product.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setProduct((current) =>
        current
          ? {
              ...current,
              name: name.trim(),
              brand: brand.trim() || null,
              model: model.trim() || null,
              reference: reference.trim() || null,
              year: parsedYear,
              category,
              description: description.trim() || null,
              price: parsedPrice,
              purchase_price: parsedPurchasePrice,
              stock: parsedStock,
              images: finalImages,
              ...specificationData,
            }
          : current
      );

      setExistingImages(finalImages);
      setImageFiles([]);

      const fileInput = document.getElementById(
        "product-images"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage("Izmene su uspešno sačuvane.");
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Došlo je do greške pri čuvanju proizvoda."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
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
        <div className="mx-auto max-w-5xl">
          <p className="text-red-400">
            {message || "Proizvod nije pronađen."}
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-block rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
          >
            Nazad na proizvode
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">
              Admin panel
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Izmeni proizvod
            </h1>

            <p className="mt-2 text-neutral-400">
              Promeni podatke o satu.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
          >
            Nazad na proizvode
          </Link>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-8"
        >

          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Osnovno
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-400">
                  Naziv sata *
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">
                  Brend
                </label>

                <input
                  value={brand}
                  onChange={(event) =>
                    setBrand(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">
                  Model
                </label>

                <input
                  value={model}
                  onChange={(event) =>
                    setModel(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">
                  Referenca
                </label>

                <input
                  value={reference}
                  onChange={(event) =>
                    setReference(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">
                  Godina
                </label>

                <input
                  type="number"
                  value={year}
                  onChange={(event) =>
                    setYear(event.target.value)
                  }
                  placeholder="npr. 2024"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">
                  Kategorija
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                >
                  <option value="muski">
                    Muški
                  </option>

                  <option value="zenski">
                    Ženski
                  </option>

                  <option value="unisex">
                    Unisex
                  </option>
                </select>
              </div>

            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Prodaja
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">

              <div>
                <label className="text-sm text-neutral-400">
                  Prodajna cena (RSD) *
                </label>

                <input
                  type="number"
                  step="1"
                  min="0"
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">
                  Nabavna cena (RSD)
                </label>

                <input
                  type="number"
                  step="1"
                  min="0"
                  value={purchasePrice}
                  onChange={(event) =>
                    setPurchasePrice(event.target.value)
                  }
                  placeholder="Samo za admin"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">
                  Stanje na lageru *
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) =>
                    setStock(event.target.value)
                  }
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

            </div>

            <div className="mt-5">
              <label className="text-sm text-neutral-400">
                Opis
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
              />
            </div>
          </section>

          {specificationGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8"
            >
              <h2 className="text-xl font-semibold">
                {group.title}
              </h2>

              <div className="mt-6 space-y-4">
                {group.fields.map((field) => {
                  const value =
                    specifications[field.key] ?? "";

                  const visible =
                    visibleSpecifications[field.key] ?? false;

                  return (
                    <div
                      key={field.key}
                      className="rounded-2xl border border-white/10 bg-neutral-950 p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">

                        <div>
                          <label className="text-sm text-neutral-400">
                            {field.label}
                          </label>

                          <input
                            value={value}
                            onChange={(event) =>
                              updateSpecification(
                                field.key,
                                event.target.value
                              )
                            }
                            placeholder={`Unesi ${field.label.toLowerCase()}...`}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
                          />
                        </div>

                        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-white/10 px-4 py-3 transition hover:bg-white/5">
                          <input
                            type="checkbox"
                            checked={visible}
                            onChange={() =>
                              toggleSpecificationVisibility(
                                field.key
                              )
                            }
                            className="h-4 w-4 accent-white"
                          />

                          <span className="text-sm">
                            Prikaži kupcu
                          </span>
                        </label>

                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Slike sata
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Postojeće slike možeš ukloniti, a nove dodati
              ispod.
            </p>

            {existingImages.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-neutral-300">
                  Postojeće slike
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
                    >
                      <div className="aspect-square overflow-hidden bg-neutral-800">
                        <img
                          src={image}
                          alt={`Slika proizvoda ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeExistingImage(index)
                        }
                        className="w-full border-t border-white/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        Ukloni sliku
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="text-sm text-neutral-400">
                Dodaj nove slike
              </label>

              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-2 block w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm"
              />
            </div>

            {imageFiles.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-neutral-300">
                  Nove slike: {imageFiles.length}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {imageFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
                    >
                      <div className="aspect-square overflow-hidden bg-neutral-800">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nova slika ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="truncate px-3 py-2 text-xs text-neutral-500">
                        {index + 1}. {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {errorMessage && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          {message && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black transition-all duration-150 hover:bg-neutral-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Čuvanje izmena..."
              : "Sačuvaj izmene"}
          </button>

        </form>
      </div>
    </main>
  );
}