# Mapa do repositório (Fase 0)

Branch `seo-geo`, a partir de `5f40095` (ver `estado.md`). Todos os caminhos são relativos à raiz.

## Stack e publicação

| Item | Valor | Onde |
|---|---|---|
| Framework | **Next.js 16.3.6**, React 19.2 (o roteiro dizia Next 14) | `package.json` |
| Modo de saída | **Servidor Node** (`next start`); **não** usa `output: 'export'` | `next.config.ts` (sem a chave `output`) |
| Bundler no build | webpack (`next build --webpack`); Turbopack falha no PostCSS da Hostinger | `package.json` `build` |
| CSS | Tailwind 4; `experimental.inlineCss: true` (CSS dentro do HTML) | `next.config.ts:65` |
| Redirecionamentos | só `/origem` e `/privacidade` (301); **não há www → apex** | `next.config.ts:72` |
| Branch de produção | `master` (o roteiro dizia `main`) | `git branch -a` |

Redirecionamento www → apex: como o modo é servidor, `redirects()` com `has: [{ type: 'host', ... }]` funciona (Fase 1).

## Onde está cada coisa

| Assunto | Arquivo | Observação |
|---|---|---|
| Metadata raiz | `src/app/layout.tsx:15-35` | `metadataBase`, `title: META.title` (sem `title.template`), `keywords: META.keywords`, `alternates.canonical: "/"`, OG e Twitter próprios |
| Metadata por rota | `src/lib/seo/metadata.ts` (`pageMetadata`) e `export const metadata` em cada `page.tsx` | OG com imagem e Twitter completos nas internas; textos em `PAGE_META` (`src/content/site.ts`) |
| JSON-LD | `src/lib/seo/schema.ts` + `src/components/seo/JsonLd.tsx` | `@graph` `ProfessionalService` (`#empresa`) + `WebSite` (`#site`), renderizado no `<head>` do layout (todas as rotas) |
| Sitemap | `src/app/sitemap.ts` | 5 URLs, `lastModified` em strings manuais (não usa `new Date()`) |
| Robots | `src/app/robots.ts` | `allow: "/"` + `sitemap` |
| `llms.txt` | `public/llms.txt` | arquivo estático |
| Imagens de marca | `public/brand/*`, `src/app/{icon,apple-icon,opengraph-image}.png` | OG de 1200×630 já existe; **não há manifest** (`/manifest.webmanifest` e `/manifest.json` dão 404) |
| Hero (Cena 1) | `src/components/scenes/SceneHero.tsx` | bloco de texto sempre no HTML, com `invisible` até o farol acender (`lit`) |
| Farol | `src/components/farol/Farol.tsx` | posição/escala por `window.innerHeight`; botão "TOQUE NO FAROL" |
| Texto animado por palavra | `src/components/ui/RichText.tsx` (modo `reveal`) | usos: `SceneHero.tsx` (`fog`) e `SceneMission.tsx` (`mission`); o espaço entre palavras é nó de texto real |
| Cards do Método | `src/components/scenes/NicheCard.tsx:107`, `SceneMethod.tsx:14` | saem do servidor com `opacity:0` (`visible ? 1 : 0`); revelados por JS |
| Preloader | `src/components/preloader/Preloader.tsx` | `inert` aplicado só no cliente em `header, #conteudo, footer` (linha 80) e removido em `release()`; com `prefers-reduced-motion` não bloqueia |
| `inert` do menu mobile | `src/components/layout/Header.tsx:195` | `inert={!isMenuOpen}` no painel fechado |
| Diálogo de cookies | `src/components/consent/ConsentPreferences.tsx:53` | `<dialog aria-label=...>` com `<h2>` na linha 62: **é o `h2` que aparece no HTML do servidor** |
| Banner de cookies | `src/components/consent/ConsentBanner.tsx` | botões Aceitar (preenchido) e Recusar (contorno) |
| Rastreamento | `src/components/consent/Tracking.tsx` | IDs por `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_META_PIXEL_ID`; Consent Mode `default` inline na linha 97; GA só com `consent.analytics` (linha 103) |
| Consentimento | `src/lib/consent.ts` | chave `nelvox:consent` no `localStorage`, `CONSENT_VERSION = 1` |
| Planos | `PLANS` e `PLANS_INTRO` em `src/content/site.ts` (~linha 337), usados por `src/components/plans/PlansContent.tsx` | dados já centralizados num módulo, mas ainda dentro de `site.ts` |
| Rodapé | `src/components/layout/Footer.tsx` | identificação, links e perfis (Instagram, Google Meu Negócio) |
| Termos | `src/app/termos-de-uso/page.tsx`, `src/lib/legal/terms.ts` | lê `docs/referencias/termos_de_uso_nelvox.md` em build |
| Skip link | `src/app/page.tsx:27` | **só na home**; as internas não têm |

## Como o conteúdo chega ao HTML

- Não há `dynamic(..., { ssr: false })` em `src/`.
- Todas as páginas são estáticas (`○` no build): o texto sai do servidor.
- O que depende de JavaScript para ficar **visível** (existe no HTML, mas escondido): o bloco do hero (`invisible`) e os 3 cards do Método (`opacity:0`). Ver `estado-verificado.md`.
