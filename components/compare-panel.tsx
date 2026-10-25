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
      className="mt-12 overflow-hidden rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#261c15] to-[#17110d] shadow-[0_12px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.035)]"
    >
      <div className="flex flex-col gap-4 border-b border-[#d6b878]/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#c49a55]">
            Pronađi pravi izbor
          </p>

          <h2
            id="compare-heading"
            className="mt-2 text-2xl font-semibold text-[#f4ebdd] sm:text-3xl"
          >
            Poređenje satova
          </h2>

          <p className="mt-2 text-sm text-[#b8a99a]">
            Izabrano: {selectedProducts.length} od 3 sata
          </p>
        </div>

        <button
          type="button"
          onClick={clearCompare}
          className="w-fit rounded-xl border border-[#d6b878]/30 bg-[#211812]/70 px-4 py-3 text-sm text-[#d6c8b7] transition duration-200 hover:border-[#d6b878]/70 hover:bg-[#4b3621]/60 hover:text-[#ead4a0] active:scale-[0.98]"
        >
          Obriši izbor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#d6b878]/20">
              <th className="w-40 p-4 text-sm font-medium text-[#a99987] sm:w-52 sm:p-5">
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
                        className="mb-4 aspect-square w-full max-w-40 rounded-2xl border border-[#d6b878]/15 bg-[#211812] object-cover shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
                      />
                    ) : (
                      <div className="mb-4 flex aspect-square w-full max-w-40 items-center justify-center rounded-2xl border border-[#d6b878]/15 bg-gradient-to-br from-[#4b3621] to-[#211812] text-sm text-[#a99987]">
                        Bez slike
                      </div>
                    )}

                    <p className="text-xs uppercase tracking-wider text-[#c49a55]">
                      {product.brand || "Watch Shop"}
                    </p>

                    <p className="mt-1 font-semibold text-[#f4ebdd]">
                      {product.name}
                    </p>

                    <Link
                      href={`/product/${product.id}`}
                      className="mt-3 inline-block text-sm text-[#d6b878] underline decoration-[#d6b878]/40 underline-offset-4 transition hover:text-[#ead4a0] hover:decoration-[#ead4a0]"
                    >
                      Detalji sata
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleCompare(product.id)}
                      className="mt-3 block text-sm text-[#c46a2d] transition hover:text-[#e18a4d] active:scale-[0.98]"
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
                className="border-b border-[#d6b878]/10 transition-colors last:border-0 hover:bg-[#d6b878]/[0.035]"
              >
                <th
                  scope="row"
                  className="p-4 text-sm font-medium text-[#b8a99a] sm:p-5"
                >
                  {row.label}
                </th>

                {selectedProducts.map((product) => (
                  <td
                    key={product.id}
                    className="p-4 text-sm text-[#f4ebdd] sm:p-5"
                  >
                    {row.value(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-[#d6b878]/20 bg-[#17110d]/30 p-4 text-xs leading-5 text-[#a99987] sm:p-5">
        Prikazane su specifikacije koje su dostupne u bazi proizvoda.
        Za podatke koji nisu uneti prikazuje se „Nije navedeno“.
      </p>
    </section>
  );
}