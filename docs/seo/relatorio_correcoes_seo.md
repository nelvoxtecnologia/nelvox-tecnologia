# Relatório — correções de SEO (branch `fix/seo-fundacao`)

Data: 3 de outubro de 2026. Base: `master` em `93a0463`. Nada foi mesclado: o deploy da Hostinger sai da
branch principal, então este trabalho só vai ao ar depois do merge.

## Resumo

| | |
|---|---|
| Verificações bloqueantes (`seo:check`, itens 1–7) | **aprovado** no build de produção (5 rotas) |
| Lint, tipos, build | **aprovados** (`npm run lint`, `npx tsc --noEmit`, `npm run build`, 12 páginas) |
| Lighthouse 12.8.2 (SEO / acessibilidade) | `/` 100 / 96 · `/planos` 100 / 96 · `/termos-de-uso` 100 / 100 |
| Regra 6 do `CLAUDE.md` (Recusar / Aceitar) | **aprovada**, desktop e celular |
| Decisões pendentes para o Douglas | 5 (ver o fim) |

Dois pontos do briefing não se confirmaram ao medir o HTML (T2 e `inert` na T4); estão explicados em cada
tarefa. Em ambos, a correção feita é a que de fato resolvia o problema.

## T1 · Um H1 por rota

- **Problema confirmado:** a home tinha 0 `<h1`. O h1 antigo ("Todo porto precisa de uma luz.") só era
  renderizado depois do clique no farol.
- **Feito:** novo `<h1>` "Nelvox — criação de sites e presença digital em Porto Seguro, BA" na Cena 1, sempre
  no HTML servido e sempre visível, em `text-caption`. A headline antiga virou `h2`. As demais rotas já tinham
  exatamente um `h1`.
- **Arquivos:** `src/components/scenes/SceneHero.tsx`, `src/content/site.ts`.
- **Mudança visível:** antes do clique no farol aparece uma legenda discreta na base da tela, abaixo do
  "TOQUE NO FAROL" (22px de folga no celular; sem colisão com o botão de WhatsApp). Depois do clique ela passa
  para o topo do bloco de texto, logo acima do eyebrow "01 · PORTO SEGURO, BA"; o recuo do bloco diminuiu no
  mesmo tanto, então a headline não desceu.
- **Aceite:** `<h1` = 1 em todas as rotas.

## T2 · Texto animado legível

- **Premissa do briefing não confirmada:** o espaço entre as palavras animadas já era um nó de texto real e o
  `textContent` da Missão já estava correto.
- **Defeito real encontrado:** o `textContent` da headline da Cena 1 era **"Todo porto precisade uma luz."**.
  Nas quebras de linha (`\n`) o `RichText` emitia só `<br />`, sem espaço. Corrigido no `LineBreak`
  (`src/components/ui/RichText.tsx`). Comparação pixel a pixel da região da headline e do texto: **0 pixels
  de diferença** em 1366×641 e 360×740.
- **Frase contígua:** com `reveal`, o wrapper das palavras sai com `aria-hidden` e os títulos da Cena 1 e da
  Missão recebem `aria-label` com a frase completa (`plainText()`). O HTML passa a conter literalmente
  "Construir a presença digital de empresas com método e precisão — para que o cliente certo…".
- **Arquivos:** `RichText.tsx`, `SceneMission.tsx`, `SceneHero.tsx`. Animação não alterada.

## T3 · JSON-LD

- **Arquivos:** novo `src/lib/seo/schema.ts`; `src/components/seo/JsonLd.tsx` reduzido a injetar o schema;
  constantes de identificação em `src/content/site.ts`.
- `@graph` com `ProfessionalService` (legalName, taxID, telefone, e-mail, endereço só com cidade/UF/país,
  areaServed, horário, fundador, sameAs) e `WebSite`. Campo vazio faz a chave sumir (`prune`).
- **sameAs:** Instagram e Google Meu Negócio. O `wa.me` que existia saiu (WhatsApp não é perfil).
- **Sem `logo`:** nenhum PNG de `public/brand/` serve. Três têm fundo opaco; o único com canal alfa
  (`favicon-source.png`, 73,7% transparente) tem o símbolo em bege quase branco `rgb(225,219,211)`, ilegível
  sobre fundo branco, que é onde o Google exibe logos.
- Sem `aggregateRating`, `review` nem `priceRange`.
- **Aceite:** servido, passa em `JSON.parse`, sem valor vazio e sem `<`.

## T4 · Rodapé e `inert`

- **Rodapé:** bloco de identificação (razão social, CNPJ, "Porto Seguro, BA", e-mail `mailto:`, WhatsApp `wa.me`
  com "(73) 99831-3910", "Seg a sex, 8h às 18h"); links Quem somos, Planos, Política de privacidade, Termos de
  uso e o botão Preferências de cookies (mantido); perfis **Instagram** e **Google Meu Negócio** (pedido do
  Douglas, em nova aba com `rel="noopener noreferrer"`). Endereço, CEP e LinkedIn vazios: omitidos.
