"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
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

type FeaturedBadge =
  | ""
  | "recommendation"
  | "best_buy"
  | "new_model"
  | "great_price"
  | "premium"
  | "bestseller";

const featuredBadgeOptions: {
  value: FeaturedBadge;
  label: string;
  preview: string;
  description: string;
}[] = [
  {
    value: "",
    label: "Bez trakice",
    preview: "",
    description: "Sat neće imati posebnu trakicu.",
  },
  {
    value: "recommendation",
    label: "Naša preporuka",
    preview: "⭐ NAŠA PREPORUKA",
    description: "Za sat koji posebno preporučuješ kupcima.",
  },
  {
    value: "best_buy",
    label: "Best Buy",
    preview: "🔥 BEST BUY",
    description: "Za odličan odnos cene i kvaliteta.",
  },
  {
    value: "new_model",
    label: "Novi model",
    preview: "✨ NOVI MODEL",
    description: "Za nov model u ponudi.",
  },
  {
    value: "great_price",
    label: "Odlična cena",
    preview: "💰 ODLIČNA CENA",
    description: "Za sat sa posebno privlačnom cenom.",
  },
  {
    value: "premium",
    label: "Premium izbor",
    preview: "💎 PREMIUM IZBOR",
    description: "Za sat koji želiš da izdvojiš kao premium izbor.",
  },
  {
    value: "bestseller",
    label: "Bestseller",
    preview: "🏆 BESTSELLER",
    description: "Za provereno najprodavaniji sat.",
  },
];

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
    fields: [{ key: "crystal_material", label: "Materijal" }],
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
        { key: "bracelet_material", label: "Materijal" },
        { key: "bracelet_color", label: "Boja" },
        { key: "bracelet_width", label: "Širina" },
      ],
    },
  ],
  necklace: [
    {
      title: "Detalji ogrlice",
      fields: [
        { key: "bracelet_material", label: "Materijal" },
        { key: "bracelet_color", label: "Boja" },
        { key: "bracelet_width", label: "Širina / dužina" },
      ],
    },
  ],
  wallet: [
    {
      title: "Detalji novčanika",
      fields: [
        { key: "bracelet_material", label: "Materijal" },
        { key: "bracelet_color", label: "Boja" },
        { key: "bracelet_width", label: "Dimenzije" },
      ],
    },
  ],
  gift_box: [
    {
      title: "Detalji poklon kutije",
      fields: [
        { key: "bracelet_material", label: "Materijal" },
        { key: "bracelet_color", label: "Boja" },
        { key: "bracelet_width", label: "Dimenzije" },
      ],
    },
  ],
  gift_set: [
    {
      title: "Detalji poklon seta",
      fields: [
        { key: "bracelet_material", label: "Materijal / sadržaj" },
        { key: "bracelet_color", label: "Boja" },
        { key: "bracelet_width", label: "Dimenzije / veličina" },
      ],
    },
  ],
};

const allSpecificationFields = Array.from(
  new Map(
    [
      ...watchSpecificationGroups.flatMap((group) => group.fields),
      ...Object.values(accessorySpecificationGroups).flatMap((groups) =>
        groups.flatMap((group) => group.fields)
      ),
    ].map((field) => [field.key, field])
  ).values()
);

type Product = {
  id: string;
  name: string;
  product_type: ProductType;
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
  is_featured: boolean;
  featured_badge: FeaturedBadge | null;
  [key: string]: unknown;
};

const productTypeLabels: Record<ProductType, string> = {
  watch: "Sat",
  bracelet: "Narukvica",
  necklace: "Ogrlica",
  wallet: "Novčanik",
  gift_box: "Poklon kutija",
  gift_set: "Poklon set",
};

function getProductTypeLabel(type: ProductType) {
  return productTypeLabels[type] ?? "Proizvod";
}

