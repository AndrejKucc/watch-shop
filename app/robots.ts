import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://watchstore.rs/sitemap.xml",
    host: "https://watchstore.rs",
  };
}