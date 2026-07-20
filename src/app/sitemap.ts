import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/* ===== SITEMAP ===== */
/** O site é uma página única, então o sitemap tem uma entrada só. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
