/* ===================================================================
   CONTEÚDO DO SITE
   ===================================================================
   Todo o texto vive aqui para poder ser revisado sem abrir JSX.

   Restrições de conteúdo que não podem ser violadas (o site é peça de
   publicidade e, sob o CDC Art. 30 e 37, publicidade vincula o
   fornecedor — afirmar o que não se entrega é risco jurídico real):

     - Nada sobre IA, automação, plataformas ou SaaS.
     - Nenhum case, depoimento, logo de cliente ou número de projetos.
     - Nenhuma promessa de ROI, faturamento ou resultado financeiro.
     - Fala com o dono do negócio em "você", nunca em terceira pessoa
       corporativa.
     - Sem emoji.
   =================================================================== */

/** Número comercial, formato internacional apenas com dígitos. */
export const WHATSAPP_NUMBER = "5573998313910";

export const EMAIL = "contato@nelvox.com.br";
export const SITE_URL = "https://nelvox.com.br";
export const CITY = "Porto Seguro";
export const STATE = "BA";

/** Mensagem que já vem digitada ao abrir a conversa. */
const WHATSAPP_GREETING =
  "Olá! Vim pelo site da Nelvox e queria conversar sobre presença digital.";

/**
 * Destino dos CTAs. Cai para e-mail enquanto o WhatsApp não estiver
 * configurado, para que nenhum botão do site leve a lugar nenhum.
 */
export function contactHref(): string {
  if (WHATSAPP_NUMBER) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
  }
  return `mailto:${EMAIL}?subject=${encodeURIComponent("Contato pelo site")}`;
}

/**
 * Headline no padrão expressivo da marca: Cormorant Light com
 * exatamente uma palavra final em Italic + Gold. O tipo separa as duas
 * partes para que a regra "máximo uma palavra" seja estrutural, e não
 * uma convenção que se perde na próxima edição.
 */
export type Headline = {
  /** Tudo que vem antes, em Papel. */
  lead: string;
  /** A palavra final, em Italic + Gold. Uma só. */
  accent: string;
};

/* ===== NAVEGAÇÃO ===== */
/* Só existem itens que apontam para seções reais desta página.
   "Sobre" é âncora para "O que fazemos" — não há página Sobre. */
export const NAV_ITEMS = [
  /* A ordem segue a ordem física das seções na página: "Sobre" aponta
     para O que fazemos, que vem antes do Método. Invertida, a navegação
     mandava o leitor para baixo e depois para cima. */
  { label: "Sobre", href: "#o-que-fazemos" },
  { label: "Método", href: "#metodo" },
  { label: "Contato", href: "#contato" },
] as const;

export const NAV_CTA = "Falar com a gente";

/* ===== HERO ===== */
export const HERO = {
  eyebrow: "Presença digital com método",
  headline: {
    lead: "Quem procura por você precisa te",
    accent: "encontrar.",
  } satisfies Headline,
  body:
    "Seu negócio pode ser muito bom e ainda assim não aparecer para quem " +
    "está procurando agora. A gente constrói essa presença com você — com " +
    "método, e sem atalho.",
  tagline: "Presença com intenção.",
  cta: "Vamos conversar",
  scrollHint: "Role para conhecer",
};

/* ===== O QUE FAZEMOS ===== */
export const WHAT_WE_DO = {
  eyebrow: "O que fazemos",
  headline: {
    lead: "Presença digital construída com",
    accent: "intenção.",
  } satisfies Headline,
  body:
    "Não é publicar um site e torcer. É entender o seu negócio antes de " +
    "propor qualquer coisa, e então construir uma base que aguenta crescer.",
  items: [
    {
      title: "Site",
      description:
        "O lugar onde o seu negócio existe de verdade na internet — rápido, " +
        "claro e feito para ser encontrado.",
    },
    {
      title: "Posicionamento",
      description:
        "O que você faz, para quem, e por que alguém deveria escolher você. " +
        "Dito de forma que qualquer pessoa entenda.",
    },
    {
      title: "Estrutura técnica",
      description:
        "Base sólida por baixo: desempenho, acessibilidade e organização " +
        "para buscas. O que não aparece, mas sustenta o que aparece.",
    },
    {
      title: "Cuidado com dados",
      description:
        "Dados tratados dentro das boas práticas desde o primeiro contato, " +
        "não como um ajuste de última hora.",
    },
  ],
};

/* ===== MÉTODO ===== */
export const METHOD = {
  eyebrow: "Método",
  headline: {
    lead: "Quatro escolhas que guiam tudo que a gente",
    accent: "entrega.",
  } satisfies Headline,
  items: [
    {
      number: "01",
      title: "Simplicidade técnica",
      description:
        "Cada escolha técnica tem um critério por trás. Nada entra por " +
        "moda — entra porque resolve o seu problema e porque foi pensado " +
        "para durar.",
    },
    {
      number: "02",
      title: "Conformidade desde o início",
      description:
        "Dados tratados com cuidado e dentro das boas práticas desde o " +
        "primeiro contato. Não é um capítulo final do projeto, é o começo.",
    },
    {
      number: "03",
      title: "Atendimento direto",
      description:
        "Você fala com quem decide. Os sócios acompanham o projeto do " +
        "início ao fim, sem camada de intermediário no meio do caminho.",
    },
    {
      number: "04",
      title: "Intenção, não genérico",
      description:
        "Cada presença é construída para o negócio específico. Nunca um " +
        "modelo replicado com o nome trocado.",
    },
  ],
};

/* ===== MOMENTO TIPOGRÁFICO ===== */
/* Quebra deliberada do ritmo das seções: a tagline da marca em escala
   dramática (120px+), única vez em que a tipografia domina a tela. */
export const TYPOGRAPHIC_MOMENT = {
  headline: {
    lead: "Presença com",
    accent: "intenção.",
  } satisfies Headline,
  support:
    "É isso que a gente entrega. Não visibilidade a qualquer custo — " +
    "presença construída de propósito.",
};

/* ===== CTA FINAL ===== */
export const CTA_SECTION = {
  eyebrow: "Contato",
  headline: {
    lead: "Vamos construir isso",
    accent: "juntos.",
  } satisfies Headline,
  body:
    "Conta o que você faz e onde está travando. A primeira conversa é para " +
    "entender o seu negócio — sem compromisso e sem proposta pronta.",
  cta: "Vamos conversar",
};

/* ===== FOOTER ===== */
export const FOOTER = {
  tagline: "Presença com intenção.",
  copyright: `© 2026 Nelvox · ${CITY}, ${STATE}`,
};

/* ===== METADADOS ===== */
export const META = {
  title: "Nelvox — Presença digital para quem precisa ser encontrado",
  description:
    "Software house em Porto Seguro, BA. Construímos a presença digital do " +
    "seu negócio com método: site, posicionamento e estrutura técnica sólida.",
  siteName: "Nelvox",
};
