import { schema } from "@/lib/seo/schema";

/* ===== DADOS ESTRUTURADOS =====
   Injeta o schema.org montado em src/lib/seo/schema.ts (ProfessionalService + WebSite).
   É o que permite ao Google entender que existe um negócio real atendendo uma região
   específica — a peça que faz diferença em busca local. Ver o schema para o que ficou de fora
   de propósito (avaliações, faixa de preço, logo) e por quê. */
export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      /* Escapa "<" para que nenhum valor consiga fechar a tag </script>
         (recomendação do guia json-ld do Next.js). */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\u003c") }}
    />
  );
}
