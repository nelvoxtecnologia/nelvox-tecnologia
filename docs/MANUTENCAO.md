# Guia de manutenção — site Nelvox

Mapa de "onde está cada coisa" para editar o site sem precisar reler
tudo do zero. Para o histórico de decisões de implementação (o que
diverge do mockup original e por quê), ver
[`docs/design-handoff/DECISOES.md`](design-handoff/DECISOES.md).

## Trocar textos

Quase todo texto do site vive em **`src/content/site.ts`**, não dentro
dos componentes. Para mudar uma frase, é ali que se edita:

| O quê | Onde em `site.ts` |
|---|---|
| Cenas da Home (eyebrow, headlines, cards do Método, CTA) | `SCENES` |
| Textos de `/quem-somos` ("Quem somos") | `ORIGEM` |
| Textos de `/politica-de-privacidade` | `PRIVACY` |
| Rodapé (tagline, copyright) | `FOOTER` |
| Links do menu e do rodapé | `NAV_ITEMS`, `FOOTER_LINKS` |
| Número de WhatsApp, e-mail, cidade | `WHATSAPP_NUMBER`, `EMAIL`, `CITY`, `STATE` |
| Título/descrição para Google e redes sociais | `META` |
| Dados do controlador (para a Política de Privacidade) | `LEGAL_NAME`, `LEGAL_CNPJ`, `LEGAL_ADDRESS` — **ainda são placeholders**, preencher antes de publicar |

Dentro dessas strings, duas marcações simples (interpretadas por
`RichText`, em `src/components/ui/RichText.tsx`):

- `*trecho*` → itálico dourado (a única ênfase da marca).
- `\n` → quebra de linha.

## As 6 cenas da Home

Cada cena é um componente em `src/components/scenes/`, montado em
`src/app/page.tsx` nesta ordem:

| Cena | Componente | O que faz |
|---|---|---|
| 1 — Hero (farol apagado/aceso) | `SceneHero.tsx` | Mostra a headline só depois que o farol acende |
| 2 — Problema | `SceneSea.tsx` | Cena 2 e 3 são o mesmo componente |
| 3 — Solução | `SceneSea.tsx` | O texto troca quando a cascata do mar de pontos passa de ~38% |
| 4 — Método | `SceneMethod.tsx` + `NicheCard.tsx` | Um card por nicho (hoje: Saúde e Turismo, em `SCENES.metodo.cards`) |
| 5 — Missão | `SceneMission.tsx` | Revelação palavra a palavra ligada ao scroll |
| 6 — CTA final | `SceneCta.tsx` | Botão magnético de WhatsApp |

**Para adicionar um terceiro card no Método**: acrescentar um item em
`SCENES.metodo.cards` (em `site.ts`) com `id`, `clipPath` (o desenho do
feixe), `eyebrow`, `title`, `audience` e `lines`. O grid em
`SceneMethod.tsx` é `lg:grid-cols-2` — com 3 cards ele quebra para
2+1; se quiser 3 por linha, mudar para `lg:grid-cols-3` ali.

## O Farol

`src/components/farol/`:

- **`FarolSvg.tsx`** — só a geometria (o desenho do farol apagado,
  aceso e dos feixes de luz). Se for redesenhar o farol visualmente,
  é aqui.
- **`Farol.tsx`** — o comportamento: acender no clique, encolher,
  "atracar" no canto inferior esquerdo conforme o scroll, e a
  varredura infinita do feixe. As medidas (tamanhos, posições) ficam
  em constantes no topo do arquivo (`SIZE`, `TOP_OFFSET`,
  `DOCK_OFFSET`, `DOCK_OPACITY`).
  As medidas de desktop valem para uma tela de 900px de altura
  (`DESKTOP_REFERENCE_HEIGHT`); em telas mais baixas o farol central encolhe
  na mesma proporção (mínimo `DESKTOP_MIN_SCALE`), junto com o início do
  texto e o tamanho da headline da Cena 1 (`SceneHero.tsx` e `.hero-headline`
  em `globals.css`). Mudou uma dessas três coisas, conferir as outras duas.

O farol é renderizado uma vez por página (`src/app/page.tsx`,
`src/appquem-somos/page.tsx`, `src/apppolitica-de-privacidade/page.tsx`). Em
`/quem-somos` e `/politica-de-privacidade` ele nasce já aceso e atracado
(`<Farol initialDocked />`) — não repete a sequência de acender.

## Cabeçalho, rodapé e indicador de progresso

- **`src/components/layout/Header.tsx`** — menu do topo. Só aparece
  depois que o farol acende (`useFarolLit()`).
- **`src/components/layout/Footer.tsx`** — rodapé completo (marca +
  slogan + links). Usado no fim da Home e em `/quem-somos`/`/politica-de-privacidade`.
- **`src/components/layout/SceneProgress.tsx`** — os pontinhos de
  navegação entre cenas, à direita. Só existe em páginas que têm
  cenas (a Home).

## Cookies e rastreamento (GA4 / Meta Pixel)

- **`src/lib/consent.ts`** — lê/grava a escolha de cookies
  (`localStorage`). Se a política de privacidade mudar de um jeito que
  precise de novo consentimento, subir `CONSENT_VERSION`.
- **`src/components/consent/ConsentBanner.tsx`** — o banner que
  aparece depois do farol acender (ou do preloader, em outras
  páginas).
- **`src/components/consent/ConsentPreferences.tsx`** — o diálogo de
  preferências (abre pelo rodapé, pelo menu mobile ou pelo próprio
  banner).
