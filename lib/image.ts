// Pomoćne funkcije za manje slike (brže učitavanje na telefonu).
//
// Ako je slika u Supabase Storage-u, tražimo smanjenu verziju preko
// "render/image" adrese. Ako ta opcija nije uključena na tvom Supabase planu,
// komponenta ProductImage automatski prelazi na originalnu sliku, tako da
// ništa ne puca. Za slike sa drugih adresa ništa se ne menja.

const STORAGE_MARKER = "/storage/v1/object/public/";
const RENDER_MARKER = "/storage/v1/render/image/public/";

export function canResize(url: string | null | undefined): url is string {
  return typeof url === "string" && url.includes(STORAGE_MARKER);
}

export function resizedUrl(
  url: string,
  width: number,
  quality = 70,
): string {
  if (!canResize(url)) return url;

  const base = url.replace(STORAGE_MARKER, RENDER_MARKER);
  const separator = base.includes("?") ? "&" : "?";

  return `${base}${separator}width=${width}&quality=${quality}`;
}

export function resizedSrcSet(
  url: string,
  widths: number[],
  quality = 70,
): string | undefined {
  if (!canResize(url)) return undefined;

  return widths.map((w) => `${resizedUrl(url, w, quality)} ${w}w`).join(", ");
}
