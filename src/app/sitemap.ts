import type { MetadataRoute } from "next";
import { SITE_URL, NAV_ORIGEM_HREF, NAV_PRIVACIDADE_HREF, NAV_PLANOS_HREF } from "@/content/site";

/* ===== SITEMAP =====
   lastModified é a data real da última alteração de conteúdo de cada página
   (não a data do build): `new Date()` a cada build faria o sitemap dizer que
   tudo mudou o tempo todo, o que os buscadores tendem a ignorar. Atualizar a
   data manualmente quando o conteúdo da página realmente mudar. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: "2026-09-25", changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}${NAV_ORIGEM_HREF}`,
      lastModified: "2026-09-28",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}${NAV_PRIVACIDADE_HREF}`,
      lastModified: "2026-09-28",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}${NAV_PLANOS_HREF}`,
      lastModified: "2026-09-28",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
