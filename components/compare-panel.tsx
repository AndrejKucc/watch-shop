"use client";

import Link from "next/link";
import { useCompare } from "@/lib/use-compare";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  price: number;
  images: string[] | null;
  movement_type?: string | null;
  case_diameter?: string | number | null;
  crystal_material?: string | null;
  water_resistance?: string | null;
  gmt?: string | null;
  chronograph?: string | null;
};

function displayValue(value: unknown, suffix = "") {
  if (value === null || value === undefined || value === "") {
    return "Nije navedeno";
  }

  return `${String(value)}${suffix}`;
}

export default function ComparePanel({
  products,
}: {
  products: Product[];
}) {
  const {
    compareIds,
    toggleCompare,
    clearCompare,
  } = useCompare();

  const selectedProducts = compareIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  if (selectedProducts.length === 0) {
    return null;
  }

  const rows = [
    {
      label: "Cena",
      value: (product: Product) =>
        `${Number(product.price).toLocaleString("sr-RS")} RSD`,
    },
    {
      label: "Prečnik kućišta",
      value: (product: Product) =>
        displayValue(product.case_diameter, " mm"),
    },
    {
      label: "Mehanizam",
      value: (product: Product) =>
        displayValue(product.movement_type),
    },
    {
      label: "Staklo",
      value: (product: Product) =>
        displayValue(product.crystal_material),
    },
    {
      label: "Vodootpornost",
      value: (product: Product) =>
        displayValue(product.water_resistance),
    },
    {
      label: "GMT",
      value: (product: Product) =>
        displayValue(product.gmt),
    },
    {
      label: "Hronograf",
      value: (product: Product) =>
        displayValue(product.chronograph),
    },
  ];

  return (
    <section
      id="poredjenje-satova"
      aria-labelledby="compare-heading"
      className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Pronađi pravi izbor
          </p>

          <h2
            id="compare-heading"
            className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
          >
            Poređenje satova
          </h2>

          <p className="mt-2 text-sm text-neutral-400">
            Izabrano: {selectedProducts.length} od 3 sata
          </p>
        </div>

        <button
          type="button"
          onClick={clearCompare}
          className="w-fit rounded-xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:border-white/30 hover:text-white"
        >
          Obriši izbor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="w-40 p-4 text-sm font-medium text-neutral-500 sm:w-52 sm:p-5">
                Karakteristika
              </th>

              {selectedProducts.map((product) => (
                <th
                  key={product.id}
                  className="min-w-48 p-4 align-top sm:p-5"
                >
                  <div className="relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="mb-4 aspect-square w-full max-w-40 rounded-2xl bg-neutral-800 object-cover"
                      />
                    ) : (
                      <div className="mb-4 flex aspect-square w-full max-w-40 items-center justify-center rounded-2xl bg-neutral-800 text-sm text-neutral-500">
                        Bez slike
                      </div>
                    )}

                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      {product.brand || "Watch Shop"}
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {product.name}
                    </p>

                    <Link
                      href={`/product/${product.id}`}
                      className="mt-3 inline-block text-sm text-neutral-400 underline underline-offset-4 transition hover:text-white"
                    >
                      Detalji sata
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleCompare(product.id)}
                      className="mt-3 block text-sm text-red-400 transition hover:text-red-300"
                    >
                      Ukloni iz poređenja
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-white/5 last:border-0"
              >
                <th
                  scope="row"
                  className="p-4 text-sm font-medium text-neutral-400 sm:p-5"
                >
                  {row.label}
                </th>

                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="p-4 text-sm text-white sm:p-5"
                  >
                    {row.value(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-white/10 p-4 text-xs leading-5 text-neutral-500 sm:p-5">
        Prikazane su specifikacije koje su dostupne u bazi proizvoda.
        Za podatke koji nisu uneti prikazuje se „Nije navedeno“.
      </p>
    </section>
  );
}