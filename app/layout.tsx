import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WATCH SHOP — Premium satovi",
    template: "%s | WATCH SHOP",
  },
  description:
    "WATCH SHOP — pažljivo odabrani satovi za one koji cene kvalitet, stil i karakter.",
  keywords: [
    "satovi",
    "ručni satovi",
    "premium satovi",
    "muški satovi",
    "ženski satovi",
    "WATCH SHOP",
  ],
  verification: {
    google: "GoGcL66qUqShFA1qXMtp7AkJ0mGMu7f1MG5D06ZIpIU",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}