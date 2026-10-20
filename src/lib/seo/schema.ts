import {
  CITY,
  EMAIL,
  FOUNDER_NAME,
  GMB_URL,
  INSTAGRAM_URL,
  LEGAL_CNPJ,
  LEGAL_NAME,
  LINKEDIN_URL,
  OPENING_HOURS,
  PHONE_E164,
  POSTAL_CODE,
  SERVICE_TYPES,
  SITE_DESCRIPTION,
  SITE_URL,
  SLOGAN,
  STATE,
  STREET_ADDRESS,
} from "@/content/site";
import { PLANS, PRICES_VALID_UNTIL } from "@/content/plans";

/* ===== DADOS ESTRUTURADOS (schema.org) =====
   Montado só a partir de src/content/site.ts e src/content/plans.ts (fatos oficiais). Campo vazio =
   a chave some: `prune` remove "", null, undefined e objetos/listas que ficariam vazios. Nenhum
   preço, horário ou telefone é digitado aqui: tudo vem das constantes, e `npm run seo:check`
   confere que cada um também aparece no texto visível da página.

   Deliberadamente ausentes: aggregateRating, review e priceRange (não há avaliações reais a
   declarar e schema inventado é penalizado).

   `logo`: símbolo dourado sobre fundo azul-marinho (public/brand/simbolo_nelvox_gold_navy.png). O
   fundo escuro garante contraste: o Google exibe logos sobre branco e o símbolo transparente, em
   bege claro, ficaria pálido (public/brand/simbolo_nelvox.png/.svg seguem na pasta para outros usos). */

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
      logo: `${SITE_URL}/brand/simbolo_nelvox_gold_navy.png`,
      image: `${SITE_URL}/opengraph-image.png`,
      description: SITE_DESCRIPTION,
      slogan: SLOGAN,
      serviceType: [...SERVICE_TYPES],
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
      areaServed: `${CITY}, ${STATE}, Brasil`,
      openingHoursSpecification: OPENING_HOURS.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...h.days],
        opens: h.opens,
        closes: h.closes,
      })),
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

/**
 * Esquema por página: a própria página (WebPage, ou AboutPage em /quem-somos) e o BreadcrumbList.
 * Só em /planos entra também o catálogo de ofertas, gerado de src/content/plans.ts, no mesmo
 * `@id` da empresa (o Google junta os dois nós). Home e demais páginas não declaram preço.
 */
export function pageSchema({
  path,
  name,
  description,
  type = "WebPage",
  withOffers = false,
}: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage";
  withOffers?: boolean;
}) {
  const url = `${SITE_URL}${path}`;
  return prune({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#pagina`,
        url,
        name,
        description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": SITE_ID },
        about: { "@id": EMPRESA_ID },
        breadcrumb: { "@id": `${url}#trilha` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#trilha`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
      withOffers
        ? {
            "@type": "ProfessionalService",
            "@id": EMPRESA_ID,
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Planos Nelvox",
              itemListElement: PLANS.map((plan) => ({
                "@type": "Offer",
                "@id": `${url}#${plan.id}`,
                name: plan.name,
                url,
                priceCurrency: "BRL",
                priceValidUntil: PRICES_VALID_UNTIL,
                itemOffered: {
                  "@type": "Service",
                  name: plan.name,
                  description: plan.includes.join("; "),
                },
                priceSpecification: [
                  { "@type": "UnitPriceSpecification", name: "Setup (pagamento único)", price: plan.setupBRL, priceCurrency: "BRL" },
                  { "@type": "UnitPriceSpecification", name: "Mensalidade", price: plan.monthlyBRL, priceCurrency: "BRL", unitCode: "MON" },
                ],
              })),
            },
          }
        : undefined,
    ],
  });
}
