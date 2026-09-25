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

   Marcação leve dentro das strings, interpretada por RichText:
     - `*trecho*` vira itálico em Gold (a única ênfase da marca).
     - `\n` vira quebra de linha.
   =================================================================== */

/** Número comercial, formato internacional apenas com dígitos. */
export const WHATSAPP_NUMBER = "5573998313910";

export const EMAIL = "contato@nelvox.com.br";
export const SITE_URL = "https://nelvox.com.br";
export const CITY = "Porto Seguro";
export const STATE = "BA";

/* ===== DADOS DO CONTROLADOR (LGPD) =====
   Razão social e CNPJ confirmados (MEI). O endereço é residencial e por isso
   NÃO é publicado: a política mostra só a cidade. Ainda a confirmar (aparecem
   com destaque tracejado e o build avisa): nome do encarregado (DPO) e o prazo
   de guarda das conversas ([12 meses]) — ver PRIVACY abaixo. */
export const LEGAL_NAME = "66.105.997 DOUGLAS BARBOSA ALVES";
export const LEGAL_CNPJ = "66.105.997/0001-52";
export const DPO_NAME = "[Nome do encarregado]";
/** Contato para pedidos da LGPD (seção 13 da política). */
export const PRIVACY_EMAIL = EMAIL;

/** Mensagem que já vem digitada ao abrir a conversa. */
const WHATSAPP_GREETING =
  "Olá! Vim pelo site e queria entender onde está a luz que falta no meu negócio.";

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

/* ===== NAVEGAÇÃO ===== */
export const NAV_ORIGEM_HREF = "/origem";
export const NAV_ORIGEM_LABEL = "Quem somos";
export const NAV_CTA = "Falar com a Nelvox";

export const NAV_ITEMS = [{ label: NAV_ORIGEM_LABEL, href: NAV_ORIGEM_HREF }] as const;

export const FOOTER_LINKS = {
  quemSomos: { label: NAV_ORIGEM_LABEL, href: NAV_ORIGEM_HREF },
  privacidade: { label: "Política de privacidade", href: "/privacidade" },
  /** `href: null` sinaliza que o link abre o diálogo de preferências, não navega. */
  preferenciasCookies: { label: "Preferências de cookies", href: null },
} as const;

