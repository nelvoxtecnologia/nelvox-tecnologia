import { CITY, EMAIL, META, SITE_URL, STATE, WHATSAPP_NUMBER } from "@/content/site";

/* ===== DADOS ESTRUTURADOS ===== */
/**
 * Schema.org ProfessionalService — é o que permite ao Google entender
 * que existe um negócio real atendendo uma região específica, e é a
 * peça que faz diferença em busca local.
 *
 * Deliberadamente ausentes: aggregateRating e review. Não há avaliações
 * reais para declarar, e schema inventado é penalizado pelo Google além
 * de ser afirmação publicitária falsa sob o CDC.
 *
 * areaServed em vez de address: a Nelvox atende a região, e o endereço
 * físico não é publicado no site.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Nelvox",
    description: META.description,
    url: SITE_URL,
    email: EMAIL,
    image: `${SITE_URL}/brand/wordmark_nelvox_gold_navy.png`,
    slogan: "Presença com intenção.",
    areaServed: {
      "@type": "City",
      name: CITY,
      addressRegion: STATE,
      addressCountry: "BR",
    },
    knowsLanguage: "pt-BR",
    ...(WHATSAPP_NUMBER
      ? { sameAs: [`https://wa.me/${WHATSAPP_NUMBER}`] }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      /* Escapa "<" para que nenhum valor consiga fechar a tag </script>
         (recomendação do guia json-ld do Next.js). */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
