"use client";

import { CompareButton } from "@/components/compare-button";
import ComparePanel from "@/components/compare-panel";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/cart";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  product_type?: string | null;
  images: string[] | null;
  created_at?: string | null;

  movement_type?: string | null;
  case_diameter?: string | number | null;
  case_material?: string | null;
  case_color?: string | null;
  case_shape?: string | null;
  case_thickness?: string | null;

  bracelet_material?: string | null;
  bracelet_color?: string | null;
  bracelet_width?: string | null;

  accessory_material?: string | null;
  accessory_color?: string | null;
  accessory_size?: string | null;
  accessory_dimensions?: string | null;

  gift_for?: string | null;
  gift_contents?: string | null;

  water_resistance?: string | null;
  chronograph?: string | null;
  gmt?: string | null;
  reference?: string | null;
  crystal_material?: string | null;
};

type FilterMode = "basic" | "watches" | "accessories" | "wallets" | "gifts";

const COLORS = {
  black: "#191C1B",
  green: "#163D30",
  red: "#8F2638",
  white: "#F4F3EF",
  muted: "#A5ADA7",
  border: "rgba(255,255,255,0.10)",
};

const categories = [
  { value: "sve", label: "Svi" },
  { value: "muski", label: "Muški" },
  { value: "zenski", label: "Ženski" },
  { value: "unisex", label: "Unisex" },
];

const sortOptions = [
  { value: "newest", label: "Najnoviji" },
  { value: "price_asc", label: "Cena: najniža" },
  { value: "price_desc", label: "Cena: najviša" },
  { value: "name_asc", label: "Naziv: A–Z" },
];

function normalize(value: unknown) {
  return String(value ?? "").trim().toLocaleLowerCase("sr-RS");
}

