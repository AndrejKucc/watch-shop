import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { WishlistProvider } from "@/components/wishlist";
import { ScrollReveal } from "@/components/scroll-reveal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://watchstore.rs"),

  title: {
    default: "WATCH STORE | Muški i ženski ručni satovi",
    template: "%s | WATCH STORE",
  },

  description:
    "Otkrijte WATCH STORE kolekciju muških i ženskih ručnih satova. Pronađite elegantne, moderne i pažljivo odabrane satove i aksesoare. Poručite online širom Srbije.",

  keywords: [
    "watch shop",
    "watch store",
    "muški satovi",
    "ženski satovi",
    "ručni satovi",
    "kupovina satova",
    "satovi Srbija",
    "elegantni muški satovi",
    "elegantni ženski satovi",
    "modni satovi",
    "premium satovi",
    "satovi online",
    "narukvice",
    "ogrlice",
    "novčanici",
    "WATCH STORE",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "sr_RS",
    url: "https://watchstore.rs",
    siteName: "WATCH STORE",
    title: "WATCH STORE | Muški i ženski ručni satovi",
    description:
      "Otkrijte kolekciju muških i ženskih ručnih satova. Pronađite sat koji odgovara vašem stilu.",
    images: [
      {
        url: "/images/hero-watch.png",
        width: 1200,
        height: 630,
        alt: "WATCH STORE – muški i ženski ručni satovi",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "WATCH STORE | Muški i ženski ručni satovi",
    description:
      "Otkrijte kolekciju muških i ženskih ručnih satova u WATCH STORE-u.",
    images: ["/images/hero-watch.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  verification: {
    google: "GoGcL66qUqShFA1qXMtp7AkJ0mGMu7f1MG5D06ZIpIU",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="sr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <WishlistProvider>
            <ScrollReveal>{children}</ScrollReveal>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}