import type { Metadata } from "next";
import { META, SITE_URL, SLOGAN } from "@/content/site";

/* ===== METADADOS DAS ROTAS INTERNAS =====
   Um helper só para todas as páginas internas, porque o `openGraph` de uma página SUBSTITUI o do
   layout inteiro (imagem incluída) e o `twitter` é herdado da home se a página não definir o seu.
   Sem isto, /planos e as demais saíam sem og:image/twitter:image e com twitter:title/description
   iguais aos da home. O og:image é o mesmo de src/app/opengraph-image.png (1200×630). */

const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${META.siteName} — ${SLOGAN}`,
};

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Caminho da rota, com barra inicial. Vira o canonical e o og:url. */
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${SITE_URL}${path}`,
      siteName: META.siteName,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
