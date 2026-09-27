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
