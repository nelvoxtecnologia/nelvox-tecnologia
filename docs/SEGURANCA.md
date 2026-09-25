# Segurança — guia KipperDev aplicado ao site Nelvox

Base: PDF "Vibe coding com segurança" (12 riscos). O site é **estático**: sem API,
sem banco, sem login, sem formulários; o contato é por link `wa.me`. Por isso a
maior parte dos riscos do guia **não se aplica** — abaixo, o que foi verificado
e o que foi feito. Hospedagem prevista: **Hostinger, plano Node.js Web App**
(`npm run build` + `npm start`).

| # | Risco | Situação | Evidência / ação |
|---|---|---|---|
| 01 | Segredos no frontend | OK | Só existem IDs públicos (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, públicos por natureza). Nenhum `.env` no histórico do git; `.gitignore` cobre `.env*`. |
| 02 | Entradas sem validação | Endurecido | Não há formulários. Única entrada do cliente: o consentimento em `localStorage`, agora validado campo a campo (`src/lib/consent.ts`, `isConsentState`). Os IDs de GA/Meta só são aceitos no formato oficial (`src/components/consent/Tracking.tsx`). |
| 03 | SQL injection | N/A | Sem banco. |
| 04 | Prompt injection | N/A | O site não usa IA em tempo de execução. |
| 05 | XSS | Endurecido | Nenhum dado de visitante chega a HTML. Os `dangerouslySetInnerHTML` são todos de constantes (`MotionScript`, `JsonLd`). JSON-LD agora escapa `<`. **CSP** ativa (abaixo). |
| 06 | IDOR / BOLA | N/A | Sem contas nem recursos por usuário. |
| 07 | SSRF | N/A | O servidor não faz requisições (sem `fetch`, route handlers ou server actions). |
| 08 | Senhas | N/A | Sem autenticação. |
| 09 | DoS / DDoS | Fora do app | Nada no app para limitar (só páginas estáticas). Proteção volumétrica e limites ficam na Hostinger/CDN. |
| 10 | Rotas administrativas | N/A | Não existem (`src/app` só tem `/`, `/origem`, `/privacidade`, `robots`, `sitemap`). |
| 11 | Bots em login/cadastro | N/A | Sem login nem cadastro. |
| 12 | Erros que vazam dados | OK | Sem tratamento de erro customizado; em produção o Next mostra páginas genéricas (sem stack). `X-Powered-By` removido. |

## O que mudou no código
- **`next` 16.2.10 → 16.3.6**: o `npm audit` acusava 1 crítica + 3 altas + 1 moderada
  (maioria no próprio Next). Agora: `found 0 vulnerabilities` (`npm audit --omit=dev`).
- **`next.config.ts`**: `poweredByHeader: false` e cabeçalhos em todas as rotas:
  CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
  (câmera/microfone/geolocalização/topics desligados) e HSTS de 2 anos
  (só em produção, sem `preload`).
- **CSP estática** (sem nonce → páginas continuam estáticas e rápidas). Libera só o
  próprio site, GA4 e Meta Pixel; `'unsafe-inline'` é necessário para o script
  inline do Next/MotionScript e para os snippets das métricas.
  Se algum dia entrar conteúdo enviado por visitantes, migrar para CSP com nonce
  (guia oficial: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`).
- **`Tracking.tsx`**: GA e Pixel só carregam com ID no formato certo **e** consentimento.
- **`JsonLd.tsx`**: escape de `<` (`<`).

## Como foi testado (local, build de produção)
- `npm audit --omit=dev` → 0 vulnerabilidades.
- `curl -I` na home: todos os cabeçalhos acima presentes; sem `X-Powered-By`.
- Navegador (Playwright) com IDs de teste, consentimento aceito: `gtag` e `fbq`
  carregam, enviam eventos, e o console fica **sem nenhuma violação de CSP**.

## Checklist para publicar na Hostinger (Node.js Web App)
1. Definir as variáveis `NEXT_PUBLIC_GA_ID` e `NEXT_PUBLIC_META_PIXEL_ID` **no painel**
   (não subir arquivo `.env`) **antes** do `npm run build` — elas são embutidas no build.
2. Node.js 20 ou superior; build: `npm run build`; start: `npm start`.
3. Forçar HTTPS no painel/domínio (o HSTS só tem efeito sobre HTTPS).
4. Depois de publicar, conferir os cabeçalhos em https://securityheaders.com e testar o
   site com o console aberto (procurar `Content Security Policy`).
5. Antes de anúncios: preencher os `[dados a confirmar]` da política de privacidade
   (ver `docs/MANUTENCAO.md`) e revisão jurídica.

## Não verificado / risco residual
- Proteção DDoS, WAF e limites de requisição dependem da Hostinger (não testados aqui).
- A CSP com `'unsafe-inline'` é menos rígida que uma com nonce; aceitável enquanto o site
  não recebe conteúdo de visitantes.
- Este ambiente é local; certificado, HTTPS e cabeçalhos da borda da Hostinger
  precisam ser conferidos em produção.
