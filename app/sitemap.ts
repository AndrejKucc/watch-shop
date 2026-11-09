import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

const BASE_URL = "https://watchstore.rs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/satovi`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/narukvice`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ogrlice`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/novcanici`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pokloni`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const products = await getProducts();

    const productPages: MetadataRoute.Sitemap = products
      .filter((product) => product.id !== undefined && product.id !== null)
      .map((product) => ({
        url: `${BASE_URL}/product/${product.id}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : product.created_at
            ? new Date(product.created_at)
            : undefined,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error("Sitemap product loading error:", error);
    return staticPages;
  }
}