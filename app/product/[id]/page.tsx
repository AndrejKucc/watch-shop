import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AddToCartButton } from "@/components/cart";
import ProductReviews from "@/components/product-reviews";
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
  product_type: string;
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
  accessory_material: string | null;
  accessory_color: string | null;
  accessory_size: string | null;
  accessory_dimensions: string | null;
  gift_for: string | null;
  gift_contents: string | null;
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

const productTypeLabels: Record<string, string> = {
  watch: "Sat",
  bracelet: "Narukvica",
  necklace: "Ogrlica",
  wallet: "Novčanik",
  gift_box: "Poklon kutija",
  gift_set: "Poklon set",
};

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
    `${titleParts.join(" ")} — dostupan u WATCH SHOP-u.`;

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
        product_type,
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
        bracelet_width,
        accessory_material,
        accessory_color,
        accessory_size,
        accessory_dimensions,
        gift_for,
        gift_contents
      `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;
  const isWatch = product.product_type === "watch";

  const categoryLabel =
    product.category === "muski"
      ? "Muški"
      : product.category === "zenski"
        ? "Ženski"
        : "Unisex";

  const productTypeLabel =
    productTypeLabels[product.product_type] || "Proizvod";

  const watchSpecificationGroups: SpecificationGroup[] = [
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

  const accessorySpecificationGroups: SpecificationGroup[] = [];

  if (
    ["bracelet", "necklace", "wallet"].includes(product.product_type)
  ) {
    accessorySpecificationGroups.push({
      title: "Detalji proizvoda",
      specifications: getVisibleSpecifications([
        { label: "Materijal", value: product.accessory_material },
        { label: "Boja", value: product.accessory_color },
        {
          label: product.product_type === "necklace" ? "Dužina" : "Veličina",
          value: product.accessory_size,
        },
        {
          label: "Dimenzije",
          value: product.accessory_dimensions,
        },
      ]),
    });
  }

  if (product.product_type === "gift_box") {
    accessorySpecificationGroups.push({
      title: "Detalji poklon kutije",
      specifications: getVisibleSpecifications([
        { label: "Za koga", value: product.gift_for },
        { label: "Veličina", value: product.accessory_size },
        { label: "Boja", value: product.accessory_color },
      ]),
    });
  }

  if (product.product_type === "gift_set") {
    accessorySpecificationGroups.push({
      title: "Detalji poklon seta",
      specifications: getVisibleSpecifications([
        { label: "Za koga", value: product.gift_for },
        { label: "Sadržaj seta", value: product.gift_contents },
      ]),
    });
  }

  const specificationGroups = isWatch
    ? watchSpecificationGroups
    : accessorySpecificationGroups;

  const visibleGroups = specificationGroups.filter(
    (group) => group.specifications.length > 0
  );

  const imageList =
    product.images && product.images.length > 0 ? product.images : [];

  return (
    <main className="min-h-screen bg-[#211812] text-[#f4ebdd]">
      <header className="sticky top-0 z-30 border-b border-[#d6b878]/20 bg-[#211812]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.18em] transition-transform duration-150 active:scale-95 sm:text-2xl"
          >
            WATCH SHOP
          </Link>

          <Link
            href="/cart"
            className="rounded-full border border-[#d6b878]/35 bg-gradient-to-b from-[#d6b878]/15 to-[#4b3621]/40 px-5 py-2.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-all duration-200 hover:border-[#ead4a0]/70 hover:from-[#d6b878]/25 hover:to-[#4b3621]/60 active:scale-95"
          >
            Korpa
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-10">
        <Link
          href={isWatch ? "/satovi" : "/"}
          className="inline-flex items-center gap-2 rounded-full border border-[#d6b878]/25 bg-gradient-to-b from-[#d6b878]/10 to-[#4b3621]/20 px-4 py-2.5 text-sm text-[#b8a99a] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-all duration-200 hover:border-[#d6b878]/50 hover:from-[#d6b878]/20 hover:to-[#4b3621]/40 hover:text-[#f4ebdd] active:scale-95"
        >
          <span aria-hidden="true">←</span>
          Nazad na proizvode
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] lg:items-start lg:gap-16">
          <div className="min-w-0">
            <ProductGallery
              images={imageList}
              productName={product.name}
            />
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[#d6b878]/25 bg-[#d6b878]/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c2b5a8]">
                {productTypeLabel}
              </span>

              {isWatch && (
                <span className="rounded-full border border-[#d6b878]/25 bg-[#d6b878]/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#c2b5a8]">
                  {categoryLabel}
                </span>
              )}
            </div>

            <p className="mt-7 text-xs font-medium uppercase tracking-[0.35em] text-[#d6b878]">
              {product.brand || "WATCH SHOP"}
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              {product.name}
            </h1>

            {product.model && (
              <p className="mt-4 text-lg text-[#c2b5a8]">
                {product.model}
              </p>
            )}

            {isWatch && product.reference && (
              <p className="mt-2 text-sm text-[#8f8071]">
                Ref. {product.reference}
              </p>
            )}

            <div className="mt-9 border-y border-[#d6b878]/20 py-7">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#b8a99a]">
                    Prodajna cena
                  </p>

                  <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {Number(product.price).toLocaleString("sr-RS")} RSD
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p
                    className={`text-sm font-semibold ${
                      product.stock > 0
                        ? "text-[#d6b878]"
                        : "text-[#c46a2d]"
                    }`}
                  >
                    {product.stock > 0
                      ? "✓ Na stanju"
                      : "Nije na stanju"}
                  </p>

                  {product.stock > 0 && (
                    <p className="mt-1 text-xs text-[#b8a99a]">
                      {product.stock}{" "}
                      {product.stock === 1 ? "komad" : "komada"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-7">
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

            {isWatch && (product.year || product.reference) && (
              <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[#d6b878]/20 bg-[#d6b878]/10 sm:grid-cols-2">
                {product.year && (
                  <div className="bg-[#2b2018] p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#b8a99a]">
                      Godina
                    </p>

                    <p className="mt-2 font-medium text-[#f4ebdd]">
                      {product.year}
                    </p>
                  </div>
                )}

                {product.reference && (
                  <div className="bg-[#2b2018] p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#b8a99a]">
                      Referenca
                    </p>

                    <p className="mt-2 font-medium text-[#f4ebdd]">
                      {product.reference}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <section className="mt-16 border-t border-[#d6b878]/20 pt-12 sm:mt-24 sm:pt-16">
            <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#d6b878]">
                  {isWatch ? "O satu" : "O proizvodu"}
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Opis
                </h2>
              </div>

              <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-[#c2b5a8]">
                {product.description}
              </p>
            </div>
          </section>
        )}

        {visibleGroups.length > 0 && (
          <section className="mt-16 border-t border-[#d6b878]/20 pt-12 sm:mt-24 sm:pt-16">
            <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#d6b878]">
                  {isWatch ? "Detalji sata" : "Detalji proizvoda"}
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Specifikacije
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-7 text-[#b8a99a]">
                  {isWatch
                    ? "Tehnički podaci prikazani su prema informacijama dostupnim za konkretan model."
                    : "Prikazane su dostupne informacije o materijalu, dimenzijama i sadržaju proizvoda."}
                </p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#d6b878]/20 bg-gradient-to-br from-[#30231b]/90 to-[#211812]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {visibleGroups.map((group, groupIndex) => (
                  <div
                    key={group.title}
                    className={
                      groupIndex > 0 ? "border-t border-[#d6b878]/15" : ""
                    }
                  >
                    <div className="px-6 py-6 sm:px-8">
                      <h3 className="text-lg font-semibold text-[#f4ebdd]">
                        {group.title}
                      </h3>

                      <div className="mt-4">
                        {group.specifications.map(
                          (specification, specificationIndex) => (
                            <div
                              key={specification.label}
                              className={`grid grid-cols-[1fr_auto] items-start gap-6 py-4 ${
                                specificationIndex > 0
                                  ? "border-t border-[#d6b878]/10"
                                  : ""
                              }`}
                            >
                              <span className="text-sm text-[#b8a99a]">
                                {specification.label}
                              </span>

                              <span className="max-w-[55%] text-right text-sm font-medium text-[#f4ebdd]">
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
            </div>
          </section>
        )}

        <ProductReviews productId={product.id} />
      </section>

      <footer className="mt-20 border-t border-[#d6b878]/20 bg-[#211812]/70">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center text-sm text-[#b8a99a] sm:px-6">
          WATCH SHOP — Premium satovi i modni dodaci
        </div>
      </footer>
    </main>
  );
}