/* ===== CENAS DA HOME ===== */
export const SCENES = {
  heroOff: {
    hint: "TOQUE NO FAROL",
    ariaLabel: "Acender o farol",
  },

  heroOn: {
    eyebrow: "01 · Porto Seguro, BA",
    headline: "Todo porto precisa\nde *uma luz*.",
    body:
      "Um negócio sem presença digital é como um porto sem farol: quem está " +
      "navegando não consegue enxergar de longe. Nós construímos a luz — e " +
      "mantemos acesa.",
    scrollHint: "Role para conhecer",
  },

  problema: {
    eyebrow: "02 · O problema",
    headline: "Existem negócios\nque *ninguém enxerga*\nno mar digital.",
    body:
      "Quem procura uma clínica, um passeio ou uma loja do bairro começa " +
      "pelo celular. Se o seu negócio não aparece ali, para essa pessoa " +
      "ele não existe.",
  },

  solucao: {
    eyebrow: "03 · A solução",
    headline: "Colocamos a\n*luz certa*,\nno lugar certo.",
    body:
      "Site, Google Meu Negócio e Instagram trabalhando juntos — cada um " +
      "calibrado para quem você quer atrair.",
  },

  metodo: {
    eyebrow: "04 · Método",
    headline: "Cada farol tem\n*um feixe* calibrado.",
    body:
      "Paciente, turista e cliente do bairro procuram de jeitos " +
      "diferentes. Por isso a luz de cada um é calibrada à parte.",
    /* Cada card: `clipPath` + `gradient` desenham o feixe; `dots` são os
       pontos-alvo em [esquerda, topo em px, tom] — "bright"/"gold" estão
       acesos dentro do feixe, "off" ficam apagados fora dele. */
    cards: [
      {
        id: "saude",
        clipPath: "polygon(46px 50%, 62% 40%, 62% 60%)",
        gradient: "linear-gradient(90deg, rgba(240,223,184,.6), rgba(200,179,138,.18) 40%, rgba(200,179,138,0) 62%)",
        dots: [["44%",48,"bright"],["51%",54,"bright"],["56%",45,"bright"],["59%",52,"bright"],["72%",24,"off"],["84%",72,"off"],["91%",38,"off"],["30%",86,"off"]],
        clipPathMobile: "polygon(30px 50%, 62% 40%, 62% 60%)",
        dotsMobile: [["46%",37,"bright"],["53%",42,"bright"],["58%",36,"bright"],["76%",18,"off"],["88%",58,"off"]],
        eyebrow: "Feixe estreito · alcance local",
        title: "Saúde",
        audience:
          "Clínicas, consultórios e profissionais de saúde. O paciente " +
          "precisa confiar antes mesmo de ligar.",
        lines: [
          { label: "Site", text: "Claro, rápido, com especialidades e contato direto." },
          { label: "Google", text: "Ficha completa: horários, rota e avaliações." },
          { label: "Instagram", text: "Credibilidade antes da estética." },
        ],
      },
      {
        id: "turismo",
        clipPath: "polygon(46px 50%, 100% 6%, 100% 94%)",
        gradient: "linear-gradient(90deg, rgba(240,223,184,.5), rgba(200,179,138,.14) 45%, rgba(200,179,138,0) 100%)",
        dots: [["38%",56,"bright"],["52%",34,"bright"],["63%",72,"bright"],["74%",26,"gold"],["84%",62,"gold"],["93%",16,"gold"],["95%",84,"gold"],["24%",16,"off"],["30%",88,"off"]],
        clipPathMobile: "polygon(30px 50%, 100% 6%, 100% 94%)",
        dotsMobile: [["40%",44,"bright"],["55%",26,"bright"],["66%",56,"bright"],["80%",18,"gold"],["90%",64,"gold"],["26%",12,"off"]],
        eyebrow: "Feixe amplo · alcance de quem viaja",
        title: "Turismo",
        audience:
          "Pousadas, receptivos e passeios. O turista decide antes de " +
          "chegar — e decide pelo que encontra.",
        lines: [
          { label: "Site", text: "Mostra o lugar como ele é." },
          { label: "Google", text: "Fotos, rota e avaliações que ajudam a decidir." },
          { label: "Instagram", text: "Vitrine para quem ainda está planejando." },
        ],
      },
      {
        id: "negocios-locais",
        clipPath: "polygon(46px 50%, 80% 26%, 80% 74%)",
        gradient: "linear-gradient(90deg, rgba(240,223,184,.55), rgba(200,179,138,.16) 42%, rgba(200,179,138,0) 80%)",
        dots: [["40%",44,"bright"],["52%",60,"bright"],["62%",36,"bright"],["72%",62,"gold"],["88%",20,"off"],["92%",80,"off"]],
        clipPathMobile: "polygon(30px 50%, 80% 26%, 80% 74%)",
        dotsMobile: [["42%",34,"bright"],["55%",46,"bright"],["66%",28,"bright"],["74%",48,"gold"],["90%",14,"off"]],
        eyebrow: "Feixe médio · alcance da cidade",
        title: "Negócios Locais",
        audience:
          "Comércios, serviços e profissionais que também precisam ser " +
          "encontrados por quem já está procurando — o mesmo método, " +
          "para qualquer negócio da cidade.",
        lines: [
          { label: "Site", text: "Serviços, preços e contato em um só lugar." },
          { label: "Google", text: "Aparecer em \"perto de mim\", com horário e rota." },
          { label: "Instagram", text: "Presença constante para quem é da cidade." },
        ],
      },
    ],
  },

  missao: {
    eyebrow: "05 · Missão",
    text:
      "Construir a presença digital de empresas com *método* e *precisão* " +
      "— para que o cliente certo encontre nossos clientes antes do " +
      "concorrente.",
  },

  cta: {
    eyebrow: "06 · Conversa",
    headline: "Ainda navegando\n*no escuro*?",
    body:
      "Uma conversa de 15 minutos já mostra onde está a luz que falta no " +
      "seu negócio. Sem compromisso.",
    cta: NAV_CTA,
    caption: "Abre uma conversa no WhatsApp",
  },
} as const;

