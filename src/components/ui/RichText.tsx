import { Fragment, type ReactNode } from "react";

type RichTextProps = {
  /** `*trecho*` vira itálico Gold; `\n` vira quebra de linha. */
  text: string;
  className?: string;
  /**
   * "fog": cada palavra nasce em blur/opacidade 0 (Cena 1B — neblina da
   * headline). "mission": cada palavra nasce em opacidade .14, sem blur
   * (Cena 5 — revelação ligada ao scroll). Omitido: sem wrapper de palavra.
   */
  reveal?: "fog" | "mission";
  /**
   * Onde os 
 viram quebra de linha: "always" (padrão), só no "desktop"
   * (lg+; no celular o texto flui) ou só no "mobile". O mockup quebra as
   * headlines das Cenas 2–4 apenas no desktop, e a da Cena 6 apenas no celular.
   */
  breaks?: "always" | "desktop" | "mobile";
};

/**
 * A frase como texto corrido, sem a marcação (`*ênfase*` e `
`). Usada no `aria-label` do título
 * quando o texto é dividido em palavras (`reveal`): o HTML passa a ter a frase inteira, contígua,
 * além dos spans de cada palavra, que só existem para a animação.
 */
export function plainText(text: string): string {
  return text.replaceAll("*", "").replace(/\s+/g, " ").trim();
}

/**
 * Quebra de linha responsiva. O espaço antes do <br> garante que as palavras não colem quando a
 * quebra some (modos desktop/mobile) e que o `textContent` e o HTML tenham o espaço entre a última
 * palavra de uma linha e a primeira da próxima ("precisa de", não "precisade") em qualquer modo.
 * Visualmente não muda nada: o espaço fica no fim da linha e é colapsado.
 */
function LineBreak({ mode }: { mode: "always" | "desktop" | "mobile" }) {
  return (
    <>
      {" "}
      <br
        className={mode === "desktop" ? "hidden lg:inline" : mode === "mobile" ? "lg:hidden" : undefined}
      />
    </>
  );
}

/** Divide uma linha em segmentos normais e em ênfase (`*...*`), para o modo sem `reveal`. */
function splitEmphasis(line: string): Array<{ text: string; emphasis: boolean }> {
  const parts = line.split(/\*([^*]+)\*/g);
  return parts
    .map((part, index) => ({ text: part, emphasis: index % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}

type Token = { text: string; emphasis: boolean; spaceBefore: boolean };

/**
 * Tokeniza a linha inteira de uma vez, palavra por palavra — e não
 * segmento de ênfase por segmento de ênfase.
 *
 * Isso importa porque `*` pode cair no meio de uma palavra em relação
 * aos vizinhos: em "de *uma luz*." o asterisco de abertura cola em
 * "uma" e o de fechamento cola em "luz", logo antes do ponto. Se cada
 * segmento (`"de "`, `"uma luz"`, `"."`) virasse palavras
 * independentemente — como fazia a versão anterior — o espaço entre
 * "de" e "uma" desaparecia: ele existia apenas como sobra no fim do
 * primeiro segmento, sem nenhuma palavra depois dele *dentro do mesmo
 * segmento* para separar.
 */
function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let emphasis = false;

  line
    .split(" ")
    .filter(Boolean)
    .forEach((word, wordIndex) => {
      const pieces = word.split("*");
      /* Quando a palavra começa com "*" (ex.: "*uma"), o primeiro
         pedaço de texto real fica no índice 1, não no 0 (o índice 0 é
         a string vazia antes do asterisco). Por isso o espaço "antes
         da palavra" precisa marcar o primeiro pedaço que de fato for
         emitido — não, especificamente, o de índice 0. */
      let isFirstPieceOfWord = true;
      pieces.forEach((piece, pieceIndex) => {
        if (pieceIndex > 0) emphasis = !emphasis;
        if (!piece) return;
        tokens.push({ text: piece, emphasis, spaceBefore: isFirstPieceOfWord && wordIndex > 0 });
        isFirstPieceOfWord = false;
      });
    });

  return tokens;
}

function renderTokens(tokens: Token[], reveal: "fog" | "mission") {
  const wordAttr = reveal === "fog" ? "data-fog-word" : "data-mission-word";

  /* O espaço entre palavras precisa ser um nó de texto IRMÃO, fora do
     span de cada palavra — não um caractere dentro dele. Cada palavra
     vira `display: inline-block` (ver globals.css) para a animação de
     opacidade/blur funcionar, e todo navegador recorta espaço em
     branco colapsável que fique colado à borda de uma caixa desse
     tipo: um espaço "dentro" da última posição do bloco desaparece
     visualmente, colando as palavras. */
  const nodes: ReactNode[] = [];
  tokens.forEach((token, index) => {
    if (token.spaceBefore) nodes.push(" ");
    nodes.push(
      <span key={index} {...{ [wordAttr]: "" }}>
        <span className={token.emphasis ? "italic text-gold-400" : undefined}>{token.text}</span>
      </span>,
    );
  });
  return nodes;
}

/**
 * Interpreta a marcação leve do conteúdo (ver site.ts) sem trazer um
 * parser de markdown completo — a marca só precisa de duas regras.
 *
 * Com `reveal`, as palavras viram spans animados e o wrapper sai com
 * `aria-hidden`: quem nomeia o título é o `aria-label={plainText(text)}`
 * que o elemento pai (h1/h2) deve receber.
 */
export function RichText({ text, className, reveal, breaks = "always" }: RichTextProps) {
  const lines = text.split("\n");

  return (
    <span className={className} aria-hidden={reveal ? true : undefined}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <LineBreak mode={breaks} />}
          {reveal
            ? renderTokens(tokenizeLine(line), reveal)
            : splitEmphasis(line).map((segment, segmentIndex) =>
                segment.emphasis ? (
                  <em key={segmentIndex} className="italic text-gold-400">
                    {segment.text}
                  </em>
                ) : (
                  <Fragment key={segmentIndex}>{segment.text}</Fragment>
                ),
              )}
        </Fragment>
      ))}
    </span>
  );
}
