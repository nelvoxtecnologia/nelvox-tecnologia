@AGENTS.md

# Guardrails de Rastreamento e Consentimento — Nelvox (v1.0, setembro de 2026)

Obrigatórios ao implementar ou alterar GA4, Meta Pixel ou qualquer script de terceiro. O
site da Nelvox tem banner de cookies compatível com a LGPD; GA4 e Meta Pixel **não são
scripts neutros**, e instalá-los fora do fluxo de consentimento contraria o que a Nelvox
promete aos próprios clientes.

## Regra 1 — Nenhum disparo sem consentimento
Nenhum script de rastreamento (GA4, Meta Pixel, heatmap, pixel de terceiro) pode ser injetado
incondicionalmente no `<head>`, `layout.tsx` ou componente global, nem disparar eventos,
page views ou requisições de rede **antes** do consentimento explícito da categoria.
Mapeamento fixo (não reclassificar sem aprovação):

| Ferramenta | Categoria no banner |
|---|---|
| Google Analytics (GA4) | Análise |
| Meta Pixel / Conversions API | Marketing |
| Qualquer heatmap/gravação de sessão | Análise |

## Regra 2 — Google Consent Mode v2 obrigatório
Padrão ao carregar a página, **antes** de qualquer interação com o banner:
`gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'})`.
Só vira `granted` na categoria correspondente após "Aceitar" ou "Configurar" com ela marcada.
"Recusar" mantém tudo `denied`. (Implementado em `src/components/consent/Tracking.tsx`.)

## Regra 3 — Proibições explícitas
- Checkbox de consentimento pré-marcada.
- Script de tracking condicionado só a "usuário fechou o banner" (sem checar a opção escolhida).
- Dado pessoal nominal (nome, telefone, e-mail, IP não anonimizado) enviado a serviço de IA
  externo via evento de analytics, sem anonimização prévia.

## Regra 4 — Antes de adicionar qualquer novo script de terceiro
Responder por escrito: (1) processa dado pessoal? (2) em qual categoria do banner se encaixa?
(3) o consentimento dessa categoria já está mapeado no Consent Mode? Se qualquer resposta for
incerta, **parar e perguntar ao Douglas** — não presumir.

## Regra 5 — CHANGELOG.md obrigatório
Toda alteração em arquivo que toque tracking/consentimento (layout, banner, componente de
consent, scripts de terceiro) gera entrada no `CHANGELOG.md` com: `Alteração`, `Responsável`,
`Impacto LGPD`. Sem a entrada, a tarefa não está concluída.

## Regra 6 — Validação antes de considerar pronto
Testar os dois fluxos: **Recusar** → nenhuma requisição para `google-analytics.com`,
`googletagmanager.com` ou `facebook.com/tr`; **Aceitar** → GA4 e/ou Meta Pixel disparam
normalmente. Só reportar como concluído depois de confirmar os dois.