/* ===== RODAPÉ (Footer.tsx) ===== */
export const FOOTER = {
  tagline: "Presença com intenção.",
  copyright: `Nelvox · ${CITY}, ${STATE}`,
};

/* ===== PÁGINA /ORIGEM ===== */
export const ORIGEM = {
  eyebrowBloco1: "Por que um farol",
  headline: "Isso não é um efeito bonito. É a nossa tese.",
  bloco1: [
    "Porto Seguro significa, literalmente, porto seguro — o lugar onde " +
      "os navios chegam sem se perder. Um negócio sem presença digital é " +
      "um porto sem farol: existe, tem estrutura, tem gente trabalhando " +
      "dentro dele, mas quem está navegando lá fora não enxerga de longe.",
    "A gente não constrói o navio do cliente — o negócio dele já existe, " +
      "já funciona, já tem valor. O que a gente constrói é a luz. E luz " +
      "não é sorte, não é sair postando no Instagram esperando o " +
      "algoritmo favorecer: é método. É saber onde posicionar o farol, " +
      "com que intensidade, pra que feixe alcance exatamente quem já " +
      "estava procurando por aquilo — não todo mundo, não qualquer um, a " +
      "pessoa certa.",
    "Por isso o farol no nosso site não acende sozinho. Ele espera um " +
      "clique — uma decisão. Porque presença digital também não acontece " +
      "sozinha: alguém decide construí-la, com intenção, e a partir daí " +
      "ela precisa continuar acesa. Não é ligar e esquecer. É por isso " +
      "que, depois de aceso, o farol nunca desaparece da tela: ele fica " +
      "ali, girando, baixinho, atrás de tudo — porque presença não é " +
      "evento único, é manutenção constante. É o mesmo motivo pelo qual " +
      "a Nelvox não vende só um site: vende a luz continuando acesa, mês " +
      "após mês.",
    "Presença com intenção não é nossa tagline. É a única forma que a " +
      "gente conhece de fazer isso funcionar de verdade.",
  ],
  eyebrowBloco2: "Como nascemos",
  bloco2: [
    "Antes da Nelvox, eu dirigia. Ainda dirijo, às vezes. Uma coisa fica " +
      "clara rápido nesse trabalho: seu tempo é o teto do seu ganho. Não " +
      "tem outro jeito de crescer.",
    "Isso não é novo pra mim. Desde adolescente eu testava caminhos pra " +
      "sair desse teto — inclusive tentei empreender com uma marca de " +
      "roupa. Não foi a vez certa, mas cada tentativa foi me aproximando " +
      "de alguma coisa. Entre uma e outra, comecei a estudar " +
      "programação, meio sem saber onde isso ia dar.",
    "Surgiu a oportunidade de criar um sistema pra uma empresa que " +
      "trabalhava limpando nome. Não fechou. Apareceram outras portas, " +
      "também não fecharam. Até que surgiu a oportunidade de criar o " +
      "site de uma empresa aqui do Brasil — a Quality. Foi o pontapé " +
      "inicial. A Nelvox nasceu ali, sem cerimônia, como resposta a uma " +
      "pergunta que eu já vinha fazendo há anos: como construir algo que " +
      "não dependesse só de mim rodando o dia inteiro pra existir?",
    "Ao longo do caminho, outras pessoas entraram e saíram. O método " +
      "ficou.",
    "Hoje é essa mesma pergunta que eu respondo pra cada cliente que " +
      "chega até aqui: seu negócio não devia depender só do seu esforço " +
      "bruto pra ser visto. Por isso a Nelvox constrói a luz — pra que " +
      "ela continue acesa mesmo quando você não está empurrando ela " +
      "sozinho.",
  ],
};

/* ===== POLÍTICA DE PRIVACIDADE (/privacidade) =====
   Texto vindo do Claude Design (docs/design-handoff — "Politica de
   Privacidade.dc.html"). Qualquer trecho entre [colchetes] é um dado ainda
   não confirmado: a página o mostra destacado (tracejado dourado) e o build
   emite um aviso — preencher e revisar juridicamente antes de publicar ou
   rodar anúncios. Layout: src/components/privacy/PrivacyContent.tsx. */
