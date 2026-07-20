/**
 * Gera os assets derivados da identidade visual: favicon, apple-icon e a
 * imagem de Open Graph.
 *
 * São gerados por script em vez de exportados à mão para que continuem
 * consistentes se o arquivo de marca de origem for atualizado — basta
 * substituir o PNG em public/brand e rodar `npm run assets`.
 *
 * O favicon de origem tem 2134px e canal alfa; o wordmark oficial é
 * opaco sobre navy. Ambos vêm de
 * "Nelvox - Operação/Identidade Visual".
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const NAVY_900 = { r: 0x0a, g: 0x1a, b: 0x2f, alpha: 1 };

const SYMBOL = "public/brand/favicon-source.png";
const WORDMARK = "public/brand/wordmark_nelvox_gold_navy.png";

await mkdir("src/app", { recursive: true });

/* --- Favicon e ícone do app ---
   O símbolo tem alfa, então recebe o fundo navy da marca: um ícone
   transparente ficaria ilegível na aba clara do navegador. */
await sharp(SYMBOL)
  .resize(32, 32, { fit: "contain", background: NAVY_900 })
  .flatten({ background: NAVY_900 })
  .png()
  .toFile("src/app/icon.png");

await sharp(SYMBOL)
  .resize(180, 180, { fit: "contain", background: NAVY_900 })
  .flatten({ background: NAVY_900 })
  .png()
  .toFile("src/app/apple-icon.png");

/* --- Open Graph 1200x630 ---
   Wordmark oficial centralizado sobre campo Navy sólido. Usar o arquivo
   de marca em vez de texto composto garante o lockup correto em
   qualquer prévia de rede social. */
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const wordmarkWidth = 620;

const wordmark = await sharp(WORDMARK)
  .resize({ width: wordmarkWidth })
  .toBuffer();
const wordmarkMeta = await sharp(wordmark).metadata();

await sharp({
  create: {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    channels: 4,
    background: NAVY_900,
  },
})
  .composite([
    {
      input: wordmark,
      left: Math.round((OG_WIDTH - wordmarkWidth) / 2),
      top: Math.round((OG_HEIGHT - wordmarkMeta.height) / 2),
    },
  ])
  .png()
  .toFile("src/app/opengraph-image.png");

console.log("assets gerados: icon.png, apple-icon.png, opengraph-image.png");
