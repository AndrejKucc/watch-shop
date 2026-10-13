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
      <label htmlFor={id} className="mb-2 block text-sm text-neutral-400">
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 text-sm text-white outline-none transition focus:border-white/30"
      >
        <option value="">Sve vrednosti</option>

        {options.map((option) => (
          <option key={option} value={option} className="bg-neutral-950">
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

  const showAccessoryFilters =
    isAccessoryMode || isWalletMode;

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
      distinctValues(products, (product) => {
        if (product.accessory_material) {
          return product.accessory_material;
        }

        return product.bracelet_material;
      }),
    [products],
  );

  const accessoryColors = useMemo(
    () =>
      distinctValues(products, (product) => {
        if (product.accessory_color) {
          return product.accessory_color;
        }

        return product.bracelet_color;
      }),
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

  const invalidMinPrice =
    min !== null && (!Number.isFinite(min) || min < 0);

  const invalidMaxPrice =
    max !== null && (!Number.isFinite(max) || max < 0);

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
          min === null ||
          !Number.isFinite(min) ||
          productPrice >= min;

        const matchesMaxPrice =
          max === null ||
          !Number.isFinite(max) ||
          productPrice <= max;

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
          normalize(product.water_resistance) ===
            normalize(waterResistance);

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

        const dateA = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;

        const dateB = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;

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

  return (
    <>
      <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-900/60 p-4 backdrop-blur sm:p-5">
        <div className="flex flex-col gap-5">
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={`Pretraži ${productLabel}`}
              className="h-14 w-full rounded-2xl border border-white/10 bg-neutral-950 pl-12 pr-12 text-base text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Obriši pretragu"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {isWatchMode && showGenderFilter && (
            <div>
              <p className="mb-2 text-sm text-neutral-400">Pol</p>

              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = category === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setCategory(item.value)}
                      aria-pressed={active}
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                        active
                          ? "bg-white text-black"
                          : "border border-white/10 bg-neutral-950 text-neutral-300 hover:border-white/20 hover:bg-neutral-800 hover:text-white"
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
              <p className="mb-3 text-sm font-semibold text-white">
                Filteri za satove
              </p>

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
              <p className="mb-3 text-sm font-semibold text-white">
                Filteri za dodatke
              </p>

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
              <p className="mb-3 text-sm font-semibold text-white">
                Filteri za poklone
              </p>

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

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="min-price"
                className="mb-2 block text-sm text-neutral-400"
              >
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
                  className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 pr-16 text-base text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
                  RSD
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="max-price"
                className="mb-2 block text-sm text-neutral-400"
              >
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
                  className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 pr-16 text-base text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
                  RSD
                </span>
              </div>
            </div>
          </div>

          {invalidPriceRange && (
            <p role="alert" className="text-sm text-red-400">
              Proveri cene: obe moraju biti nenegativne, a cena „od” ne
              može biti veća od cene „do”.
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(event) => setOnlyInStock(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-neutral-950 accent-white"
              />

              <span>Samo na stanju</span>
            </label>

            <div className="flex items-center gap-3">
              <label
                htmlFor="sort-products"
                className="text-sm text-neutral-400"
              >
                Sortiraj:
              </label>

              <select
                id="sort-products"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-h-11 min-w-0 rounded-xl border border-white/10 bg-neutral-950 px-3 text-sm text-white outline-none transition focus:border-white/30"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-neutral-950"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {hasActiveFilters ? "Filtrirani rezultati" : `Svi ${productLabel}`}
          </p>

          <p className="mt-1 text-lg font-semibold">
            {invalidPriceRange ? 0 : filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "proizvod" : "proizvoda"}
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-400 transition hover:border-white/20 hover:text-white"
          >
            Resetuj filtere
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!invalidPriceRange &&
          filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-800/80"
            >
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden bg-neutral-800">
                  <div className="aspect-[4/3]">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-neutral-500">
                          Slika proizvoda
                        </span>
                      </div>
                    )}
                  </div>

                  {isWatchMode && showGenderFilter && (
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur">
                        {normalize(product.category) === "muski"
                          ? "Muški"
                          : normalize(product.category) === "zenski"
                            ? "Ženski"
                            : "Unisex"}
                      </span>
                    </div>
                  )}

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
                      <span className="rounded-full border border-white/10 bg-neutral-950/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300">
                        Nije na stanju
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 pb-2">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                    {product.brand || "Watch Shop"}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {product.name}
                  </h3>

                  {product.model && (
                    <p className="mt-1 text-sm text-neutral-500">
                      {product.model}
                    </p>
                  )}
                </div>
              </Link>

              <div className="p-6 pt-4">
                <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-neutral-600">
                      Cena
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                      {Number(product.price).toLocaleString("sr-RS")} RSD
                    </p>
                  </div>

                  <span
                    className={
                      product.stock > 0
                        ? "text-right text-xs text-neutral-500"
                        : "text-right text-xs text-red-400"
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

                <CompareButton productId={product.id} />
              </div>
            </article>
          ))}

        {(invalidPriceRange || filteredProducts.length === 0) && (
          <div className="col-span-full rounded-[2rem] border border-white/10 bg-neutral-900 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-neutral-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              {invalidPriceRange ? "Proveri cene" : "Nema rezultata"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              {invalidPriceRange
                ? "Unete cene nisu ispravne. Proveri početnu i maksimalnu cenu."
                : "Nismo pronašli proizvod koji odgovara izabranim filterima. Promeni kriterijume ili resetuj filtere."}
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 active:scale-95"
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