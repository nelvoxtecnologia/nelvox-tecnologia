# Estado verificado: confirmado ou refutado (Fase 0)

Medido em 17/10/2026. "Produção" = https://nelvox.com.br; "local" = build do branch `seo-geo` (que já inclui commits ainda **não publicados**: H1 sem legenda, logo azul-marinho, descrição nova do schema, CSS inline, Política com prospecção). Evidências em `html-producao.md`, `html-local.md`, `crawlers-producao.md`, `sem-js-e-consentimento.md` e `lighthouse.md`.

## Itens do roteiro

| # | Afirmação do roteiro | Veredito | Evidência |
|---|---|---|---|
| 1 | JSON-LD `@graph` (ProfessionalService + WebSite) em todas as páginas | **Confirmado** | 5/5 rotas |
| 2 | sameAs: Instagram + link curto `share.google` (instável) | **Confirmado** | o link resolve para uma busca do Google (`kgmid=/g/11z8dpxnz0`), não para uma URL `/maps/place/` |
| 3 | Faltam logo, image, description, slogan | **Refutado** | o JSON-LD no ar já tem `logo`, `image`, `description`, `slogan`, `taxID`, `telefone`, `horário` (PR #1) |
| 4 | Faltam serviceType, Offer em /planos, schema por página, BreadcrumbList | **Confirmado** | só o bloco global existe |
| 5 | Títulos: home 64; /planos 15; /quem-somos 19 | **Confirmado** | 64 / 15 / 19; também 32 (política) e 22 (termos). Sem `title.template`; sufixo é "— Nelvox" |
| 6 | `<meta name="keywords">` em todas as páginas | **Confirmado** | 7 termos, 5/5 rotas (`layout.tsx:18`) |
| 7 | Home: único H1 com termo buscável é uma legenda pequena que some | **Confirmado em produção**; **mudou no local** | produção: `h1` "Nelvox — criação de sites…" com `data-hero-fade`. Local: o `h1` é a headline "Todo porto precisa de uma luz.", mas dentro de um bloco `invisible` (ver "Achados novos") |
| 8 | /quem-somos: único H2 do HTML é o título do diálogo de cookies | **Confirmado** | headings: `h1` + `h2[diálogo]`; "Por que um farol" e "Como nascemos" são `<p class="eyebrow">` |
| 9 | Nenhuma `<img>` no corpo | **Confirmado** | 0 em 5/5 rotas (símbolo e farol são SVG inline) |
| 10 | og:image, twitter:image, favicon, apple-touch-icon | **Confirmado (presentes)** | og/twitter em 5/5; `icon.png` e `apple-icon.png` presentes. **Manifest: ausente** (404) |
| 11 | Sitemap com 5 URLs; lastmod reflete mudança real | **Confirmado** (5 URLs); **parcial** (lastmod) | datas são constantes manuais, não `new Date()`; precisam ser revisadas quando o conteúdo mudar |
| 12 | robots.txt: `Allow: /` + `Sitemap:` | **Confirmado** | 67 B |
| 13 | `www` responde 200 sem 301 para o apex | **Confirmado** | `https://www.nelvox.com.br/` e `/planos`: 200. `http://` → 301 para `https://` (para `http://www`, o destino é `https://www`, ainda sem ir ao apex) |
| 14 | /planos sem data de vigência nem condições da oferta | **Confirmado** | nenhuma ocorrência de vigência, permanência, reajuste, cancelamento, domínio; sem `<table>` |
| 15 | Horário: JSON-LD seg–sex 08–18; Perfil no Google também mostra sáb 9–12 | **Parcial** | JSON-LD confirmado (seg–sex 08:00–18:00). O Perfil exige login: **não verificado** |
| 16 | Consent Mode `default` "denied" inline; nada dispara antes do aceite | **Confirmado em runtime** (produção) | `dataLayer`: `default` com os 4 sinais `denied`; 0 requests de terceiros antes de qualquer clique, com o banner visível e depois de Recusar; depois de Aceitar: `googletagmanager.com/gtag/js`. Nenhum request da Meta (provável ID do Pixel não configurado em produção; **não verificado**) |
| 17 | OK: `lang="pt-BR"` | **Confirmado** | `layout.tsx:46` |
| 18 | OK: descrições da home (136) e /quem-somos (~143) | **Confirmado** | 136 e 143 |
| 19 | OK: preços de /planos iguais ao Anexo II | **Não verificado** | o Anexo II não está no repositório |
| 20 | OK: links internos acompanham o host | **Confirmado por código** | `next/link` com `href` relativo |

## Divergências entre o roteiro e o repositório (uma linha cada)

- Next.js **16**, não 14 (a documentação em `node_modules/next/dist/docs` é a que vale).
- Branch de produção é **`master`**, não `main`; ninguém fez push nela.
- `inert` **não está** no HTML servido (0 ocorrências em todas as rotas, produção e local); só é aplicado no cliente durante a abertura. A tarefa de "mover `inert` para o cliente" já está cumprida desde o PR #1.
- O texto animado **não sai colado** no HTML (há espaço real entre as palavras e `aria-label` com a frase completa).
- Modo de saída é servidor, não `export`: o redirect www → apex vai em `next.config.ts` (`redirects()`), não em `.htaccess`.

## Achados novos (não estavam no roteiro)

1. **H1 `invisible` no build local (risco que eu introduzi).** No commit `5f40095` o texto do hero passou a estar sempre no HTML, mas dentro de um bloco com `visibility:hidden` até o clique no farol. Sem JavaScript, `h1` visível = **não** (local) contra **sim** (produção, pela legenda). O Googlebot não clica no farol. Isto precisa ser decidido no gate G1 antes de ir para produção.
2. **Cards do Método (Saúde, Turismo, Negócios Locais) com `opacity:0` no servidor** e revelados por JavaScript. Sem JS ficam invisíveis (opacidade 0 nos 3, em produção e local). É o único conteúdo "principal" da home que depende de JS para ser visto.
3. **Skip link só na home.** As 4 páginas internas não têm "Pular para o conteúdo".
4. **Botões do banner com destaque diferente:** Aceitar é preenchido (dourado), Recusar é só contorno. Mesmo tamanho e posição, mas o roteiro pede "mesmo destaque". Corrijo também o que escrevi antes, em entrada do CHANGELOG, de que tinham "o mesmo peso".
5. **Descrição da Política com 95 caracteres** (abaixo de 120). As demais estão entre 124 e 145.
6. **HTML local 2× maior que o de produção** (≈152 KB contra ≈70 KB) por causa do CSS inline (`inlineCss`). A comprimir pela CDN fica pequeno, mas a medir no PageSpeed depois do deploy; **não** confirmado que o CSS inline melhorou a nota em produção.
7. **Crawlers:** os 5 agentes (navegador, Googlebot, OAI-SearchBot, ClaudeBot, PerplexityBot) recebem **o mesmo HTML** (status e bytes idênticos); URL inexistente devolve **404 real** (`noindex` no HTML do 404, esperado); 6 requests seguidos com agente curl: 200 todas as vezes (o 403 de outubro não se repetiu).
8. **Contraste (Lighthouse):** 18 itens na home (palavras da Missão com opacidade .14 inicial) e 10 em /planos (`text-papel-700`, 4,11:1).
