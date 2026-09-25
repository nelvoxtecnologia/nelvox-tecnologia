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