- **`src/components/consent/Tracking.tsx`** — só injeta o Google
  Analytics e o Meta Pixel depois que a pessoa aceita. As chaves vêm
  de variáveis de ambiente:

  ```
  NEXT_PUBLIC_GA_ID=G-XXXXXXX
  NEXT_PUBLIC_META_PIXEL_ID=00000000000000
  ```

  Sem elas configuradas (ver `.env.example`), nada é carregado — o
  site funciona normalmente, só sem métricas.
- **`src/lib/track.ts`** — dispara o evento de conversão
  (`generate_lead` / `Contact`) quando alguém clica em qualquer CTA de
  WhatsApp.

## Cores, tipografia e espaçamento

Fonte única de verdade: **`src/tokens/brand.ts`** (as cores) e
**`tailwind.config.ts`** (tamanhos de fonte, espaçamento, durações de
animação). Não redefinir cor em nenhum outro lugar — se uma cor nova
for necessária, ela nasce em `brand.ts`.

### Armadilha: escala de espaçamento fechada

O `tailwind.config.ts` **substitui** (não estende) a escala de
espaçamento. Só existem as chaves `0, 1, 2, 4, 6, 8, 12, 16, 20, 24,
28, 36, 48` (e `px`). Uma classe como `px-9`, `py-3`, `gap-5`, `h-10`
ou `right-9` **não gera nenhum CSS e não dá erro** — o elemento
simplesmente fica sem aquele espaço. Para valores fora da escala, use
valor arbitrário: `px-[36px]`, `gap-[12px]`, `h-[40px]`. Foi assim que
o botão do CTA ficou sem padding e o indicador de progresso grudou na
esquerda. Depois de mexer em espaçamento, sempre conferir no navegador.

### Armadilha: `getComputedStyle(el).transform` não mostra translate/scale/rotate

No Tailwind v4, `translate-*`, `scale-*` e `rotate-*` (classe, não
`style={{transform: ...}}` via JS) compilam para as propriedades CSS
nativas `translate`/`scale`/`rotate` — não para o `transform` legado. Ao
depurar no DevTools ou em um script, `getComputedStyle(el).transform`
sempre volta `"none"` para essas classes; o valor real está em
`getComputedStyle(el).translate` (e `.scale`/`.rotate`). Perdi um tempo
achando que `-translate-y-full` não compilava por causa da escala de
spacing fechada (armadilha acima) — não tinha nada a ver, a classe
sempre funcionou.

## Antes de qualquer alteração

1. `npm run lint` e `npm run build` sem erros.
2. `npm run dev` e revisar visualmente: farol apagado → aceso →
   scroll pelas 6 cenas → `/quem-somos` → `/politica-de-privacidade`.
3. Se a mudança tocar textos com `*ênfase*` ou revelação por palavra,
   prestar atenção especial ao espaçamento entre palavras — é a parte
   mais frágil do sistema (ver o comentário em
   `src/components/ui/RichText.tsx`).

## Política de privacidade (`/politica-de-privacidade`)

Veio do Claude Design (`docs/design-handoff/Politica de Privacidade.dc.html`).
- **Texto**: `PRIVACY` em `src/content/site.ts` (13 seções, na ordem do índice).
- **Layout**: `src/components/privacy/PrivacyContent.tsx` (tabelas, cards,
  grade de direitos, índice fixo) e `ManageCookiesButton.tsx`.
- **Dados a confirmar**: tudo que aparece entre `[colchetes]` no texto
  (razão social, CNPJ, endereço, nome do encarregado, `[Vercel]`, `[12 meses]`)
  é mostrado com destaque tracejado dourado na página, e o `npm run build`
  avisa enquanto restar algum. Ao preencher, remova os colchetes.
  Razão social/CNPJ/endereço/encarregado ficam nas constantes `LEGAL_*` e
  `DPO_NAME` no topo de `site.ts`.
- Revisão jurídica antes de publicar ou rodar anúncios.

## Mobile e camadas (atualizado)
- **Corte mobile/desktop = 1024px (`lg`)** em todo o site (inclui o farol e o `DotField`).
  As medidas do celular vêm das artboards 390 do `Home Mockup.dc.html`; cada
  componente traz as duas versões (`classe` mobile + `lg:classe` desktop).
- **Camadas (z)**: farol persistente `z-5` (atrás) · `<main>` e rodapé `z-10` · botão
  flutuante de WhatsApp (mobile) `z-30` · nav e indicador `z-40` · banner de cookies
  `z-50` · cursor `z-60`. Farol apagado (antes do clique) sobe para `z-20` para ser
  clicável; com o menu mobile aberto ele vai a `z-45`. Por isso as cenas **não têm
  fundo opaco** — o farol aparece por trás.
- **Cena 4** (`SCENES.metodo.cards`): cada card tem `clipPath`/`dots` (desktop) e
  `clipPathMobile`/`dotsMobile` (celular: pontos de 4px, sem brilho). Ordem do mockup:
  Saúde, Turismo, Negócios Locais. Clicar num card abre o detalhamento (`detail`,
  diálogo em `MethodCards.tsx`) — mudança de comportamento pedida em 28/09/2026 (o
  handoff original especificava "não clicável").
- **Quebras de linha**: em `site.ts`, `\n` vira quebra; `<RichText breaks="desktop">` só quebra
  no desktop (Cenas 2–4) e `breaks="mobile"` só no celular (Cena 6).
- **Menu mobile**: `Header.tsx` (foco preso, Esc fecha, farol vai ao canto via `html[data-menu]`).
- Segurança: ver `docs/SEGURANCA.md`.