- **`inert`, premissa não confirmada:** o HTML servido **não tem `inert`** (0 ocorrências, com e sem JS). Ele
  só é aplicado no cliente (`Preloader.tsx`) em `header`, `main` e `footer`, durante ~3 s de abertura, e removido
  no fim. Com `prefers-reduced-motion` nunca é aplicado. A auditoria provavelmente fotografou o DOM durante a
  abertura. **Nenhuma mudança de código foi necessária.**
- **Testado:** sem JS, 0 `inert` e 8 links no rodapé; abertura normal, bloqueio de ~3 s e depois 0; Tab
  alcança os 9 itens do rodapé; movimento reduzido, nunca bloqueia. O botão "Preferências de cookies" abre o
  diálogo em `/quem-somos` (desktop) e `/termos-de-uso` (celular).
- **Arquivos:** `src/components/layout/Footer.tsx`, `src/content/site.ts`.
- **Mudança visível:** rodapé maior, em todas as páginas.

## T5 · `/termos-de-uso`

- **Texto:** o arquivo `docs/referencias/termos_de_uso_nelvox.md` não existia; o Douglas enviou o texto no chat
  e ele foi salvo nesse caminho **sem alteração**. A página lê esse arquivo em tempo de build (parser mínimo em
  `src/lib/legal/terms.ts`, sem dependência nova), e o texto no ar nunca diverge dele.
- **Layout:** igual ao de `/politica-de-privacidade` (cabeçalho, índice fixo, seções numeradas).
- **Verificado:** as 35 linhas do arquivo aparecem na página; 11 seções; 1 h1; rota 200; no rodapé e no
  sitemap. URLs e e-mails do texto viram links.
- **Diferenças em relação ao briefing:** o texto recebido não tinha `{{DATA}}` nem o comentário `PENDENTE`.
  A data do topo ("Última atualização: 3 de outubro de 2026", que o próprio texto prevê no item 9) vem de
  `TERMS_UPDATED_AT`, e o comentário `PENDENTE: validação jurídica antes do merge` foi colocado no código da
  página; não vai para o HTML. O item "1. Aceitação" está sem o `##` no arquivo; é tratado como seção 1.
- **Comparação com a Política de privacidade (sem edição):**
  - Cita Google Analytics e Meta? **Sim** (`_ga`, `_ga_*`; `_fbp`, `_fbc`, `fr`), em linha com o banner e os Termos.
    Pequena diferença de nome: a Política diz "Meta", os Termos dizem "Meta Pixel".
  - Prazo de resposta ao titular de 15 dias? **Sim**, igual aos Termos.
  - **Divergência:** os Termos prometem aviso de alterações "com pelo menos 10 dias de antecedência"; a Política
    diz só que mudanças relevantes serão avisadas no site, sem prazo.

## T6 · Metadados por rota

- **Defeitos reais medidos:** (a) `/planos`, `/quem-somos` e `/politica-de-privacidade` saíam **sem `og:image`
  nem `twitter:image`**, porque o `openGraph` da página substitui o do layout inteiro; (b) `twitter:title` e
  `twitter:description` de todas as rotas eram os da home.
- **Feito:** helper `src/lib/seo/metadata.ts` (`pageMetadata`) usado em todas as rotas internas; descrições novas
  para `/quem-somos` (era "Isso não é um efeito bonito…") e `/planos` (tinha ~195 caracteres).
- **Raiz:** `metadataBase` e `<html lang="pt-BR">` já existiam. `GSC_TOKEN` vazio: nenhum `verification`.
- **Aceite (HTML servido, build de produção):** 5 rotas com 5 títulos, 5 descrições (95 a 151 caracteres) e
  5 canonicals diferentes; todas com `og:image` e `twitter:image` absolutos em `https://nelvox.com.br/…`.

## T7 · Sitemap, robots e llms.txt

- Sitemap com 5 URLs (as 4 de antes + `/termos-de-uso`). `lastModified` da home e dos Termos: 2026-10-03; as
  outras só ganharam rodapé e mantêm a data do conteúdo.
- `robots.txt` inalterado. `public/llms.txt` com o conteúdo do briefing, idêntico byte a byte (sem BOM nem CRLF).
- **Aceite:** os três respondem 200.

## T8 · `seo:check`

`npm run seo:check -- <url>` (Node puro). Itens 1–7 bloqueiam; o 8 (vocabulário proibido e termos obsoletos) é
aviso. **Validado nos dois sentidos:** aprova o build local e **reprova** o site antigo no ar com exatamente os
3 problemas conhecidos (sem `llms.txt`, 0 `<h1` na home, frase da Missão ausente), saindo com código 1.

## Resultado das verificações

