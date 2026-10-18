/* ===== PLANOS (fonte única) =====
   Usado por /planos (PlansContent.tsx) e pelo JSON-LD (src/lib/seo/schema.ts): para mudar a grade
   de preços, edite SÓ este arquivo. Valores como números; o texto da tela é derivado deles, então
   a página e o schema nunca divergem. */

/* ===== PÁGINA /PLANOS =====
   Catálogo vigente (Playbook Operacional Nelvox V5.0, Parte 4 — Contrato
   V2.3, Anexo II). Só os 5 planos públicos; o rótulo interno "(high ticket)"
   do Dominação Digital não aparece aqui. Qualquer alteração de preço/escopo
   precisa vir do contrato/anexo atualizado, não só deste arquivo. */
export const PLANS_INTRO = {
  eyebrow: "Planos",
  headline: "Escolha o *tamanho* da luz.",
  intro:
    "Cada plano calibra o que fica aceso — da landing page até a presença " +
    "completa em Google e Instagram. Escolha pelo que o seu negócio precisa agora; " +
    "você pode crescer de plano quando fizer sentido.",
};

const PLANS_DATA = [
  {
    id: "essencial",
    name: "Essencial",
    setupBRL: 597,
    monthlyBRL: 397,
    slaLabel: "Resposta em até 8h úteis",
    includes: [
      "Landing page com até 5 seções",
      "SSL e hospedagem inclusos",
      "WhatsApp flutuante no site",
      "1 atualização por mês",
      "Verificação técnica mensal",
    ],
  },
  {
    id: "presenca-digital",
    name: "Presença Digital",
    setupBRL: 897,
    monthlyBRL: 897,
    slaLabel: "Resposta em até 6h úteis",
    includes: [
      "Tudo do Essencial",
      "Mapa no Google e Google Meu Negócio completo",
      "Post semanal no Google Meu Negócio",
      "Resposta às avaliações em até 48h",
      "2 atualizações por mês",
      "Relatório mensal",
    ],
  },
  {
    id: "presenca-conteudo",
    name: "Presença + Conteúdo",
    setupBRL: 1297,
    monthlyBRL: 1997,
    slaLabel: "Resposta em até 6h úteis",
    includes: [
      "Tudo do Presença Digital",
      "Gestão completa do Instagram (calendário editorial, 8 posts/mês, stories 3x por semana)",
      "3 atualizações por mês",
      "Relatório ampliado",
    ],
  },
  {
    id: "autoridade-digital",
    name: "Autoridade Digital",
    setupBRL: 1997,
    monthlyBRL: 2797,
    slaLabel: "Resposta em até 4h úteis",
    includes: [
      "Site institucional com até 7 seções",
      "Google Meu Negócio otimizado",
      "Resposta às avaliações em até 24h",
      "4 atualizações por mês",
      "12 posts por mês (com Reels) e stories em dias úteis",
      "1 página especial por trimestre",
      "Reunião estratégica mensal",
    ],
  },
  {
    id: "dominacao-digital",
    name: "Dominação Digital",
    setupBRL: 2997,
    monthlyBRL: 3997,
    slaLabel: "Resposta em até 2h úteis",
    includes: [
      "Site institucional com até 10 seções, incluindo blog",
      "Hospedagem dedicada",
      "Google Meu Negócio com otimização completa",
      "Publicação 2x por semana e resposta às avaliações em até 12h",
      "Atualizações ilimitadas",
      "20 posts por mês",
      "1 vídeo institucional e 2 páginas especiais por trimestre",
      "Relatório executivo e reunião quinzenal",
    ],
  },
] as const;

const brl = (n: number) => `R$${n.toLocaleString("pt-BR")}`;

export const PLANS = PLANS_DATA.map((plan) => ({
  ...plan,
  setup: brl(plan.setupBRL),
  monthly: `${brl(plan.monthlyBRL)}/mês`,
}));

/** Vigência dos preços (G5, informada pelo Douglas): aparece em /planos e no `priceValidUntil` do schema. */
export const PRICES_VALID_UNTIL = "2026-12-31";
export const PRICES_VALID_UNTIL_LABEL = "31 de dezembro de 2026";
