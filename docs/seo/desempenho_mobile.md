# Desempenho no celular — o que foi feito sem mexer no frontend

Data: 4 de outubro de 2026. Ponto de partida: PageSpeed Insights (celular) de 3 de outubro, nota **87**, FCP 1,8 s,
LCP 3,0 s, TBT 40 ms, CLS 0, Speed Index 6,2 s.

## Mudança aplicada

`next.config.ts`: `experimental.inlineCss: true`. O CSS do Tailwind (~10 KiB) passa a vir dentro do HTML, em vez de um
`<link rel="stylesheet">` que bloqueia a primeira pintura (o PageSpeed apontava "Solicitações que bloquearam a
renderização", economia de 150 ms). É a opção que a documentação do Next recomenda para CSS atômico e visitantes novos.
Nenhum componente, estilo ou texto foi alterado.

## Medição (Lighthouse 12.8, celular, mesma máquina e mesmo build, 3 execuções cada)

| | Antes | Depois (mediana) |
|---|---|---|
| Nota de desempenho | 79, 78, 79 | **86** (86, 90, 81) |
| FCP | 2,14 s | **1,98 s** |
| LCP | 3,64 s | **2,86 s** |
| Speed Index | 6,15 s | **5,06 s** |
| TBT | 210 ms | 209 ms |
| CLS | 0 | 0 |

A máquina local é mais lenta que o PageSpeed (TBT 210 ms contra 40 ms), então os números absolutos diferem. A
comparação antes/depois é válida porque tudo, exceto essa opção, é igual. O pior resultado com a mudança (81) é
melhor que o melhor da base (79). Confirmar no PageSpeed depois do deploy.

**Verificado:** o site não muda visualmente (texto da Cena 1 e cards de `/planos`: 0 pixels de diferença; a única
diferença no comparativo é o ícone de desenvolvimento do Next, que não existe em produção), nenhum erro de console
nem violação de CSP em 4 páginas, `seo:check` aprovado.

## O que foi investigado e não rende nada por configuração

- **"JavaScript legado, 17 KiB":** são os polyfills do próprio Next (`at`, `flat`, `flatMap`, `fromEntries`,
  `hasOwn`, `trimStart`, `trimEnd`). O arquivo tem 1,4 KB e é carregado por um `require` fixo dentro do Next, sem
  opção para desligar. A estimativa do PageSpeed considera o chunk inteiro.
- **"Reduza o JavaScript não usado, 78 KiB":** quase tudo é o React e o runtime do Next (dois chunks de ~65 KiB).
- **Cache e compressão:** já corretos na Hostinger. HTML em cache de CDN, JS, CSS e fontes com `max-age` de 1 ano
  e `immutable`, tudo em Brotli.

## O que domina o resultado e exige decisão de frontend (não feito)

O elemento do LCP é o "TOQUE NO FAROL". Do LCP de 3,6 s, **3,2 s são "atraso de renderização"**: o texto já está no
HTML, mas só pinta quando a abertura animada (preloader) termina. O Speed Index de ~5 s tem a mesma origem. Com a
abertura como está, o piso do LCP é a duração dela. Opções, todas mexem na experiência e ficam para você decidir:

1. Pular a abertura para quem já a viu na sessão (ou nos últimos dias).
2. Encurtar a abertura.
3. Fontes: a home carrega ~150 KiB de fontes (Cormorant em 4 estilos). Reduzir pesos ou estilos mexe no design.
4. Carregar sob demanda o JavaScript das cenas abaixo da dobra.

## Como conferir depois do deploy

PageSpeed Insights em https://nelvox.com.br (celular). Esperado: o `<link>` de CSS some de "Solicitações que
bloquearam a renderização" e FCP/LCP/Speed Index caem; o restante fica como está.