| Verificação | Resultado |
|---|---|
| `npm run lint` | sem erros nem avisos |
| `npx tsc --noEmit` | sem erros |
| `npm run build` (webpack) | ok; 12 páginas estáticas, incluindo `/termos-de-uso` |
| `npm run start` + `npm run seo:check` | **aprovado** (itens 1–7); avisos: nenhum |
| Lighthouse (SEO) | 100 nas 3 rotas testadas |
| Lighthouse (acessibilidade) | 96 / 96 / 100 (ver achados) |
| Regra 6: Recusar | 0 requisições a `google-analytics.com`, `googletagmanager.com`, `facebook.com/tr` |
| Regra 6: Aceitar | `googletagmanager.com/gtag/js` e `connect.facebook.net/fbevents.js` carregam |
| Regra 6: antes de qualquer escolha | 0 requisições (medido nesta rodada); Consent Mode `default` com tudo `denied` (medido em rodada anterior sobre o mesmo `Tracking.tsx`, que não foi alterado) |

Regra 6 testada com IDs falsos (`G-TESTE12345`, `1234567890123`) só na máquina local, com as requisições
bloqueadas e registradas; nada foi enviado ao Google nem à Meta. Os arquivos de consentimento
(`src/components/consent/`, `src/lib/consent.ts`, `src/lib/track.ts`) e o `layout.tsx` não foram alterados.

**Nota sobre o Lighthouse:** a versão 13.5 não roda a auditoria `canonical` com o Node 20.13.1 desta máquina
(`URL.parse is not a function`, exige Node ≥ 20.19) e devolve nota de SEO nula. As notas acima são do
Lighthouse 12.8.2, via `npx`, sem adicionar nada ao projeto. O canonical foi conferido pelo `seo:check`.

## Achados da Etapa 0

- **Termos obsoletos** (sócio/sócios, Vagner, Anthony, CTO, CMO, Firebase, Firestore, Mercado Pago, "IA
  proprietária"): **nenhuma ocorrência** em textos públicos.
- **Vocabulário proibido** (regra 5): **nenhuma ocorrência**. O botão "Contratar Plano" usa o infinitivo, que
  não está na lista.
- Detalhes em `docs/seo/reconhecimento.md`.

## Mudanças visíveis (resumo)

1. Home: legenda do H1 (antes do clique, na base da tela; depois, acima do eyebrow).
2. Rodapé maior em todas as páginas (identificação, Planos, Termos, Instagram, Google Meu Negócio).
3. Página nova `/termos-de-uso`.

Metadados, schema, sitemap e `llms.txt` não têm efeito visual.

## Achados fora de escopo (não alterados)

- **Contraste (Lighthouse):** na home, as palavras da Missão começam com opacidade 0,14 (estado inicial da
  animação de revelar por scroll, contraste 1,33); em `/planos`, `text-papel-700` de 13px nos cards tem
  contraste 4,11 (mínimo 4,5). Ambos já existiam e são decisão de design.
- **Hero fora do HTML servido:** além do novo H1, o texto da Cena 1 (headline "Todo porto precisa de uma luz."
  e o parágrafo) só existe depois do clique no farol (`{lit && …}`). Buscadores, que não clicam, nunca veem
  esse texto. Mudar isso mexe na narrativa do Farol e fica para decisão sua.
- **Menu mobile** não tem Planos nem Termos de uso (só Quem somos, Política e Preferências).

## Decisões pendentes para o Douglas

1. **Validação jurídica dos Termos de uso** antes do merge. O texto veio sem o comentário `PENDENTE` e sem
   `{{DATA}}`; a data usada é 3 de outubro de 2026 (`TERMS_UPDATED_AT` em `site.ts`).
2. **Divergências entre Política de privacidade e Termos/banner:** prazo de aviso de alterações (10 dias nos
   Termos, sem prazo na Política) e "Meta" × "Meta Pixel". A Política não foi editada.
3. **Logo do schema:** para ativar `logo`, enviar um PNG com fundo transparente e contraste sobre branco (por
   exemplo, wordmark em azul-marinho/dourado).
4. **Google Meu Negócio:** o link curto resolve para a busca "Nelvox" (`kgmid=/g/11z8dpxnz0`), não para uma URL
   `/maps/place/` ou `cid=`. O briefing e a mensagem trouxeram dois links diferentes
   (`…/6lVYdssUDnYeOhg4J` e `…/1byQLfMtI7OHcWanh`); ambos levam ao mesmo perfil e foi usado o mais recente.
   Se você tiver a URL do Maps, troque `GMB_URL` em `site.ts`.
5. **Vazios omitidos de propósito:** endereço, CEP, LinkedIn e `GSC_TOKEN`. Preencher em `site.ts` ou
   `layout.tsx` quando existirem. Google Meu Negócio e Search Console seguem manuais, fora do escopo.
