import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/* ===== SITEMAP ===== */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/origem`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    {
      url: `${SITE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
