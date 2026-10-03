# Changelog — alterações que tocam rastreamento, consentimento ou dados pessoais

Formato exigido pela Regra 5 dos guardrails (ver `CLAUDE.md`).

## 2026-09-25
- **Alteração**: Google Consent Mode v2 com padrão "tudo negado" desde o carregamento
  (`ga4-consent-default`, stub local sem requisição de rede); `consent update` a cada escolha
  (aceitar, recusar, revogar) e sinais de anúncio ligados só pela categoria Marketing.
  **Responsável**: Claude Code. **Impacto LGPD**: sim — reforça o opt-in; nada de GA4/Meta
  carrega nem faz rede antes do consentimento da categoria.
- **Alteração**: política de privacidade com razão social e CNPJ reais; endereço residencial
  omitido (só "Porto Seguro — BA"); hospedagem informada como Hostinger.
  **Responsável**: Claude Code (dados fornecidos pelo Douglas). **Impacto LGPD**: sim — identifica
  o controlador sem expor endereço residencial.
- **Alteração**: validação do formato dos IDs de GA4/Meta e do consentimento salvo no
  `localStorage`; CSP e demais cabeçalhos de segurança (`next.config.ts`).
  **Responsável**: Claude Code. **Impacto LGPD**: sim — impede que valor malformado vire
  script e limita de onde o site pode carregar/enviar dados (ver `docs/SEGURANCA.md`).

## 2026-09-27
- **Alteração**: preenchidos os dois últimos dados pendentes da política de privacidade —
  nome do encarregado (DPO) e prazo de guarda de conversas sem contrato (12 meses, sem
  colchetes). Corrigido também o aviso de build (`PRIVACY_HAS_PLACEHOLDER`), que usava
  `JSON.stringify(...).includes("[")` e por isso disparava sempre (todo array do objeto
  gera "[" no JSON, mesmo sem placeholder real); agora verifica só o texto de cada campo.
  **Responsável**: Claude Code (dados confirmados pelo Douglas). **Impacto LGPD**: sim —
  identifica o encarregado e define o prazo de retenção exigidos pela política.
- **Alteração**: revogar só a categoria Marketing (ou só Análise) no diálogo de preferências
  agora limpa os cookies daquela categoria de imediato (`_fbp`/`_fbc` ou `_ga`/`_gid`/`_gat`);
  antes, `clearTrackingCookies()` só rodava quando as duas categorias estavam negadas ao mesmo
  tempo, deixando cookies de uma categoria já revogada no navegador enquanto a outra
  permanecesse aceita. Achado em auditoria de segurança de código.
  **Responsável**: Claude Code. **Impacto LGPD**: sim — reforça a Regra 6 (revogar precisa
  zerar de fato o rastreamento daquela categoria, não só sinalizar ao SDK).

## 2026-09-28
- **Alteração**: `/origem` e `/privacidade` renomeadas para `/quem-somos` e
  `/politica-de-privacidade` (com redirect 301 das URLs antigas). O link da política no
  banner de cookies (`ConsentBanner.tsx`) deixou de ser hardcoded e passou a usar a
  constante `FOOTER_LINKS.privacidade.href`, para não desalinhar se a rota mudar de novo.
  `Tracking.tsx` só teve um comentário atualizado (rota antiga citada em texto), sem
  mudança de comportamento. `layout.tsx` passou a montar também o novo
  `WhatsappFloatingButton` (botão de WhatsApp flutuante, mobile) — mesmo padrão de
  `contactHref()`/`trackLead()` já usado nos outros CTAs, sem novo destino de dado.
  **Responsável**: Claude Code. **Impacto LGPD**: nenhum — é reorganização de rota e
  navegação; nenhum dado novo é coletado e o consentimento continua controlando os
  mesmos dois scripts (GA4/Meta) do jeito que já estava.

## 2026-09-30
- **Alteração**: banner de cookies (`ConsentBanner.tsx`) mais compacto em tablet/desktop
  (largura máxima 320px a partir de `sm`, espaçamentos internos e altura dos botões menores),
  para não cobrir a headline da Cena 1 em notebooks de tela baixa. Só estilo: textos, ordem
  dos botões ("Aceitar" e "Recusar" com o mesmo peso), lógica de gravação e leitura do
  consentimento inalteradas. Validado com IDs de teste: antes da escolha, 0 requisições a
  Google/Meta e Consent Mode com tudo `denied`; "Recusar" → 0 requisições; "Aceitar" → GA4 e
  Meta Pixel carregam (1366×641 e 390×844).
  **Responsável**: Claude Code. **Impacto LGPD**: nenhum — mesmo opt-in, mesmas opções com o
  mesmo destaque; nenhum dado novo coletado.

## 2026-10-03
- **Alteração**: branch `fix/seo-fundacao` (SEO). Rodapé (`Footer.tsx`, que abriga o botão
  "Preferências de cookies", mantido sem alteração) ganhou identificação do controlador (razão
  social, CNPJ, e-mail, WhatsApp, horário) e links para Planos, Termos de uso, Instagram e Google
  Meu Negócio (links comuns, abrem em nova aba com `rel="noopener noreferrer"`; **nenhum script de
  terceiro novo**, então a Regra 4 não se aplica). Nova página `/termos-de-uso`, com texto que cita
  Google Analytics e Meta Pixel só com consentimento e remete às "Preferências de cookies". JSON-LD
  ampliado (`src/lib/seo/schema.ts`: razão social, CNPJ, telefone, e-mail, horário, fundador,
  perfis) — são dados institucionais da empresa, sem dado pessoal de visitante. `GA4` e `Meta Pixel`,
  `Tracking.tsx`, `ConsentBanner.tsx` e o Consent Mode não foram alterados.
  **Responsável**: Claude Code. **Impacto LGPD**: sim, positivo — o controlador e o canal de
  contato passam a estar identificados em todas as páginas, e os Termos reforçam o opt-in; nenhuma
  coleta nova, nenhum script novo e nenhum disparo antes do consentimento.
