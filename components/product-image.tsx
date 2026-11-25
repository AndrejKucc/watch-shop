"use client";

import { useEffect, useRef, useState } from "react";
import { resizedSrcSet, resizedUrl } from "@/lib/image";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  widths?: number[];
  priority?: boolean;
  style?: React.CSSProperties;
  // slika koja se učitava ako `src` ne uspe (npr. original umesto sličice)
  fallbackSrc?: string;
};

/**
 * Slika proizvoda koja traži smanjenu verziju (brže na telefonu).
 * Ako smanjena verzija ne postoji, automatski učitava originalnu sliku.
 */
export function ProductImage({
  src,
  alt,
  className,
  sizes,
  widths = [480, 800, 1200],
  priority = false,
  style,
  fallbackSrc,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  // Ako je greška nastala pre nego što se stranica "oživela" u browseru
  useEffect(() => {
    const el = ref.current;

    if (el && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  const mainWidth = widths[Math.floor(widths.length / 2)];

  return (
    <img
      ref={ref}
      src={failed ? (fallbackSrc ?? src) : resizedUrl(src, mainWidth)}
      srcSet={failed ? undefined : resizedSrcSet(src, widths)}
      sizes={failed ? undefined : sizes}
      alt={alt}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
}
