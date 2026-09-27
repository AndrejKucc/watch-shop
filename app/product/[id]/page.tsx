import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AddToCartButton } from "@/components/cart";
import ProductGallery from "@/components/product-gallery";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  condition: string | null;
  year: number | null;
  reference: string | null;
  images: string[] | null;

  case_diameter: string | null;
  case_thickness: string | null;
  case_material: string | null;
  case_shape: string | null;
  case_color: string | null;
  water_resistance: string | null;

  movement_type: string | null;
  movement_manufacturer: string | null;
  movement_caliber: string | null;

  dial_color: string | null;
  dial_indices: string | null;
  lume: string | null;
  date_function: string | null;
  chronograph: string | null;
  gmt: string | null;

  crystal_material: string | null;

  bracelet_material: string | null;
  bracelet_color: string | null;
  bracelet_width: string | null;
};

type Specification = {
  label: string;
  value: string | null;
};

type SpecificationGroup = {
  title: string;
  specifications: Specification[];
};

function getVisibleSpecifications(specifications: Specification[]) {
  return specifications.filter(
    (specification) =>
      specification.value !== null &&
      specification.value.trim() !== ""
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("public_products_v2")
    .select("name, brand, model, reference, description, images")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Proizvod nije pronađen | WATCH SHOP",
    };
  }

  const titleParts = [
    product.brand,
    product.model || product.name,
    product.reference,
  ].filter(Boolean);

  const title = `${titleParts.join(" ")} | WATCH SHOP`;

  const description =
    product.description ||
    `${titleParts.join(" ")} — premium sat dostupan u WATCH SHOP-u.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("public_products_v2")
    .select(
      `
        id,
        name,
        brand,
        model,
        description,
        price,
        stock,
        category,
        condition,
        year,
        reference,
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

  if (error || !data) {
    notFound();
  }

  const product = data as Product;

  const categoryLabel =
    product.category === "muski"
      ? "Muški"
      : product.category === "zenski"
        ? "Ženski"
        : "Unisex";

  const specificationGroups: SpecificationGroup[] = [
    {
      title: "Kućište",
      specifications: getVisibleSpecifications([
        { label: "Prečnik", value: product.case_diameter },
        { label: "Debljina", value: product.case_thickness },
        { label: "Materijal", value: product.case_material },
        { label: "Oblik", value: product.case_shape },
        { label: "Boja", value: product.case_color },
        { label: "Vodootpornost", value: product.water_resistance },
      ]),
    },
    {
      title: "Mehanizam",
      specifications: getVisibleSpecifications([
        { label: "Tip mehanizma", value: product.movement_type },
        { label: "Proizvođač", value: product.movement_manufacturer },
        { label: "Kalibar", value: product.movement_caliber },
      ]),
    },
    {
      title: "Cifer",
      specifications: getVisibleSpecifications([
        { label: "Boja", value: product.dial_color },
        { label: "Indeksi", value: product.dial_indices },
        { label: "Luminacija", value: product.lume },
        { label: "Datum", value: product.date_function },
        { label: "Hronograf", value: product.chronograph },
        { label: "GMT", value: product.gmt },
      ]),
    },
    {
      title: "Staklo",
      specifications: getVisibleSpecifications([
        { label: "Materijal", value: product.crystal_material },
      ]),
    },
    {
      title: "Narukvica / kaiš",
      specifications: getVisibleSpecifications([
        { label: "Materijal", value: product.bracelet_material },
        { label: "Boja", value: product.bracelet_color },
        { label: "Širina", value: product.bracelet_width },
      ]),
    },
  ];

  const visibleGroups = specificationGroups.filter(
    (group) => group.specifications.length > 0
  );

  const imageList =
    product.images && product.images.length > 0 ? product.images : [];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.18em] transition-all duration-150 active:scale-95 sm:text-2xl"
          >
            WATCH SHOP
          </Link>

          <Link
            href="/cart"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
          >
            Korpa
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2.5 text-sm text-neutral-400 transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
        >
          ← Nazad na proizvode
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <ProductGallery
              images={imageList}
              productName={product.name}
            />
          </div>

          <div className="lg:pt-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                {categoryLabel}
              </span>

              {product.condition && (
                <span className="rounded-full border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {product.condition}
                </span>
              )}
            </div>

            <p className="mt-7 text-sm font-medium uppercase tracking-[0.3em] text-neutral-500">
              {product.brand || "Watch Shop"}
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            {product.model && (
              <p className="mt-3 text-lg text-neutral-500">
                {product.model}
              </p>
            )}

            {product.reference && (
              <p className="mt-2 text-sm text-neutral-600">
                Ref. {product.reference}
              </p>
            )}

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-neutral-900 p-6">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Prodajna cena
                  </p>

                  <p className="mt-2 text-4xl font-bold tracking-tight">
                    {Number(product.price).toFixed(2)} €
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      product.stock > 0
                        ? "text-neutral-200"
                        : "text-red-400"
                    }`}
                  >
                    {product.stock > 0
                      ? "✓ Na stanju"
                      : "Nije na stanju"}
                  </p>

                  {product.stock > 0 && (
                    <p className="mt-1 text-xs text-neutral-500">
                      {product.stock}{" "}
                      {product.stock === 1 ? "komad" : "komada"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: imageList[0] ?? null,
                    stock: product.stock,
                  }}
                />
              </div>
            </div>

            {(product.year || product.reference) && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.year && (
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      Godina
                    </p>

                    <p className="mt-2 font-medium">
                      {product.year}
                    </p>
                  </div>
                )}

                {product.reference && (
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      Referenca
                    </p>

                    <p className="mt-2 font-medium">
                      {product.reference}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <section className="mt-16 border-t border-white/10 pt-12 sm:mt-20 sm:pt-16">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                O satu
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Opis
              </h2>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-neutral-400">
                {product.description}
              </p>
            </div>
          </section>
        )}

        {visibleGroups.length > 0 && (
          <section className="mt-16 border-t border-white/10 pt-12 sm:mt-20 sm:pt-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                Detalji sata
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Specifikacije
              </h2>
            </div>

            <div className="mt-8 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900">
              {visibleGroups.map((group, groupIndex) => (
                <div
                  key={group.title}
                  className={
                    groupIndex > 0
                      ? "border-t border-white/10"
                      : ""
                  }
                >
                  <div className="px-6 py-5 sm:px-8">
                    <h3 className="text-lg font-semibold">
                      {group.title}
                    </h3>

                    <div className="mt-4">
                      {group.specifications.map(
                        (specification, specificationIndex) => (
                          <div
                            key={specification.label}
                            className={`flex items-start justify-between gap-6 py-4 ${
                              specificationIndex > 0
                                ? "border-t border-white/10"
                                : ""
                            }`}
                          >
                            <span className="text-sm text-neutral-500">
                              {specification.label}
                            </span>

                            <span className="max-w-[60%] text-right text-sm font-medium text-neutral-200">
                              {specification.value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      <footer className="mt-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center text-sm text-neutral-500 sm:px-6">
          WATCH SHOP — Premium satovi
        </div>
      </footer>
    </main>
  );
}