import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { AddToCartButton, CartButton } from "@/components/cart";
import { WishlistButton } from "@/components/wishlist";
import ProductReviews from "@/components/product-reviews";
import ProductGallery from "@/components/product-gallery";
import RestockNotificationButton from "@/components/restock-notification-button";
import SiteFooter from "@/components/site-footer";

const BASE_URL = "https://watchstore.rs";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  price: number;
  old_price: number | null;
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

const returnPathByProductType: Record<string, string> = {
  watch: "/satovi",
  bracelet: "/narukvice",
  necklace: "/ogrlice",
  wallet: "/novcanici",
  gift_box: "/pokloni",
  gift_set: "/pokloni",
};

function getCategoryLabel(product: Product) {
  if (product.product_type !== "watch") {
    return productTypeLabels[product.product_type] || "Proizvod";
  }

  if (product.category === "muski") return "Muški ručni sat";
  if (product.category === "zenski") return "Ženski ručni sat";

  return "Unisex ručni sat";
}

function getProductTitle(product: Product) {
  const parts = [
    product.brand,
    product.model || product.name,
    product.reference,
  ].filter(Boolean);

  const uniqueParts = [...new Set(parts)];

  return `${uniqueParts.join(" ")} – ${getCategoryLabel(product)}`;
}

function getProductDescription(product: Product) {
  const fallback = [
    getProductTitle(product),
    "Pogledajte cenu, fotografije i detaljne specifikacije.",
    "Dostupno u WATCH STORE online prodavnici.",
  ].join(" ");

  const description = product.description?.trim() || fallback;

  return description.length > 160
    ? `${description.slice(0, 157).trim()}...`
    : description;
}

