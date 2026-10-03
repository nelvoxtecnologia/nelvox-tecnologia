# Reconhecimento — fix/seo-fundacao (Etapa 0)

Data: 3 de outubro de 2026. Feito antes de qualquer edição, sobre o commit `93a0463` (master).
O HTML foi medido num build de produção local (`next build --webpack` + `next start`) e
conferido contra o HTML do site no ar.

## Diferenças entre o briefing e o repositório

| Briefing | Repositório |
|---|---|
| Next.js 14 | **Next.js 16.3.6**, React 19.2 (webpack no build: ver commit `c57c156`) |
| `app/` | `src/app/` (alias `@/` = `src/`) |
| Criar JSON-LD | **Já existe** `src/components/seo/JsonLd.tsx` (um `ProfessionalService` enxuto, sem `address`, `@graph` nem `WebSite`) |
| Frases animadas "coladas" no HTML | **Não ocorre no HTML servido**: ver T2 abaixo |
| Rodapé servido com `inert` | **Não ocorre no HTML servido**: ver T4 abaixo |
| `docs/referencias/termos_de_uso_nelvox.md` | Não existia. O texto foi enviado no chat e salvo sem alterações nesse caminho |

## Rotas e metadados

| Rota | Arquivo | title | description | canonical |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` + `layout.tsx` | `META.title` | `META.description` | `/` (layout) |
| `/quem-somos` | `src/app/quem-somos/page.tsx` | "Quem somos — Nelvox" | `ORIGEM.headline` ("Isso não é um efeito bonito. É a nossa tese.") | `/quem-somos` |
| `/planos` | `src/app/planos/page.tsx` | "Planos — Nelvox" | `PLANS_INTRO.intro` (~195 caracteres, acima de 155) | `/planos` |
| `/politica-de-privacidade` | `src/app/politica-de-privacidade/page.tsx` | "Política de Privacidade — Nelvox" | `PRIVACY.metaDescription` | `/politica-de-privacidade` |

- Layout raiz (`src/app/layout.tsx`): `metadataBase`, `lang="pt-BR"`, `alternates.canonical: "/"`,
  Open Graph e Twitter já definidos. `opengraph-image.png`, `icon.png` e `apple-icon.png` por convenção de arquivo.
- `JsonLd` é renderizado dentro do `<head>` do layout raiz (todas as rotas).
- `sitemap.xml`: `src/app/sitemap.ts` (4 URLs, `lastModified` manual). `robots.txt`: `src/app/robots.ts`
  (`Allow: /` + `Sitemap:`). `public/` só tem `brand/`; não há `llms.txt`.

## H1 por rota (HTML servido, medido)

| Rota | `<h1` | Observação |
|---|---|---|
| `/` | **0** | O único `h1` da home ("Todo porto precisa de uma luz.", `SceneHero.tsx`) fica dentro de `{lit && ...}`: só existe depois que o visitante clica no farol |
| `/quem-somos` | 1 | "Isso não é um efeito bonito. É a nossa tese." |
| `/planos` | 1 | `PLANS_INTRO.headline` |
| `/politica-de-privacidade` | 1 | `PRIVACY.headline` |

Hierarquia: home tem 6 `h2` e `h3` nos cards (sem `h1`); as demais rotas vão de `h1` a `h2`.

## Texto animado (split text)

- Componente: `src/components/ui/RichText.tsx`, modo `reveal`. Usos com `reveal`:
  `SceneHero.tsx:99` (`fog`, headline da Cena 1) e `SceneMission.tsx:85` (`mission`, frase da Missão).
  Os demais usos de `RichText` não dividem em palavras.
- O espaço entre as palavras **já é um nó de texto real**, irmão dos spans (`RichText.tsx`, `renderTokens`).
  HTML servido da Missão: `…Construir</span></span> <span data-mission-word=""><span>a</span></span> <span …>presença…`.
  O `textContent` do elemento é a frase correta, com espaços.
- O que **não** existe hoje: a frase contígua no HTML (há tags entre as palavras). Quem extrai texto sem
  preservar o espaço entre elementos recebe "Construirapresençadigital…" (provável origem do achado da auditoria externa).

## Rodapé e `inert`

- Rodapé: `src/components/layout/Footer.tsx` (client component), usado em `/`, `/quem-somos`, `/planos`
  e `/politica-de-privacidade`. Hoje: marca, slogan, "Nelvox · Porto Seguro, BA" e 3 itens (Quem somos,
  Preferências de cookies, Política de privacidade). Não tem Planos, Termos, CNPJ, e-mail, WhatsApp,
  horário, Instagram nem Google Meu Negócio.
- `inert` no HTML servido: **0 ocorrências** em todas as rotas (medido no build local e no site no ar).
- Origem do `inert` no código:
  - `src/components/preloader/Preloader.tsx:80`: aplica `inert` em `header, #conteudo, footer`
    **no cliente**, só enquanto a abertura roda, e remove em `release()`. Com `prefers-reduced-motion`
    a função sai antes (`signalPreloaderDone()`), então nada é bloqueado.
  - `src/components/layout/Header.tsx:195`: `inert={!isMenuOpen}` no painel do menu mobile fechado.
- Provável origem do achado: um snapshot do DOM renderizado tirado durante a abertura, quando o rodapé
  está momentaneamente `inert`.

## JSON-LD existente

`src/components/seo/JsonLd.tsx`: `ProfessionalService` com `name`, `description`, `url`, `email`, `image`
(`wordmark_nelvox_gold_navy.png`, PNG sem canal alfa), `slogan`, `areaServed`, `knowsLanguage` e
`sameAs: [wa.me]`. Sem `address`, `telephone`, `taxID`, `founder`, `openingHoursSpecification` nem `WebSite`.
Não há `aggregateRating`/`review`/`priceRange`.

## Ocorrências de termos obsoletos e vocabulário proibido (regra 5)

Busca em `src/`, `docs/`, `README.md`, `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md` por: sócio/sócios, Vagner,
Anthony, CTO, CMO, Firebase, Firestore, Mercado Pago, "IA proprietária", compre, contrate, invista,
"aumente seu faturamento", "garanto resultados", "seu negócio vai crescer".

**Nenhuma ocorrência.** (O botão "Contratar Plano" em `/planos` usa o infinitivo, que não está na lista da regra 5.)

## Logos disponíveis para o schema

| Arquivo | Canal alfa | Uso como `logo` |
|---|---|---|
| `public/brand/wordmark_nelvox_gold_navy.png` | não | descartado (fundo opaco) |
| `public/brand/wordmark_nelvox_texto_gold.png` | não | descartado (fundo opaco) |
| `public/brand/simbolo_nelvox_gold_navy.png` | não | descartado (fundo opaco) |
| `public/brand/favicon-source.png` | sim (73,7% transparente) | descartado: símbolo em bege quase branco `rgb(225,219,211)`, ilegível sobre fundo branco, que é onde o Google exibe logos |