function distinctValues(
  products: Product[],
  getValue: (product: Product) => unknown,
) {
  return Array.from(
    new Set(
      products
        .map((product) => String(getValue(product) ?? "").trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, "sr"));
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-medium uppercase tracking-[0.13em] text-[#A5ADA7]"
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/[0.10] bg-[#191C1B]/80 px-3 text-sm text-[#F4F3EF] outline-none backdrop-blur-xl transition duration-200 hover:border-white/[0.20] focus:border-[#163D30] focus:ring-2 focus:ring-[#163D30]/50"
      >
        <option value="" className="bg-[#191C1B]">
          Sve vrednosti
        </option>

        {options.map((option) => (
          <option key={option} value={option} className="bg-[#191C1B]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CategoryFilter({
  products,
  productLabel = "proizvodi",
  searchPlaceholder = "Pretraži proizvode...",
  showGenderFilter = true,
  filterMode = "watches",
}: {
  products: Product[];
  productLabel?: string;
  searchPlaceholder?: string;
  showGenderFilter?: boolean;
  filterMode?: FilterMode;
}) {
  const isWatchMode = filterMode === "watches";
  const isAccessoryMode = filterMode === "accessories";
  const isWalletMode = filterMode === "wallets";
  const isGiftMode = filterMode === "gifts";

  const showAccessoryFilters = isAccessoryMode || isWalletMode;

  const [category, setCategory] = useState("sve");
  const [search, setSearch] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [brand, setBrand] = useState("");
  const [movement, setMovement] = useState("");
  const [diameter, setDiameter] = useState("");
  const [caseMaterial, setCaseMaterial] = useState("");
  const [braceletMaterial, setBraceletMaterial] = useState("");
  const [waterResistance, setWaterResistance] = useState("");
  const [chronograph, setChronograph] = useState("");
  const [gmt, setGmt] = useState("");

  const [accessoryMaterial, setAccessoryMaterial] = useState("");
  const [accessoryColor, setAccessoryColor] = useState("");
  const [accessorySize, setAccessorySize] = useState("");
  const [giftFor, setGiftFor] = useState("");

  const brands = useMemo(
    () => distinctValues(products, (product) => product.brand),
    [products],
  );

  const movements = useMemo(
    () => distinctValues(products, (product) => product.movement_type),
    [products],
  );

  const diameters = useMemo(
    () => distinctValues(products, (product) => product.case_diameter),
    [products],
  );

  const caseMaterials = useMemo(
    () => distinctValues(products, (product) => product.case_material),
    [products],
  );

  const braceletMaterials = useMemo(
    () => distinctValues(products, (product) => product.bracelet_material),
    [products],
  );

  const waterResistances = useMemo(
    () => distinctValues(products, (product) => product.water_resistance),
    [products],
  );

  const chronographOptions = useMemo(
    () => distinctValues(products, (product) => product.chronograph),
    [products],
  );

  const gmtOptions = useMemo(
    () => distinctValues(products, (product) => product.gmt),
    [products],
  );

  const accessoryMaterials = useMemo(
    () =>
      distinctValues(
        products,
        (product) =>
          product.accessory_material || product.bracelet_material,
      ),
    [products],
  );

  const accessoryColors = useMemo(
    () =>
      distinctValues(
        products,
        (product) => product.accessory_color || product.bracelet_color,
      ),
    [products],
  );

  const accessorySizes = useMemo(
    () => distinctValues(products, (product) => product.accessory_size),
    [products],
  );

  const giftForOptions = useMemo(
    () => distinctValues(products, (product) => product.gift_for),
    [products],
  );

  const min = minPrice.trim() === "" ? null : Number(minPrice);
  const max = maxPrice.trim() === "" ? null : Number(maxPrice);

  const invalidMinPrice = min !== null && (!Number.isFinite(min) || min < 0);
  const invalidMaxPrice = max !== null && (!Number.isFinite(max) || max < 0);

  const invalidPriceRange =
    invalidMinPrice ||
    invalidMaxPrice ||
    (min !== null && max !== null && min > max);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalize(search);

    return products
      .filter((product) => {
        const matchesCategory =
          !isWatchMode ||
          !showGenderFilter ||
          category === "sve" ||
          normalize(product.category) === normalize(category);

        const searchableText = [
          product.name,
          product.brand,
          product.model,
          product.description,
          product.reference,
          product.accessory_material,
          product.accessory_color,
          product.accessory_size,
          product.accessory_dimensions,
          product.gift_for,
          product.gift_contents,
          product.case_material,
          product.case_color,
          product.bracelet_material,
          product.bracelet_color,
        ]
          .filter(Boolean)
          .join(" ");

        const matchesSearch =
          normalizedSearch === "" ||
          normalize(searchableText).includes(normalizedSearch);

        const matchesStock = !onlyInStock || product.stock > 0;
        const productPrice = Number(product.price);

        const matchesMinPrice =
          min === null || !Number.isFinite(min) || productPrice >= min;

        const matchesMaxPrice =
          max === null || !Number.isFinite(max) || productPrice <= max;

        const matchesBrand =
          !isWatchMode ||
          !brand ||
          normalize(product.brand) === normalize(brand);

        const matchesMovement =
          !isWatchMode ||
          !movement ||
          normalize(product.movement_type) === normalize(movement);

        const matchesDiameter =
          !isWatchMode ||
          !diameter ||
          normalize(product.case_diameter) === normalize(diameter);

        const matchesCaseMaterial =
          !isWatchMode ||
          !caseMaterial ||
          normalize(product.case_material) === normalize(caseMaterial);

        const matchesBraceletMaterial =
          !isWatchMode ||
          !braceletMaterial ||
          normalize(product.bracelet_material) ===
            normalize(braceletMaterial);

        const matchesWaterResistance =
          !isWatchMode ||
          !waterResistance ||
          normalize(product.water_resistance) === normalize(waterResistance);

        const matchesChronograph =
          !isWatchMode ||
          !chronograph ||
          normalize(product.chronograph) === normalize(chronograph);

        const matchesGmt =
          !isWatchMode ||
          !gmt ||
          normalize(product.gmt) === normalize(gmt);

        const productMaterial =
          product.accessory_material || product.bracelet_material;

        const productColor =
          product.accessory_color || product.bracelet_color;

        const matchesAccessoryMaterial =
          !showAccessoryFilters ||
          !accessoryMaterial ||
          normalize(productMaterial) === normalize(accessoryMaterial);

        const matchesAccessoryColor =
          !showAccessoryFilters ||
          !accessoryColor ||
          normalize(productColor) === normalize(accessoryColor);

        const matchesAccessorySize =
          !isWalletMode ||
          !accessorySize ||
          normalize(product.accessory_size) === normalize(accessorySize);

        const matchesGiftFor =
          !isGiftMode ||
          !giftFor ||
          normalize(product.gift_for) === normalize(giftFor);

        return (
          matchesCategory &&
          matchesSearch &&
          matchesStock &&
          matchesMinPrice &&
          matchesMaxPrice &&
          matchesBrand &&
          matchesMovement &&
          matchesDiameter &&
          matchesCaseMaterial &&
          matchesBraceletMaterial &&
          matchesWaterResistance &&
          matchesChronograph &&
          matchesGmt &&
          matchesAccessoryMaterial &&
          matchesAccessoryColor &&
          matchesAccessorySize &&
          matchesGiftFor
        );
      })
      .sort((a, b) => {
        if (sort === "price_asc") {
          return Number(a.price) - Number(b.price);
        }

        if (sort === "price_desc") {
          return Number(b.price) - Number(a.price);
        }

        if (sort === "name_asc") {
          return a.name.localeCompare(b.name, "sr");
        }

        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

        return dateB - dateA;
      });
  }, [
    products,
    category,
    search,
    onlyInStock,
    sort,
    min,
    max,
    brand,
    movement,
    diameter,
    caseMaterial,
    braceletMaterial,
    waterResistance,
    chronograph,
    gmt,
    accessoryMaterial,
    accessoryColor,
    accessorySize,
    giftFor,
    showGenderFilter,
    isWatchMode,
    showAccessoryFilters,
    isWalletMode,
    isGiftMode,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    (isWatchMode && category !== "sve") ||
    onlyInStock ||
    sort !== "newest" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    (isWatchMode && brand !== "") ||
    (isWatchMode && movement !== "") ||
    (isWatchMode && diameter !== "") ||
    (isWatchMode && caseMaterial !== "") ||
    (isWatchMode && braceletMaterial !== "") ||
    (isWatchMode && waterResistance !== "") ||
    (isWatchMode && chronograph !== "") ||
    (isWatchMode && gmt !== "") ||
    (showAccessoryFilters && accessoryMaterial !== "") ||
    (showAccessoryFilters && accessoryColor !== "") ||
    (isWalletMode && accessorySize !== "") ||
    (isGiftMode && giftFor !== "");

  const resetFilters = () => {
    setSearch("");
    setCategory("sve");
    setOnlyInStock(false);
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setBrand("");
    setMovement("");
    setDiameter("");
    setCaseMaterial("");
    setBraceletMaterial("");
    setWaterResistance("");
    setChronograph("");
    setGmt("");
    setAccessoryMaterial("");
    setAccessoryColor("");
    setAccessorySize("");
    setGiftFor("");
  };

  const labelClass =
    "mb-2 block text-xs font-medium uppercase tracking-[0.13em] text-[#A5ADA7]";

  const inputClass =
    "h-12 w-full rounded-xl border border-white/[0.10] bg-[#191C1B]/80 px-4 text-base text-[#F4F3EF] outline-none backdrop-blur-xl transition duration-200 placeholder:text-[#737C76] hover:border-white/[0.20] focus:border-[#163D30] focus:ring-2 focus:ring-[#163D30]/50";

  return (
    <>
      <style jsx>{`
        .ws-glass-panel {
          background: rgba(25, 28, 27, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(24px) saturate(145%);
          -webkit-backdrop-filter: blur(24px) saturate(145%);
        }

        .ws-glass-control {
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            background 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .ws-glass-control:hover {
          background: rgba(255, 255, 255, 0.065);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .ws-category-active {
          background: linear-gradient(135deg, #163d30, #20533f);
          border: 1px solid rgba(125, 180, 145, 0.42);
          color: #f4f3ef;
          box-shadow:
            0 8px 24px rgba(22, 61, 48, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .ws-filter-button {
          min-height: 44px;
          border-radius: 14px;
          padding: 11px 18px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .ws-product-card {
          background: linear-gradient(
            145deg,
            rgba(37, 42, 39, 0.96),
            rgba(25, 28, 27, 0.98) 65%
          );
          border: 1px solid rgba(255, 255, 255, 0.085);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
          transition:
            transform 260ms ease,
            border-color 260ms ease,
            box-shadow 260ms ease;
        }

        .ws-product-card:hover {
          transform: translateY(-5px);
          border-color: rgba(90, 133, 108, 0.58);
          box-shadow: 0 24px 55px rgba(0, 0, 0, 0.26);
        }

        .ws-product-image {
          transition: transform 650ms cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .ws-product-card:hover .ws-product-image {
          transform: scale(1.045);
        }

        .ws-accent-line {
          background: linear-gradient(
            90deg,
            #163d30,
            rgba(22, 61, 48, 0.12)
          );
        }

        .ws-price {
          color: #f4f3ef;
          font-variant-numeric: tabular-nums;
        }

        .ws-stock-dot {
          background: #5d9d76;
          box-shadow: 0 0 0 4px rgba(93, 157, 118, 0.1);
        }

        .ws-out-of-stock {
          background: rgba(143, 38, 56, 0.2);
          border: 1px solid rgba(200, 85, 104, 0.35);
        }

        .ws-search-clear:hover {
          background: rgba(143, 38, 56, 0.2);
          color: #f4b6c0;
        }

        .ws-reset-button {
          border: 1px solid rgba(143, 38, 56, 0.38);
          color: #e3a5af;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            color 180ms ease;
        }

        .ws-reset-button:hover {
          background: rgba(143, 38, 56, 0.14);
          border-color: rgba(200, 85, 104, 0.65);
          color: #f4c5cc;
        }

        .ws-primary-button {
          background: linear-gradient(135deg, #163d30, #20533f);
          border: 1px solid rgba(125, 180, 145, 0.38);
          color: #f4f3ef;
          transition:
            transform 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .ws-primary-button:hover {
          background: linear-gradient(135deg, #1b4939, #286348);
          box-shadow: 0 10px 26px rgba(22, 61, 48, 0.24);
        }

        .ws-primary-button:active {
          transform: scale(0.98);
        }

        @media (prefers-reduced-motion: reduce) {
          .ws-glass-control,
          .ws-product-card,
          .ws-product-image,
          .ws-reset-button,
          .ws-primary-button {
            transition: none;
          }

          .ws-product-card:hover,
          .ws-product-card:hover .ws-product-image {
            transform: none;
          }
        }
      `}</style>

      <section
        aria-label="Pretraga i filteri proizvoda"
        className="ws-glass-panel mt-10 overflow-hidden rounded-[28px] p-4 sm:mt-12 sm:rounded-[32px] sm:p-6 lg:p-7"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.035]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-[#91B49D]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M4 7h9M17 7h3M4 17h3m4 0h9"
                strokeLinecap="round"
              />
              <circle cx="15" cy="7" r="2" />
              <circle cx="9" cy="17" r="2" />
            </svg>
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#F4F3EF] sm:text-lg">
              Pronađi svoj stil
            </h2>
            <p className="mt-0.5 text-xs text-[#A5ADA7] sm:text-sm">
              Izdvoj detalje i pronađi pravi komad.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91B49D]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <circle cx="11" cy="11" r="7" />
              <path
                d="m20 20-4-4"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={`Pretraži ${productLabel}`}
              className={`${inputClass} h-14 rounded-2xl pl-12 pr-12`}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Obriši pretragu"
                className="ws-search-clear absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-[#A5ADA7] transition"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            )}
          </div>

          {isWatchMode && showGenderFilter && (
            <div>
              <p className={labelClass}>Kategorija</p>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = category === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCategory(item.value)}
                      aria-pressed={active}
                      className={`ws-filter-button ${
                        active
                          ? "ws-category-active"
                          : "ws-glass-control text-[#C4CCC6]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isWatchMode && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-5 w-1 rounded-full bg-[#163D30]" />
                <h3 className="text-sm font-semibold tracking-wide text-[#F4F3EF]">
                  Detalji satova
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FilterSelect
                  id="filter-brand"
                  label="Brend"
                  value={brand}
                  onChange={setBrand}
                  options={brands}
                />

                <FilterSelect
                  id="filter-movement"
                  label="Mehanizam"
                  value={movement}
                  onChange={setMovement}
                  options={movements}
                />

                <FilterSelect
                  id="filter-diameter"
                  label="Prečnik kućišta"
                  value={diameter}
                  onChange={setDiameter}
                  options={diameters}
                />

                <FilterSelect
                  id="filter-case-material"
                  label="Materijal kućišta"
                  value={caseMaterial}
                  onChange={setCaseMaterial}
                  options={caseMaterials}
                />

                <FilterSelect
                  id="filter-bracelet-material"
                  label="Materijal narukvice"
                  value={braceletMaterial}
                  onChange={setBraceletMaterial}
                  options={braceletMaterials}
                />

                <FilterSelect
                  id="filter-water-resistance"
                  label="Vodootpornost"
                  value={waterResistance}
                  onChange={setWaterResistance}
                  options={waterResistances}
                />

                <FilterSelect
                  id="filter-chronograph"
                  label="Hronograf"
                  value={chronograph}
                  onChange={setChronograph}
                  options={chronographOptions}
                />

                <FilterSelect
                  id="filter-gmt"
                  label="GMT"
                  value={gmt}
                  onChange={setGmt}
                  options={gmtOptions}
                />
              </div>
            </div>
          )}

          {showAccessoryFilters && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-5 w-1 rounded-full bg-[#163D30]" />
                <h3 className="text-sm font-semibold tracking-wide text-[#F4F3EF]">
                  Detalji dodataka
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FilterSelect
                  id="filter-accessory-material"
                  label="Materijal"
                  value={accessoryMaterial}
                  onChange={setAccessoryMaterial}
                  options={accessoryMaterials}
                />

                <FilterSelect
                  id="filter-accessory-color"
                  label="Boja"
                  value={accessoryColor}
                  onChange={setAccessoryColor}
                  options={accessoryColors}
                />

                {isWalletMode && (
                  <FilterSelect
                    id="filter-accessory-size"
                    label="Veličina"
                    value={accessorySize}
                    onChange={setAccessorySize}
                    options={accessorySizes}
                  />
                )}
              </div>
            </div>
          )}

          {isGiftMode && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-5 w-1 rounded-full bg-[#8F2638]" />
                <h3 className="text-sm font-semibold tracking-wide text-[#F4F3EF]">
                  Detalji poklona
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FilterSelect
                  id="filter-gift-for"
                  label="Za koga"
                  value={giftFor}
                  onChange={setGiftFor}
                  options={giftForOptions}
                />
              </div>
            </div>
          )}

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-5 w-1 rounded-full bg-[#8F2638]" />
              <h3 className="text-sm font-semibold tracking-wide text-[#F4F3EF]">
                Cena i dostupnost
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="min-price" className={labelClass}>
                  Cena od
                </label>

                <div className="relative">
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    step="1"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="0"
                    className={`${inputClass} pr-16`}
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#737C76]">
                    RSD
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="max-price" className={labelClass}>
                  Cena do
                </label>

                <div className="relative">
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    step="1"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="Bez limita"
                    className={`${inputClass} pr-16`}
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[#737C76]">
                    RSD
                  </span>
                </div>
              </div>
            </div>
          </div>

          {invalidPriceRange && (
            <p
              role="alert"
              className="rounded-xl border border-[#8F2638]/40 bg-[#8F2638]/10 px-4 py-3 text-sm leading-6 text-[#F0B7C0]"
            >
              Proveri cene: obe moraju biti nenegativne, a cena „od” ne može
              biti veća od cene „do”.
            </p>
          )}

          <div className="flex flex-col gap-4 border-t border-white/[0.09] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#C4CCC6]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(event) => setOnlyInStock(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-[#191C1B] accent-[#163D30]"
              />

              <span>Samo proizvodi na stanju</span>
            </label>

            <div className="flex min-w-0 items-center gap-3">
              <label
                htmlFor="sort-products"
                className="shrink-0 text-xs font-medium uppercase tracking-[0.1em] text-[#A5ADA7]"
              >
                Sortiraj
              </label>

              <select
                id="sort-products"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="ws-glass-control min-h-11 min-w-0 flex-1 rounded-xl bg-[#191C1B]/80 px-3 text-sm text-[#F4F3EF] outline-none focus:border-[#163D30] sm:flex-none"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-[#191C1B]"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#A5ADA7]">
            {hasActiveFilters ? "Rezultati pretrage" : `Kolekcija · ${productLabel}`}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-semibold tracking-tight text-[#F4F3EF]">
              {invalidPriceRange ? 0 : filteredProducts.length}
            </p>

            <span className="text-sm text-[#A5ADA7]">
              {filteredProducts.length === 1 ? "proizvod" : "proizvoda"}
            </span>
          </div>

          <div className="ws-accent-line mt-3 h-px w-24" />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="ws-reset-button w-fit rounded-xl px-4 py-3 text-sm font-medium"
          >
            <span className="mr-2" aria-hidden="true">
              ↺
            </span>
            Resetuj filtere
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {!invalidPriceRange &&
          filteredProducts.map((product) => (
            <article
              key={product.id}
              className="ws-product-card group overflow-hidden rounded-[26px]"
            >
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden bg-[#222724]">
                  <div className="aspect-[4/3]">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="ws-product-image h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-[#737C76]">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          className="h-10 w-10 opacity-70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        >
                          <circle cx="12" cy="12" r="8" />
                          <path
                            d="M12 7v5l3 2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-xs uppercase tracking-[0.16em]">
                          Watch Shop
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#191C1B]/50 via-transparent to-transparent" />

                  {isWatchMode && showGenderFilter && (
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/[0.14] bg-[#191C1B]/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F4F3EF] backdrop-blur-xl">
                        {normalize(product.category) === "muski"
                          ? "Muški"
                          : normalize(product.category) === "zenski"
                            ? "Ženski"
                            : "Unisex"}
                      </span>
                    </div>
                  )}

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#191C1B]/70 backdrop-blur-[3px]">
                      <span className="ws-out-of-stock rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F0B7C0]">
                        Nije na stanju
                      </span>
                    </div>
                  )}

                  {product.stock > 0 && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#191C1B]/75 px-3 py-2 backdrop-blur-xl">
                      <span className="ws-stock-dot h-1.5 w-1.5 rounded-full" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#E0E6E1]">
                        Dostupno
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 pb-3 sm:p-6 sm:pb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#91B49D]">
                    {product.brand || "Watch Shop"}
                  </p>

                  <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-[#F4F3EF] transition-colors duration-200 group-hover:text-white sm:text-2xl">
                    {product.name}
                  </h3>

                  {product.model && (
                    <p className="mt-1.5 text-sm text-[#A5ADA7]">
                      {product.model}
                    </p>
                  )}
                </div>
              </Link>

              <div className="p-5 pt-3 sm:p-6 sm:pt-3">
                <div className="mb-5 flex items-end justify-between gap-3 border-t border-white/[0.09] pt-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#737C76]">
                      Cena
                    </p>

                    <p className="ws-price mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">
                      {Number(product.price).toLocaleString("sr-RS")}{" "}
                      <span className="text-xs font-medium text-[#A5ADA7]">
                        RSD
                      </span>
                    </p>
                  </div>

                  <span
                    className={
                      product.stock > 0
                        ? "shrink-0 text-right text-xs text-[#A5ADA7]"
                        : "shrink-0 text-right text-xs text-[#E3A5AF]"
                    }
                  >
                    {product.stock > 0
                      ? `${product.stock} ${
                          product.stock === 1 ? "komad" : "komada"
                        }`
                      : "Nije na stanju"}
                  </span>
                </div>

                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.images?.[0] ?? null,
                    stock: product.stock,
                  }}
                />

                <div className="mt-3">
                  <CompareButton productId={product.id} />
                </div>
              </div>
            </article>
          ))}

        {(invalidPriceRange || filteredProducts.length === 0) && (
          <div className="ws-glass-panel col-span-full rounded-[28px] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.09] bg-white/[0.035]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-7 w-7 text-[#91B49D]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <circle cx="11" cy="11" r="7" />
                <path
                  d="m20 20-4-4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="mt-6 text-xl font-semibold tracking-tight text-[#F4F3EF] sm:text-2xl">
              {invalidPriceRange ? "Proveri unete cene" : "Nema rezultata"}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#A5ADA7]">
              {invalidPriceRange
                ? "Unete cene nisu ispravne. Proveri početnu i maksimalnu cenu."
                : "Nismo pronašli proizvod koji odgovara izabranim filterima. Promeni kriterijume ili prikaži celu kolekciju."}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="ws-primary-button mt-7 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              Prikaži sve {productLabel}
            </button>
          </div>
        )}
      </div>

      <ComparePanel products={products} />
    </>
  );
}