function getAbsoluteImageUrl(image: string) {
  try {
    return new URL(image, BASE_URL).toString();
  } catch {
    return image;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("public_products_v2")
    .select(
      "id, name, brand, model, reference, description, images, category, product_type"
    )
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Proizvod nije pronađen",
      description: "Traženi proizvod nije pronađen u WATCH STORE prodavnici.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = getProductTitle(product as Product);
  const description = getProductDescription(product as Product);

  const image = product.images?.[0]
    ? getAbsoluteImageUrl(product.images[0])
    : `${BASE_URL}/images/hero-watch.png`;

  const canonicalUrl = `${BASE_URL}/product/${product.id}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "sr_RS",
      siteName: "WATCH STORE",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: image,
          alt: `${product.name} – WATCH STORE`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
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
        old_price,
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

  const hasDiscount =
    product.old_price !== null &&
    Number(product.old_price) > Number(product.price);

  const categoryLabel =
    product.category === "muski"
      ? "Muški"
      : product.category === "zenski"
        ? "Ženski"
        : "Unisex";

  const productTypeLabel =
    productTypeLabels[product.product_type] || "Proizvod";

  const returnPath =
    returnPathByProductType[product.product_type] || "/";

  const imageList =
    product.images && product.images.length > 0 ? product.images : [];

  const seoTitle = getProductTitle(product);
  const seoDescription = getProductDescription(product);

  const canonicalUrl = `${BASE_URL}/product/${product.id}`;

  // Strukturirani podaci za Google (Product Schema)
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: seoDescription,
    image: imageList.map(getAbsoluteImageUrl),
    sku: product.reference || product.id,
    ...(product.brand
      ? {
          brand: {
            "@type": "Brand",
            name: product.brand,
          },
        }
      : {}),
    ...(product.model ? { model: product.model } : {}),
    category: getCategoryLabel(product),
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "RSD",
      price: Number(product.price).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "WATCH STORE",
        url: BASE_URL,
      },
    },
  };

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

  return (
    <main className="min-h-screen bg-[#F8F4E7] text-[#1F2A3C]">
      <style>{`
        .ws-stage {
          position: relative;
          background:
            radial-gradient(ellipse 60% 55% at 74% 18%, rgba(184, 149, 90, 0.30), transparent 70%),
            radial-gradient(ellipse 50% 40% at 6% 96%, rgba(184, 149, 90, 0.14), transparent 70%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0) 38%, rgba(0, 0, 0, 0.30)),
            #1F2A3C;
          border: 1px solid rgba(184, 149, 90, 0.28);
          box-shadow:
            0 40px 100px rgba(31, 42, 60, 0.30),
            inset 0 1px 0 rgba(248, 244, 231, 0.08);
        }

        .ws-hairline {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184, 149, 90, 0.65), transparent);
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="sticky top-0 z-30 border-b border-[#B8955A]/30 bg-[#F8F4E7]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.18em] transition-transform duration-150 active:scale-95 sm:text-2xl"
          >
            WATCH STORE
          </Link>

          <CartButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-6 sm:py-10">
        <Link
          href={returnPath}
          className="inline-flex items-center gap-2 rounded-full border border-[#B8955A]/40 bg-gradient-to-b from-[#B8955A]/10 to-[#B8955A]/5 px-4 py-2.5 text-sm text-[#1F2A3C]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition-all duration-200 hover:border-[#B8955A]/75 hover:from-[#B8955A]/20 hover:to-[#B8955A]/10 hover:text-[#1F2A3C] active:scale-95"
        >
          <span aria-hidden="true">←</span>
          Nazad na proizvode
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] lg:items-start lg:gap-16">
          <div className="ws-stage min-w-0 overflow-hidden rounded-[2rem] p-3 sm:p-5">
            <ProductGallery
              images={imageList}
              productName={product.name}
            />
          </div>

          <div className="rounded-[2rem] border border-[#B8955A]/30 bg-white p-6 shadow-[0_30px_80px_rgba(31,42,60,0.10)] sm:p-8 lg:sticky lg:top-28">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[#B8955A]/40 bg-[#B8955A]/6 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1F2A3C]/72">
                {productTypeLabel}
              </span>

              {isWatch && (
                <span className="rounded-full border border-[#B8955A]/40 bg-[#B8955A]/6 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1F2A3C]/72">
                  {categoryLabel}
                </span>
              )}
            </div>

            <p className="mt-7 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-[#8A6A33]">
              <span aria-hidden="true" className="h-px w-8 bg-[#B8955A]" />
              {product.brand || "WATCH STORE"}
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              {product.name}
            </h1>

            {product.model && (
              <p className="mt-4 text-lg text-[#1F2A3C]/72">
                {product.model}
              </p>
            )}

            {isWatch && product.reference && (
              <p className="mt-2 text-sm text-[#1F2A3C]/60">
                Ref. {product.reference}
              </p>
            )}

            <div className="mt-9 border-y border-[#B8955A]/30 py-7">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1F2A3C]/72">
                    Prodajna cena
                  </p>

                  {hasDiscount && (
                    <p className="mb-1 mt-3 text-lg font-medium text-[#1F2A3C]/72 line-through decoration-[#8A6A33]/60">
                      {Number(product.old_price).toLocaleString("sr-RS", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      RSD
                    </p>
                  )}

                  <p className="mt-2 text-4xl font-semibold tracking-tight text-[#8A6A33] sm:text-5xl">
                    {Number(product.price).toLocaleString("sr-RS", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-xl font-medium text-[#1F2A3C]/72">
                      RSD
                    </span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  {product.stock > 0 ? (
                    <>
                      <p className="text-sm font-semibold text-[#8A6A33]">
                        ✓ Na stanju
                      </p>

                      <p className="mt-1 text-xs text-[#1F2A3C]/72">
                        {product.stock}{" "}
                        {product.stock === 1 ? "komad" : "komada"}
                      </p>
                    </>
                  ) : (
                    <RestockNotificationButton productId={product.id} />
                  )}
                </div>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex-1">
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

                <WishlistButton
                  productId={product.id}
                  className="h-12 w-12 shrink-0"
                />
              </div>
            </div>

            {isWatch && (product.year || product.reference) && (
              <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[#B8955A]/30 bg-[#B8955A]/10 sm:grid-cols-2">
                {product.year && (
                  <div className="bg-[#FFFFFF] p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1F2A3C]/72">
                      Godina
                    </p>

                    <p className="mt-2 font-medium text-[#1F2A3C]">
                      {product.year}
                    </p>
                  </div>
                )}

                {product.reference && (
                  <div className="bg-[#FFFFFF] p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1F2A3C]/72">
                      Referenca
                    </p>

                    <p className="mt-2 font-medium text-[#1F2A3C]">
                      {product.reference}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <section className="mt-16 border-t border-[#B8955A]/30 pt-12 sm:mt-24 sm:pt-16">
            <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#8A6A33]">
                  {isWatch ? "O satu" : "O proizvodu"}
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Opis
                </h2>
              </div>

              <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-[#1F2A3C]/72">
                {product.description}
              </p>
            </div>
          </section>
        )}

        {visibleGroups.length > 0 && (
          <section className="mt-16 border-t border-[#B8955A]/30 pt-12 sm:mt-24 sm:pt-16">
            <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#8A6A33]">
                  {isWatch ? "Detalji sata" : "Detalji proizvoda"}
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Specifikacije
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-7 text-[#1F2A3C]/72">
                  {isWatch
                    ? "Tehnički podaci prikazani su prema informacijama dostupnim za konkretan model."
                    : "Prikazane su dostupne informacije o materijalu, dimenzijama i sadržaju proizvoda."}
                </p>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#B8955A]/30 bg-gradient-to-br from-[#FFFFFF]/90 to-[#F8F4E7]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {visibleGroups.map((group, groupIndex) => (
                  <div
                    key={group.title}
                    className={
                      groupIndex > 0 ? "border-t border-[#B8955A]/20" : ""
                    }
                  >
                    <div className="px-6 py-6 sm:px-8">
                      <h3 className="text-lg font-semibold text-[#1F2A3C]">
                        {group.title}
                      </h3>

                      <div className="mt-4">
                        {group.specifications.map(
                          (specification, specificationIndex) => (
                            <div
  key={specification.label}
  className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-start gap-4 py-4 ${
    specificationIndex > 0
      ? "border-t border-[#B8955A]/15"
      : ""
  }`}
>
  <span className="text-sm text-[#1F2A3C]/72">
    {specification.label}
  </span>

  <span className="text-right text-sm font-medium text-[#1F2A3C] whitespace-normal break-normal">
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

      <div className="mt-20">
        <SiteFooter />
      </div>
    </main>
  );
}