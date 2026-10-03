import {
  CITY,
  EMAIL,
  FOUNDER_NAME,
  GMB_URL,
  INSTAGRAM_URL,
  LEGAL_CNPJ,
  LEGAL_NAME,
  LINKEDIN_URL,
  PHONE_E164,
  POSTAL_CODE,
  SITE_DESCRIPTION,
  SITE_URL,
  SLOGAN,
  STATE,
  STREET_ADDRESS,
} from "@/content/site";

/* ===== DADOS ESTRUTURADOS (schema.org) =====
   Montado só a partir de src/content/site.ts (fatos oficiais). Campo vazio = a chave some:
   `prune` remove "", null, undefined e objetos/listas que ficariam vazios.

   Deliberadamente ausentes: aggregateRating, review e priceRange (não há avaliações reais a
   declarar e schema inventado é penalizado).

   `logo`: símbolo com fundo transparente (public/brand/simbolo_nelvox.png, gerado do SVG). Atenção:
   o símbolo é bege claro e o Google exibe logos sobre branco, então ele aparece pálido. Se isso
   incomodar, trocar por um PNG com fundo escuro, como simbolo_nelvox_gold_navy.png. */

type Json = string | number | boolean | null | undefined | Json[] | { [key: string]: Json };

function prune(value: Json): Json {
  if (Array.isArray(value)) {
    const items = value.map(prune).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, prune(item)] as const)
      .filter(([, item]) => item !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return value;
}

const EMPRESA_ID = `${SITE_URL}/#empresa`;
const SITE_ID = `${SITE_URL}/#site`;

export const schema = prune({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": EMPRESA_ID,
      name: "Nelvox",
      legalName: LEGAL_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/simbolo_nelvox.png`,
      image: `${SITE_URL}/opengraph-image.png`,
      description: SITE_DESCRIPTION,
      slogan: SLOGAN,
      taxID: LEGAL_CNPJ,
      email: EMAIL,
      telephone: PHONE_E164,
      address: {
        "@type": "PostalAddress",
        streetAddress: STREET_ADDRESS,
        postalCode: POSTAL_CODE,
        addressLocality: CITY,
        addressRegion: STATE,
        addressCountry: "BR",
      },
      areaServed: [
        { "@type": "City", name: CITY },
        { "@type": "Country", name: "Brasil" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      founder: { "@type": "Person", name: FOUNDER_NAME },
      sameAs: [INSTAGRAM_URL, GMB_URL, LINKEDIN_URL],
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      url: SITE_URL,
      name: "Nelvox",
      inLanguage: "pt-BR",
      publisher: { "@id": EMPRESA_ID },
    },
  ],
});
