"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase";

type ProductType =
  | "watch"
  | "bracelet"
  | "necklace"
  | "wallet"
  | "gift_box"
  | "gift_set";

type SpecificationField = {
  key: string;
  label: string;
};

const watchSpecificationGroups: {
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

const accessorySpecificationGroups: Record<
  Exclude<ProductType, "watch">,
  {
    title: string;
    fields: SpecificationField[];
  }[]
> = {
  bracelet: [
    {
      title: "Detalji narukvice",
      fields: [
        { key: "accessory_material", label: "Materijal" },
        { key: "accessory_color", label: "Boja" },
        { key: "accessory_size", label: "Veličina / dužina" },
      ],
    },
  ],

  necklace: [
    {
      title: "Detalji ogrlice",
      fields: [
        { key: "accessory_material", label: "Materijal" },
        { key: "accessory_color", label: "Boja" },
        { key: "accessory_size", label: "Dužina" },
      ],
    },
  ],

  wallet: [
    {
      title: "Detalji novčanika",
      fields: [
        { key: "accessory_material", label: "Materijal" },
        { key: "accessory_color", label: "Boja" },
        { key: "accessory_dimensions", label: "Dimenzije" },
      ],
    },
  ],

  gift_box: [
    {
      title: "Detalji poklon kutije",
      fields: [
        { key: "gift_for", label: "Za koga" },
        { key: "accessory_size", label: "Veličina" },
        { key: "accessory_color", label: "Boja" },
      ],
    },
  ],

  gift_set: [
    {
      title: "Detalji poklon seta",
      fields: [
        { key: "gift_for", label: "Za koga" },
        { key: "gift_contents", label: "Sadržaj seta" },
      ],
    },
  ],
};

const allWatchSpecificationFields =
  watchSpecificationGroups.flatMap((group) => group.fields);

const allAccessorySpecificationFields = Object.values(
  accessorySpecificationGroups
)
  .flat()
  .flatMap((group) => group.fields);

const allSpecificationFields = [
  ...allWatchSpecificationFields,
  ...allAccessorySpecificationFields,
];

const productTypeLabels: Record<ProductType, string> = {
  watch: "Sat",
  bracelet: "Narukvica",
  necklace: "Ogrlica",
  wallet: "Novčanik",
  gift_box: "Poklon kutija",
  gift_set: "Poklon set",
};

function getNameLabel(productType: ProductType) {
  if (productType === "watch") {
    return "Naziv sata";
  }

  if (productType === "bracelet") {
    return "Naziv narukvice";
  }

  if (productType === "necklace") {
    return "Naziv ogrlice";
  }

  if (productType === "wallet") {
    return "Naziv novčanika";
  }

  if (productType === "gift_box") {
    return "Naziv poklon kutije";
  }

  return "Naziv poklon seta";
}

function getNamePlaceholder(productType: ProductType) {
  if (productType === "watch") {
    return "npr. Submariner Date";
  }

  if (productType === "bracelet") {
    return "npr. Kožna narukvica";
  }

  if (productType === "necklace") {
    return "npr. Srebrna ogrlica";
  }

  if (productType === "wallet") {
    return "npr. Kožni novčanik";
  }

  if (productType === "gift_box") {
    return "npr. Premium poklon kutija";
  }

  return "npr. Premium poklon set";
}

export default function AddProductPage() {
  const supabase = createClient();

  const [productType, setProductType] =
    useState<ProductType>("watch");

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [reference, setReference] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("unisex");

  const [price, setPrice] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");

  const [specifications, setSpecifications] = useState<
    Record<string, string>
  >({});

  const [visibleSpecifications, setVisibleSpecifications] =
    useState<Record<string, boolean>>({});

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const activeSpecificationGroups =
    productType === "watch"
      ? watchSpecificationGroups
      : accessorySpecificationGroups[productType];

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

  function handleProductTypeChange(
    nextProductType: ProductType
  ) {
    setProductType(nextProductType);

    setSpecifications({});
    setVisibleSpecifications({});

    if (nextProductType === "watch") {
      setBrand("");
      setModel("");
      setReference("");
      setYear("");
    } else {
      setReference("");
      setYear("");
    }

    setMessage("");
    setErrorMessage("");
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    setImageFiles(files);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (imageFiles.length === 0) {
        throw new Error(
          `Izaberi bar jednu sliku ${productTypeLabels[
            productType
          ].toLowerCase()}.`
        );
      }

      const parsedPrice = Number(price);

      const parsedPurchasePrice =
        purchasePrice.trim() === ""
          ? null
          : Number(purchasePrice);

      const parsedStock = Number(stock);

      const parsedYear =
        year.trim() === "" ? null : Number(year);

      if (!name.trim()) {
        throw new Error(
          `${getNameLabel(productType)} je obavezan.`
        );
      }

      if (
        !Number.isFinite(parsedPrice) ||
        parsedPrice <= 0
      ) {
        throw new Error("Cena mora biti veća od 0.");
      }

      if (
        parsedPurchasePrice !== null &&
        (!Number.isFinite(parsedPurchasePrice) ||
          parsedPurchasePrice < 0)
      ) {
        throw new Error("Nabavna cena nije ispravna.");
      }

      if (
        !Number.isInteger(parsedStock) ||
        parsedStock < 0
      ) {
        throw new Error(
          "Količina na lageru nije ispravna."
        );
      }

      if (
        parsedYear !== null &&
        (!Number.isInteger(parsedYear) ||
          parsedYear < 1800 ||
          parsedYear > new Date().getFullYear())
      ) {
        throw new Error("Godina nije ispravna.");
      }

      const imageUrls: string[] = [];

      for (const imageFile of imageFiles) {
        const fileExtension =
          imageFile.name.split(".").pop()?.toLowerCase() ||
          "jpg";

        const fileName =
          `${crypto.randomUUID()}.${fileExtension}`;

        const filePath = `products/${fileName}`;

        const { error: uploadError } =
          await supabase.storage
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

        imageUrls.push(publicUrl);
      }

      const specificationData: Record<
        string,
        string | null
      > = {};

      for (const field of allSpecificationFields) {
        const value =
          specifications[field.key]?.trim() || "";

        specificationData[field.key] =
          value !== "" &&
          visibleSpecifications[field.key]
            ? value
            : null;
      }

      const productData = {
        product_type: productType,
        name: name.trim(),
        brand: brand.trim() || null,
        model: model.trim() || null,
        reference:
          productType === "watch"
            ? reference.trim() || null
            : null,
        year:
          productType === "watch"
            ? parsedYear
            : null,
        category,
        description: description.trim() || null,
        price: parsedPrice,
        purchase_price: parsedPurchasePrice,
        stock: parsedStock,
        images: imageUrls,
        ...specificationData,
      };

      const { error: insertError } =
        await supabase
          .from("products")
          .insert(productData);

      if (insertError) {
        throw new Error(insertError.message);
      }

      setProductType("watch");
      setName("");
      setBrand("");
      setModel("");
      setReference("");
      setYear("");
      setCategory("unisex");
      setPrice("");
      setPurchasePrice("");
      setStock("1");
      setDescription("");
      setSpecifications({});
      setVisibleSpecifications({});
      setImageFiles([]);

      const fileInput = document.getElementById(
        "product-images"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage(
        `${productTypeLabels[productType]} je uspešno dodat sa ${
          imageUrls.length
        } ${
          imageUrls.length === 1
            ? "slikom"
            : "slike"
        }.`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Došlo je do greške pri dodavanju proizvoda."
      );
    } finally {
      setLoading(false);
    }
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
              Dodaj novi proizvod
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
          >
            Nazad na proizvode
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Tip proizvoda
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Izaberi šta dodaješ u prodavnicu.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                Object.entries(productTypeLabels) as [
                  ProductType,
                  string
                ][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    handleProductTypeChange(value)
                  }
                  className={`rounded-2xl border px-5 py-4 text-left font-semibold transition ${
                    productType === value
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-neutral-950 text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-neutral-900 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">
              Osnovno
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-400">
                  {getNameLabel(productType)} *
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder={getNamePlaceholder(productType)}
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
                  placeholder="npr. Rolex"
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
                  placeholder="npr. Submariner"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>

              {productType === "watch" && (
                <>
                  <div>
                    <label className="text-sm text-neutral-400">
                      Referenca
                    </label>

                    <input
                      value={reference}
                      onChange={(event) =>
                        setReference(event.target.value)
                      }
                      placeholder="npr. 126610LN"
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
                </>
              )}

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
                  placeholder="0"
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
                  Količina na lageru *
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) =>
                    setStock(event.target.value)
                  }
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
                placeholder={`Napiši opis ${
                  productTypeLabels[
                    productType
                  ].toLowerCase()
                }...`}
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 outline-none transition focus:border-white/30"
              />
            </div>
          </section>

          {activeSpecificationGroups.map((group) => (
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
                    visibleSpecifications[
                      field.key
                    ] ?? false;

                  const isGiftFor =
                    field.key === "gift_for";

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

                          {isGiftFor ? (
                            <select
                              value={value}
                              onChange={(event) =>
                                updateSpecification(
                                  field.key,
                                  event.target.value
                                )
                              }
                              className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 outline-none transition focus:border-white/30"
                            >
                              <option value="">
                                Izaberi
                              </option>

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
                          ) : (
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
                          )}
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
              Slike{" "}
              {productTypeLabels[
                productType
              ].toLowerCase()}
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Izaberi više slika odjednom. Sve slike će
              biti sačuvane u galeriji proizvoda.
            </p>

            <input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-5 block w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm"
            />

            {imageFiles.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-neutral-300">
                  Izabrano slika: {imageFiles.length}
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
                          alt={`Izabrana slika ${index + 1}`}
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
            disabled={loading}
            className="w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black transition-all duration-150 hover:bg-neutral-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Dodavanje proizvoda..."
              : "Dodaj proizvod"}
          </button>
        </form>
      </div>
    </main>
  );
}