function getSpecificationGroups(productType: ProductType) {
  if (productType === "watch") {
    return watchSpecificationGroups;
  }

  return accessorySpecificationGroups[productType];
}

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);

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
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredBadge, setFeaturedBadge] =
    useState<FeaturedBadge>("");

  const [specifications, setSpecifications] =
    useState<Record<string, string>>({});

  const [visibleSpecifications, setVisibleSpecifications] =
    useState<Record<string, boolean>>({});

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
        .select(`
          id,
          name,
          product_type,
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
          is_featured,
          featured_badge,
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
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setMessage("Greška: " + error.message);
        setLoading(false);
        return;
      }

      const loadedProduct = data as Product;

      setProduct(loadedProduct);

      const loadedProductType: ProductType =
        loadedProduct.product_type ?? "watch";

      setProductType(loadedProductType);
      setName(loadedProduct.name || "");
      setBrand(loadedProduct.brand || "");
      setModel(loadedProduct.model || "");
      setReference(loadedProduct.reference || "");
      setYear(
        loadedProduct.year ? String(loadedProduct.year) : ""
      );
      setCategory(loadedProduct.category || "unisex");
      setPrice(String(loadedProduct.price ?? ""));
      setPurchasePrice(
        loadedProduct.purchase_price !== null &&
          loadedProduct.purchase_price !== undefined
          ? String(loadedProduct.purchase_price)
          : ""
      );
      setStock(String(loadedProduct.stock ?? ""));
      setDescription(loadedProduct.description || "");
      setIsFeatured(loadedProduct.is_featured ?? false);

      const savedBadge = featuredBadgeOptions.some(
        (option) => option.value === loadedProduct.featured_badge
      )
        ? loadedProduct.featured_badge ?? ""
        : "";

      setFeaturedBadge(savedBadge);

      const loadedSpecifications: Record<string, string> = {};
      const loadedVisibility: Record<string, boolean> = {};

      for (const field of allSpecificationFields) {
        const value = (data as Record<string, unknown>)[field.key];

        loadedSpecifications[field.key] =
          value !== null && value !== undefined ? String(value) : "";

        loadedVisibility[field.key] =
          value !== null &&
          value !== undefined &&
          String(value).trim() !== "";
      }

      setSpecifications(loadedSpecifications);
      setVisibleSpecifications(loadedVisibility);

      setExistingImages(
        Array.isArray(loadedProduct.images) ? loadedProduct.images : []
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
        purchasePrice.trim() === "" ? null : Number(purchasePrice);

      const parsedStock = Number(stock);

      const parsedYear =
        year.trim() === "" ? null : Number(year);

      if (!name.trim()) {
        throw new Error(
          `Naziv ${getProductTypeLabel(productType).toLowerCase()} je obavezan.`
        );
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

        const fileName = `${crypto.randomUUID()}.${fileExtension}`;
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

      const finalImages = [...existingImages, ...newImageUrls];

      const specificationData: Record<string, string | null> = {};

      for (const field of allSpecificationFields) {
        const value = specifications[field.key]?.trim() || "";

        specificationData[field.key] =
          value !== "" && visibleSpecifications[field.key]
            ? value
            : null;
      }

      const finalIsFeatured = productType === "watch" && isFeatured;
      const finalFeaturedBadge: FeaturedBadge =
        finalIsFeatured ? featuredBadge : "";

      const { error: updateError } = await supabase
        .from("products")
        .update({
          product_type: productType,
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
          is_featured: finalIsFeatured,
          featured_badge: finalFeaturedBadge || null,
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
              product_type: productType,
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
              is_featured: finalIsFeatured,
              featured_badge: finalFeaturedBadge || null,
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
      <main className="min-h-screen bg-[#211812] px-6 py-12 text-[#f4ebdd]">
        <div className="mx-auto max-w-5xl">
          <p className="text-[#b8a99a]">Učitavanje proizvoda...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#211812] px-6 py-12 text-[#f4ebdd]">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-300">
            {message || "Proizvod nije pronađen."}
          </p>

          <Link
            href="/admin/products"
            className="mt-6 inline-block rounded-xl border border-[#d6b878]/25 bg-[#30231b] px-5 py-3 text-sm text-[#ead4a0] transition hover:border-[#d6b878]/60 hover:bg-[#4b3621]"
          >
            Nazad na proizvode
          </Link>
        </div>
      </main>
    );
  }

  const currentSpecificationGroups = getSpecificationGroups(productType);

  const selectedBadge = featuredBadgeOptions.find(
    (option) => option.value === featuredBadge
  );

  return (
    <main className="min-h-screen bg-[#211812] px-6 py-10 text-[#f4ebdd]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#b8a99a]">Admin panel</p>
            <h1 className="mt-1 text-3xl font-bold text-[#f4ebdd]">
              Izmeni proizvod
            </h1>
            <p className="mt-2 text-[#c2b5a8]">
              {getProductTypeLabel(productType)}
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-xl border border-[#d6b878]/30 bg-[#30231b] px-5 py-3 text-sm font-semibold text-[#ead4a0] transition-all duration-150 hover:border-[#d6b878]/60 hover:bg-[#4b3621] active:scale-95"
          >
            Nazad na proizvode
          </Link>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <section className="rounded-3xl border border-[#d6b878]/20 bg-[#30231b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-8">
            <h2 className="text-xl font-semibold text-[#ead4a0]">
              Vrsta proizvoda
            </h2>

            <div className="mt-6">
              <label className="text-sm text-[#c2b5a8]">
                Tip proizvoda
              </label>

              <select
                value={productType}
                onChange={(event) =>
                  setProductType(event.target.value as ProductType)
                }
                className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
              >
                <option value="watch">Sat</option>
                <option value="bracelet">Narukvica</option>
                <option value="necklace">Ogrlica</option>
                <option value="wallet">Novčanik</option>
                <option value="gift_box">Poklon kutija</option>
                <option value="gift_set">Poklon set</option>
              </select>
            </div>
          </section>

          {productType === "watch" && (
            <section className="rounded-3xl border border-[#d6b878]/35 bg-gradient-to-br from-[#4b3621]/60 via-[#30231b] to-[#211812] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d6b878]/30 bg-[#d6b878]/10 text-xl">
                  ⭐
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#ead4a0]">
                    Istaknuti satovi
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#c2b5a8]">
                    Uključi ovu opciju da se sat prikaže u sekciji
                    „Izdvojeni satovi“ na početnoj strani.
                  </p>

                  <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-[#d6b878]/20 bg-[#211812] p-4 transition hover:border-[#d6b878]/50 hover:bg-[#30231b]">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(event) =>
                        setIsFeatured(event.target.checked)
                      }
                      className="h-5 w-5 accent-[#d6b878]"
                    />

                    <span className="font-medium text-[#f4ebdd]">
                      Prikaži u istaknutim satovima na početnoj strani
                    </span>
                  </label>

                  <div className="mt-6">
                    <label className="text-sm font-medium text-[#ead4a0]">
                      Trakica na slici sata
                    </label>

                    <p className="mt-2 text-sm leading-6 text-[#c2b5a8]">
                      Izaberi oznaku koja objašnjava zašto si izdvojio ovaj sat.
                      Ako izabereš „Bez trakice“, sat će biti istaknut bez oznake.
                    </p>

                    <select
                      value={featuredBadge}
                      onChange={(event) =>
                        setFeaturedBadge(event.target.value as FeaturedBadge)
                      }
                      disabled={!isFeatured}
                      className="mt-3 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {featuredBadgeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {selectedBadge && selectedBadge.preview && isFeatured && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs uppercase tracking-wider text-[#b8a99a]">
                          Pregled trakice
                        </p>

                        <span className="inline-flex items-center rounded-md border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-3 py-2 text-xs font-bold tracking-wide text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                          {selectedBadge.preview}
                        </span>

                        <p className="mt-2 text-xs text-[#c2b5a8]">
                          {selectedBadge.description}
                        </p>
                      </div>
                    )}

                    {!isFeatured && (
                      <p className="mt-3 text-xs text-[#8f8071]">
                        Prvo uključi prikaz u istaknutim satovima da bi birao
                        trakicu.
                      </p>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-[#8f8071]">
                    Izmene se primenjuju tek kada klikneš „Sačuvaj izmene“.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-[#d6b878]/20 bg-[#30231b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-8">
            <h2 className="text-xl font-semibold text-[#ead4a0]">
              Osnovno
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-[#c2b5a8]">
                  Naziv proizvoda *
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>

              <div>
                <label className="text-sm text-[#c2b5a8]">Brend</label>
                <input
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>

              <div>
                <label className="text-sm text-[#c2b5a8]">Model</label>
                <input
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>

              <div>
                <label className="text-sm text-[#c2b5a8]">
                  Referenca
                </label>
                <input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>

              <div>
                <label className="text-sm text-[#c2b5a8]">Godina</label>
                <input
                  type="number"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  placeholder="npr. 2024"
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>

              <div>
                <label className="text-sm text-[#c2b5a8]">
                  Kategorija
                </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                >
                  <option value="muski">Muški</option>
                  <option value="zenski">Ženski</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#d6b878]/20 bg-[#30231b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-8">
            <h2 className="text-xl font-semibold text-[#ead4a0]">
              Prodaja
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              <div>
                <label className="text-sm text-[#c2b5a8]">
                  Prodajna cena (RSD) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>

              <div>
                <label className="text-sm text-[#c2b5a8]">
                  Nabavna cena (RSD)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={purchasePrice}
                  onChange={(event) => setPurchasePrice(event.target.value)}
                  placeholder="Samo za admin"
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>

              <div>
                <label className="text-sm text-[#c2b5a8]">
                  Količina na stanju *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm text-[#c2b5a8]">Opis</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
              />
            </div>
          </section>

          {currentSpecificationGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-3xl border border-[#d6b878]/20 bg-[#30231b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-8"
            >
              <h2 className="text-xl font-semibold text-[#ead4a0]">
                {group.title}
              </h2>

              <div className="mt-6 space-y-4">
                {group.fields.map((field) => {
                  const value = specifications[field.key] ?? "";
                  const visible =
                    visibleSpecifications[field.key] ?? false;

                  return (
                    <div
                      key={field.key}
                      className="rounded-2xl border border-[#d6b878]/15 bg-[#211812] p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                        <div>
                          <label className="text-sm text-[#c2b5a8]">
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
                            className="mt-2 w-full rounded-xl border border-[#d6b878]/20 bg-[#30231b] px-4 py-3 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                          />
                        </div>

                        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[#d6b878]/20 px-4 py-3 transition hover:border-[#d6b878]/40 hover:bg-[#30231b]">
                          <input
                            type="checkbox"
                            checked={visible}
                            onChange={() =>
                              toggleSpecificationVisibility(field.key)
                            }
                            className="h-4 w-4 accent-[#d6b878]"
                          />
                          <span className="text-sm text-[#f4ebdd]">
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

          <section className="rounded-3xl border border-[#d6b878]/20 bg-[#30231b] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-8">
            <h2 className="text-xl font-semibold text-[#ead4a0]">
              Slike proizvoda
            </h2>

            <p className="mt-2 text-sm text-[#b8a99a]">
              Postojeće slike možeš ukloniti, a nove dodati ispod.
            </p>

            {existingImages.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-[#ead4a0]">
                  Postojeće slike
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="overflow-hidden rounded-2xl border border-[#d6b878]/20 bg-[#211812]"
                    >
                      <div className="aspect-square overflow-hidden bg-[#4b3621]">
                        <img
                          src={image}
                          alt={`Slika proizvoda ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="w-full border-t border-[#d6b878]/15 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                      >
                        Ukloni sliku
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <label className="text-sm text-[#c2b5a8]">
                Dodaj nove slike
              </label>
              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-2 block w-full rounded-xl border border-[#d6b878]/20 bg-[#211812] px-4 py-3 text-sm text-[#f4ebdd] file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-b file:from-[#ead4a0] file:via-[#d6b878] file:to-[#bd9650] file:px-4 file:py-2 file:font-semibold file:text-[#211812] hover:file:brightness-105"
              />
            </div>

            {imageFiles.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-[#ead4a0]">
                  Nove slike: {imageFiles.length}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {imageFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="overflow-hidden rounded-2xl border border-[#d6b878]/20 bg-[#211812]"
                    >
                      <div className="aspect-square overflow-hidden bg-[#4b3621]">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nova slika ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="truncate px-3 py-2 text-xs text-[#b8a99a]">
                        {index + 1}. {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {errorMessage && (
            <div className="rounded-2xl border border-red-400/25 bg-red-950/30 p-4 text-sm text-red-200">
              {errorMessage}
            </div>
          )}

          {message && (
            <div className="rounded-2xl border border-[#d6b878]/30 bg-[#d6b878]/10 p-4 text-sm text-[#ead4a0]">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-6 py-4 font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-150 hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Čuvanje izmena..." : "Sačuvaj izmene"}
          </button>
        </form>
      </div>
    </main>
  );
}