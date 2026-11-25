// Pomoćne funkcije za slike.
//
// Smanjene verzije slika iz Supabase-a (render/image) su ISKLJUČENE za prikaz,
// jer su davale slike u pogrešnoj razmeri (prazan prostor, sečenje).
// Ako ikada želiš da ih ponovo probaš, promeni ENABLE_RESIZE u true.
const ENABLE_RESIZE = false;

const STORAGE_MARKER = "/storage/v1/object/public/";
const RENDER_MARKER = "/storage/v1/render/image/public/";

export function canResize(url: string | null | undefined): url is string {
  return typeof url === "string" && url.includes(STORAGE_MARKER);
}

function renderUrl(url: string, width: number, height: number, quality: number) {
  const base = url.replace(STORAGE_MARKER, RENDER_MARKER);
  const separator = base.includes("?") ? "&" : "?";

  return `${base}${separator}width=${width}&height=${height}&resize=cover&quality=${quality}`;
}

// Slika za prikaz: original (dok je ENABLE_RESIZE isključen)
export function resizedUrl(url: string, width: number, quality = 70): string {
  if (!ENABLE_RESIZE || !canResize(url)) return url;

  return renderUrl(url, width, Math.round(width * 1.25), quality);
}

export function resizedSrcSet(
  url: string,
  widths: number[],
  quality = 70,
): string | undefined {
  if (!ENABLE_RESIZE || !canResize(url)) return undefined;

  return widths.map((w) => `${resizedUrl(url, w, quality)} ${w}w`).join(", ");
}

// Sićušna slika (64 px) samo za računanje boje pozadine u heroju.
export function tinyUrl(url: string): string {
  if (!canResize(url)) return url;

  return renderUrl(url, 64, 80, 50);
}

// Slika za veliki prikaz u galeriji proizvoda: staje u 1000x1000, bez sečenja.
export function galleryUrl(url: string): string {
  if (!canResize(url)) return url;

  const base = url.replace(STORAGE_MARKER, RENDER_MARKER);
  const separator = base.includes("?") ? "&" : "?";

  return `${base}${separator}width=1000&height=1000&resize=contain&quality=75`;
}

// Kvadratna sličica (300x300) za sličice ispod velike slike u galeriji.
export function galleryThumbUrl(url: string): string {
  if (!canResize(url)) return url;

  const base = url.replace(STORAGE_MARKER, RENDER_MARKER);
  const separator = base.includes("?") ? "&" : "?";

  return `${base}${separator}width=300&height=300&resize=cover&quality=60`;
}

// Mala sličica (144x180, odnos 4:5) za male kartice u heroju.
export function thumbUrl(url: string): string {
  if (!canResize(url)) return url;

  return renderUrl(url, 144, 180, 60);
}
