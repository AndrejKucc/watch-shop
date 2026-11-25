import type { Metadata } from "next";

const BASE_URL = "https://watchstore.rs";
const OG_IMAGE = "/images/hero-watch.png";

// Naslov, opis i canonical adresa za jednu stranicu.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = `${title} | WATCH STORE`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "sr_RS",
      siteName: "WATCH STORE",
      url,
      title: fullTitle,
      description,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "WATCH STORE – muški i ženski ručni satovi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