export const PRIVACY = {
  eyebrow: "Privacidade · LGPD",
  headline: "Política de *privacidade*",
  metaTitle: "Política de Privacidade",
  metaDescription:
    "Quais dados o site da Nelvox coleta, por quê, e como você pode exercer seus direitos pela LGPD.",
  intro:
    "Um farol só funciona se as pessoas confiam nele. Esta página explica, com clareza, " +
    "quais dados o site da Nelvox coleta, por que coleta e o que você pode fazer com eles, " +
    "conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
  updatedAt: "24 de setembro de 2026",
  tocLabel: "Nesta página",
  /** A ordem daqui é a do índice e a da numeração (01, 02…) na página. */
  titles: [
    "Quem somos",
    "Quais dados coletamos",
    "Para que usamos",
    "Bases legais",
    "Cookies",
    "Com quem compartilhamos",
    "Transferência internacional",
    "Por quanto tempo guardamos",
    "Seus *direitos*",
    "Segurança",
    "Crianças e adolescentes",
    "Alterações nesta política",
    "Fale com o *encarregado*",
  ],

  quemSomos: {
    lead: "A Nelvox é responsável (controladora) pelos dados pessoais tratados neste site.",
    rows: [
      { label: "Razão social", value: LEGAL_NAME },
      { label: "CNPJ", value: LEGAL_CNPJ },
      { label: "Cidade", value: `${CITY} — ${STATE}` },
      { label: "Contato", value: PRIVACY_EMAIL },
    ],
  },

  dados: {
    lead: "Coletamos o mínimo necessário. Não há cadastro nem formulário neste site: o contato acontece pelo WhatsApp.",
    cards: [
      {
        title: "Dados que você nos envia",
        text:
          "Ao falar conosco pelo WhatsApp: nome, número de telefone, o conteúdo das mensagens e " +
          "informações sobre o seu negócio que você decidir compartilhar.",
      },
      {
        title: "Dados de navegação",
        text:
          "Endereço IP, tipo de dispositivo e navegador, páginas visitadas, tempo de visita e a " +
          "origem do acesso (por exemplo, uma busca no Google).",
      },
      {
        title: "Cookies",
        text: "Pequenos arquivos guardados no seu navegador. Os detalhes estão na",
        link: { label: "seção 05", href: "#s5" },
      },
    ],
  },

  usos: {
    items: [
      { icon: "chat", text: "Responder o seu contato e entender a necessidade do seu negócio." },
      { icon: "file", text: "Preparar propostas e prestar os serviços contratados." },
      { icon: "chart", text: "Medir, de forma agregada, como o site é usado, para melhorá-lo." },
      { icon: "shield", text: "Manter o site seguro e cumprir obrigações legais." },
    ],
    strong: "Não vendemos seus dados.",
    rest: "Também não os usamos para decisões automatizadas que afetem você.",
  },

  bases: {
    lead: "Cada tratamento se apoia em uma hipótese do art. 7º da LGPD:",
    rows: [
      { term: "Consentimento", text: "Cookies de análise e de marketing." },
      { term: "Procedimentos de contrato", text: "Conversas, propostas e a prestação do serviço." },
      { term: "Legítimo interesse", text: "Segurança do site e cookies estritamente necessários." },
      {
        term: "Obrigação legal",
        text: "Registros exigidos por lei, como o Marco Civil da Internet e a legislação fiscal.",
      },
    ],
  },

  cookies: {
    lead:
      "Só os cookies necessários ficam ativos por padrão. Os de análise e de marketing dependem " +
      "da sua escolha no aviso de cookies, que você pode mudar a qualquer momento.",
    cards: [
      {
        title: "Necessários",
        badge: { label: "Sempre ativos", filled: true },
        text: "Fazem o site funcionar e guardam sua escolha sobre cookies.",
        meta: "nelvox:consent · Nelvox (armazenamento local do navegador, não é cookie) · até você limpar os dados do navegador",
      },
      {
        title: "Análise",
        badge: { label: "Com consentimento", filled: false },
        text: "Mostram, de forma agregada, quais páginas são visitadas e de onde vêm os visitantes.",
        meta: "_ga, _ga_* · Google Analytics · até 2 anos",
      },
      {
        title: "Marketing",
        badge: { label: "Com consentimento", filled: false },
        text: "Ajudam a medir anúncios e a mostrar conteúdo relevante em outras plataformas.",
        meta: "_fbp, _fbc, fr · Meta · até 3 meses",
      },
    ],
    manage: "Gerenciar cookies",
    manageNote: "Você também pode bloquear ou apagar cookies nas configurações do seu navegador.",
  },

  compartilhamento: {
    lead: "Apenas com fornecedores necessários para operar o site e o atendimento, sempre com o mínimo de dados:",
    rows: [
      { term: "Hospedagem", text: "Hostinger — mantém o site no ar." },
      { term: "Atendimento", text: "WhatsApp (Meta) — canal das conversas." },
      { term: "Análise e anúncios", text: "Google e Meta — só se você aceitar esses cookies." },
      { term: "Autoridades", text: "Quando houver ordem judicial ou obrigação legal." },
    ],
  },

  transferencia:
    "Alguns desses fornecedores guardam dados em servidores fora do Brasil. Nesses casos, a " +
    "transferência segue o art. 33 da LGPD e acontece com empresas que oferecem garantias " +
    "adequadas de proteção.",

  retencao: {
    rows: [
      { term: "Conversas sem contrato", text: "Até [12 meses] após o último contato." },
      {
        term: "Clientes",
        text: "Durante o contrato e pelo prazo exigido pela legislação fiscal (5 anos).",
      },
      { term: "Registros de acesso", text: "6 meses, conforme o Marco Civil da Internet." },
    ],
    closing: "Depois desses prazos, os dados são apagados ou anonimizados.",
  },

  direitos: {
    lead: "Pelo art. 18 da LGPD, você pode, a qualquer momento e sem custo:",
    items: [
      "Confirmar se tratamos seus dados",
      "Acessar os dados que temos",
      "Corrigir dados incompletos ou desatualizados",
      "Pedir anonimização, bloqueio ou eliminação",
      "Levar seus dados a outro fornecedor",
      "Saber com quem compartilhamos",
      "Revogar o consentimento",
      "Reclamar à ANPD",
    ],
    before: "Basta escrever para o contato da",
    link: { label: "seção 13", href: "#s13" },
    after: "Respondemos em até 15 dias.",
  },

  seguranca:
    "O site usa conexão criptografada (HTTPS), e o acesso aos dados fica restrito a quem precisa " +
    "deles para trabalhar. Se ocorrer um incidente que traga risco a você, comunicaremos você e a ANPD.",

  criancas:
    "O site é voltado a empresas e profissionais. Não coletamos, de propósito, dados de menores de 18 anos.",

  alteracoes:
    "Quando esta política mudar, a data no topo da página será atualizada. Mudanças relevantes " +
    "serão avisadas no próprio site.",

  encarregado: {
    lead: "Dúvidas ou pedidos sobre seus dados vão direto para o nosso encarregado (DPO):",
    name: DPO_NAME,
    email: PRIVACY_EMAIL,
  },
};

/** True enquanto restar algum [dado] a confirmar na política — usado para o aviso de build. */
export const PRIVACY_HAS_PLACEHOLDER = JSON.stringify(PRIVACY).includes("[");

/* ===== METADADOS ===== */
export const META = {
  title: "Nelvox — Criação de sites e presença digital em Porto Seguro, BA",
  description:
    "Software house em Porto Seguro, BA. Criamos sites e presença digital " +
    "para clínicas, pousadas e negócios locais — com método, sem atalho.",
  /* O Google ignora a tag <meta name="keywords"> para ranqueamento desde
     2009, mas outros buscadores e ferramentas de preview ainda a leem —
     por isso ela custa pouco e não faz mal nenhum manter. O que de fato
     move o SEO aqui são os termos no title/description acima e nos H1/H2
     de cada seção (ver SCENES em site.ts), não esta lista. */
  keywords: [
    "criação de site",
    "presença digital",
    "site para clínica",
    "site para pousada",
    "Porto Seguro BA",
    "Google Meu Negócio",
    "SEO local Bahia",
  ],
  siteName: "Nelvox",
};
