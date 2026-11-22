"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product-image";
import { canResize, resizedUrl } from "@/lib/image";

export type HeroSlide = {
  id: string;
  name: string;
  brand: string;
  href: string;
  cta: string;
  image: string;
  price: number | null;
  oldPrice: number | null;
  subtitle?: string;
  badge: { text: string; className: string } | null;
};

type QuickLink = { href: string; label: string };

type HeroShowcaseProps = {
  slides: HeroSlide[];
  quickLinks: QuickLink[];
  year: number;
};

const INTERVAL = 6500;
const DEFAULT_RGB = "184,149,90";

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue(p, q, h + 1 / 3) * 255),
    Math.round(hue(p, q, h) * 255),
    Math.round(hue(p, q, h - 1 / 3) * 255),
  ];
}

// Izvlači glavnu boju sata sa slike (mala slika, 24x24 piksela)
function loadColor(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) return resolve(null);

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let rs = 0;
        let gs = 0;
        let bs = 0;
        let ws = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (data[i + 3] < 128) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 510;
          const sat = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255) || 1);
          const weight = Math.max(0.02, (0.15 + sat) * (1 - Math.abs(l - 0.5) * 1.4));

          rs += r * weight;
          gs += g * weight;
          bs += b * weight;
          ws += weight;
        }

        if (ws === 0) return resolve(null);

        const [h0, s0, l0] = rgbToHsl(rs / ws, gs / ws, bs / ws);

        // srebrni i crni satovi (skoro bez boje) dobijaju hladnu plavo-sivu nijansu
        const neutral = s0 < 0.1;
        const [r, g, b] = hslToRgb(
          neutral ? 0.6 : h0,
          neutral ? 0.16 : Math.min(1, Math.max(0.2, s0 * 1.15)),
          Math.min(0.46, Math.max(0.3, l0)),
        );

        resolve(`${r},${g},${b}`);
      } catch {
        // slika sa tuđe adrese bez dozvole: ostaje podrazumevana zlatna
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function glowBackground(rgb: string) {
  return [
    `radial-gradient(ellipse 75% 65% at 72% 28%, rgba(${rgb},0.85), transparent 72%)`,
    `radial-gradient(ellipse 60% 50% at 8% 95%, rgba(${rgb},0.50), transparent 70%)`,
    `linear-gradient(180deg, rgba(${rgb},0.35), rgba(31,42,60,0) 75%)`,
  ].join(", ");
}

function formatPrice(value: number) {
  return value.toLocaleString("sr-RS", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function HeroShowcase({
  slides,
  quickLinks,
  year,
}: HeroShowcaseProps) {
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState<number[]>(count > 1 ? [0, 1] : [0]);
  const [colors, setColors] = useState<Record<number, string>>({});

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const goTo = useCallback(
    (target: number) => {
      if (count < 2) return;

      const safe = ((target % count) + count) % count;

      setPrev(index);
      setIndex(safe);
      setSeen((current) => {
        const upcoming = (safe + 1) % count;
        const next = new Set(current);
        next.add(safe);
        next.add(upcoming);
        return Array.from(next);
      });
    },
    [count, index],
  );

  // automatsko listanje (staje kad se pređe mišem / dodirne, i za one koji ne žele animacije)
  useEffect(() => {
    if (count < 2 || paused) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(() => goTo(index + 1), INTERVAL);

    return () => clearTimeout(timer);
  }, [index, paused, count, goTo]);

  // boje svih satova se računaju odmah pri učitavanju, pa nema čekanja kad se sat promeni
  useEffect(() => {
    let cancelled = false;

    slides.forEach((slide, i) => {
      if (slide.image.startsWith("/")) return;

      // za slike koje se ne mogu smanjiti računamo samo prva dva sata
      if (!canResize(slide.image) && i > 1) return;

      loadColor(resizedUrl(slide.image, 64, 50))
        .then((small) => {
          if (small || cancelled) return small;
          return i < 2 ? loadColor(slide.image) : null;
        })
        .then((rgb) => {
          if (rgb && !cancelled) {
            setColors((existing) =>
              existing[i] ? existing : { ...existing, [i]: rgb },
            );
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [slides]);

  // stara pozadina nestaje tek pošto se nova potpuno pojavi
  useEffect(() => {
    const timer = setTimeout(() => setPrev(index), 800);

    return () => clearTimeout(timer);
  }, [index]);

  const current = slides[index];

  return (
    <section
      className="relative isolate z-10"
      aria-roledescription="carousel"
      aria-label="Izdvojeni satovi"
    >
      {/* POZADINA KOJA SE MENJA U ZAVISNOSTI OD SATA */}
      <div
        aria-hidden="true"
        className="ws-ambient-mask pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        {prev !== index && slides[prev] && (
          <div
            key={`prev-${prev}`}
            className="absolute inset-0"
            style={{ background: glowBackground(colors[prev] ?? DEFAULT_RGB) }}
          />
        )}

        <div
          key={`current-${index}`}
          className="ws-fade-in absolute inset-0"
          style={{
            background: glowBackground(
              colors[index] ?? colors[prev] ?? DEFAULT_RGB,
            ),
          }}
        />
      </div>

      <div className="flex items-center justify-between px-6 pt-6 text-[10px] font-medium uppercase tracking-[0.3em] text-[#F8F4E7]/60 sm:px-10 sm:pt-8">
        <span className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#B8955A]" />
          Kolekcija {year}
        </span>

        {count > 1 && (
          <span className="flex items-center gap-3" aria-live="polite">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
            <span className="h-px w-8 bg-[#B8955A]" />
          </span>
        )}
      </div>

      <div className="grid items-center gap-10 px-6 pb-12 pt-8 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:pb-16 lg:pt-8">
        {/* TEKST */}
        <div className="relative z-10 max-w-2xl">
          <div className="ws-rise ws-dark-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#B8955A] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8955A]" />
            Vreme je za nešto posebno
          </div>

          <h1
            className="ws-rise ws-serif mt-7 text-4xl font-normal leading-[1.05] tracking-tight text-[#F8F4E7] sm:text-5xl lg:text-6xl xl:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            Muški i ženski
            <span className="ws-title-gradient block italic">
              ručni satovi.
            </span>
          </h1>

          <p
            className="ws-rise mt-6 max-w-xl text-base leading-7 text-[#F8F4E7]/70 sm:text-lg sm:leading-8"
            style={{ animationDelay: "240ms" }}
          >
            Otkrij kolekciju muških i ženskih ručnih satova u WATCH STORE-u.
            Pronađi elegantne, moderne i pažljivo odabrane satove, kao i
            narukvice, ogrlice, novčanike i poklone za svaki stil.
          </p>

          <div
            className="ws-rise mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "360ms" }}
          >
            <a
              href="#kolekcija"
              className="ws-gold-button inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold"
            >
              Pogledaj kolekciju
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href="#satovi"
              className="ws-ghost-button inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-medium"
            >
              Izdvojeni satovi
            </a>
          </div>

          <div
            className="ws-rise mt-10 grid max-w-md grid-cols-2 gap-3"
            style={{ animationDelay: "480ms" }}
          >
            <div className="ws-dark-glass flex items-center gap-3 rounded-2xl p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#B8955A]/50 text-[#B8955A]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F8F4E7]">Stil</p>
                <p className="mt-0.5 text-[11px] text-[#F8F4E7]/60">
                  Za svaki trenutak
                </p>
              </div>
            </div>

            <div className="ws-dark-glass flex items-center gap-3 rounded-2xl p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#B8955A]/50 text-[#B8955A]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="m12 3 2.6 5.4 5.9.9-4.3 4.2 1 5.9L12 16.6 6.8 19.4l1-5.9L3.5 9.3l5.9-.9L12 3Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F8F4E7]">
                  Pažljivo birano
                </p>
                <p className="mt-0.5 text-[11px] text-[#F8F4E7]/60">
                  Detalji koji znače
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KARUSEL SATOVA (na telefonu ide prvi) */}
        <div
          className="relative order-first mx-auto w-full max-w-xl lg:order-none lg:max-w-none"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") goTo(index + 1);
            if (event.key === "ArrowLeft") goTo(index - 1);
          }}
        >
          {/* ukrasni brojčanik (samo na većim ekranima) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[7%] hidden items-center justify-center md:flex"
          >
            <svg
              viewBox="0 0 400 400"
              className="ws-ring h-full w-full text-[#B8955A]/45"
            >
              <circle
                cx="200"
                cy="200"
                r="192"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
              />
              <circle
                cx="200"
                cy="200"
                r="168"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="1 6"
              />
              {Array.from({ length: 60 }).map((_, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="8"
                  x2="200"
                  y2={i % 5 === 0 ? 26 : 17}
                  stroke="currentColor"
                  strokeWidth={i % 5 === 0 ? 1.4 : 0.6}
                  transform={`rotate(${i * 6} 200 200)`}
                />
              ))}
            </svg>
          </div>

          <div className="relative rounded-[2rem] border border-[#B8955A]/35 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:rounded-[2.5rem] sm:p-3">
            <div
              className="relative isolate aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#1F2A3C] sm:rounded-[2rem]"
              style={{ touchAction: "pan-y" }}
              onPointerDown={(event) => {
                touchStart.current = { x: event.clientX, y: event.clientY };
                swiped.current = false;
                setPaused(true);
              }}
              onPointerUp={(event) => {
                const start = touchStart.current;
                touchStart.current = null;

                if (event.pointerType !== "mouse") {
                  setTimeout(() => setPaused(false), 4000);
                }

                if (!start) return;

                const dx = event.clientX - start.x;
                const dy = event.clientY - start.y;

                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                  swiped.current = true;
                  goTo(dx < 0 ? index + 1 : index - 1);
                }
              }}
              onPointerCancel={() => {
                touchStart.current = null;
              }}
              onClickCapture={(event) => {
                if (swiped.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  swiped.current = false;
                }
              }}
            >
              {slides.map((slide, i) =>
                seen.includes(i) ? (
                  <div
                    key={slide.id || `slide-${i}`}
                    aria-hidden={i !== index}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      i === index
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-[1.04] opacity-0"
                    }`}
                  >
                    {slide.image.startsWith("/") ? (
                      <img
                        src={slide.image}
                        alt={`${slide.name} – ručni sat`}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : undefined}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ProductImage
                        src={slide.image}
                        alt={`${slide.name} – ručni sat`}
                        priority={i === 0}
                        sizes="(min-width: 1024px) 560px, 92vw"
                        className="h-full w-full object-contain"
                      />
                    )}

                    <Link
                      href={slide.href}
                      aria-label={slide.name}
                      tabIndex={-1}
                      className="absolute inset-0 z-[2]"
                    />
                  </div>
                ) : null,
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[52%] bg-gradient-to-t from-[#1F2A3C]/95 via-[#1F2A3C]/60 to-transparent"
              />

              {current.badge && (
                <span
                  className={`absolute left-4 top-4 z-10 inline-flex max-w-[70%] items-center rounded-xl border px-3 py-2 text-[9px] font-bold tracking-[0.1em] shadow-lg sm:left-5 sm:top-5 sm:text-[10px] ${current.badge.className}`}
                >
                  {current.badge.text}
                </span>
              )}

              <div
                key={`info-${index}`}
                className="ws-rise pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-6 pt-24 sm:px-7 sm:pb-8"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B8955A] sm:text-xs">
                  {current.brand}
                </p>

                <p className="ws-serif mt-2 line-clamp-2 text-2xl font-normal leading-tight tracking-tight text-[#F8F4E7] sm:text-3xl">
                  {current.name}
                </p>

                {current.subtitle && (
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#F8F4E7]/80">
                    {current.subtitle}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  {current.price !== null && (
                    <div>
                      {current.oldPrice !== null &&
                        current.oldPrice > current.price && (
                          <p className="text-xs text-[#F8F4E7]/50 line-through decoration-[#B8955A]/70">
                            {formatPrice(current.oldPrice)} RSD
                          </p>
                        )}
                      <p className="text-lg font-bold text-[#F8F4E7] sm:text-xl">
                        {formatPrice(current.price)}{" "}
                        <span className="text-xs font-medium text-[#B8955A]">
                          RSD
                        </span>
                      </p>
                    </div>
                  )}

                  <Link
                    href={current.href}
                    className="ws-gold-button pointer-events-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold sm:text-sm"
                  >
                    {current.cta}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {count > 1 && (
            <>
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Prethodni sat"
                  className="ws-ghost-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                >
                  <span aria-hidden="true">←</span>
                </button>

                <div className="flex flex-1 items-center gap-2">
                  {slides.map((slide, i) => (
                    <button
                      key={`bar-${slide.id || i}`}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Prikaži sat ${i + 1}`}
                      aria-current={i === index}
                      className="group flex h-6 flex-1 items-center"
                    >
                      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-[#F8F4E7]/20">
                        {i === index ? (
                          <span
                            key={`progress-${index}`}
                            className="ws-progress absolute inset-0 block rounded-full bg-[#B8955A]"
                            style={{
                              animationDuration: `${INTERVAL}ms`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                          />
                        ) : i < index ? (
                          <span className="absolute inset-0 block rounded-full bg-[#B8955A]/60" />
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Sledeći sat"
                  className="ws-ghost-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {slides.map((slide, i) => (
                  <button
                    key={`thumb-${slide.id || i}`}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={slide.name}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition sm:h-16 sm:w-16 ${
                      i === index
                        ? "border-[#B8955A] opacity-100"
                        : "border-[#F8F4E7]/15 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <ProductImage
                      src={slide.image}
                      alt=""
                      widths={[96, 128, 192]}
                      sizes="64px"
                      className="h-full w-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* DONJA TRAKA */}
      <div className="flex items-center justify-between gap-4 border-t border-[#F8F4E7]/10 px-6 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-[#F8F4E7]/55 sm:px-10">
        <a
          href="#satovi"
          className="flex shrink-0 items-center gap-2 transition hover:text-[#B8955A]"
        >
          <span aria-hidden="true">↓</span>
          Skroluj
        </a>

        <div aria-hidden="true" className="ws-ticks mx-2 hidden flex-1 md:block" />

        <nav
          aria-label="Brze kategorije"
          className="hidden shrink-0 items-center gap-6 sm:flex"
        >
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#B8955A]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
