import type { Config } from "tailwindcss";
import { NAVY, GOLD, PAPEL, OCEANO } from "./src/tokens/brand";

/* ===================================================================
   TOKENS DA MARCA NELVOX — Manual de Marca V1.0
   ===================================================================
   Configuração do Tailwind. A paleta em si mora em src/tokens/brand.ts,
   porque o OrbitalCanvas precisa das mesmas cores em runtime e duas
   cópias acabariam divergindo.

   Preto puro e branco puro estão deliberadamente ausentes do tema: o
   manual os proíbe, substituídos por Navy 950 e Papel 50. Como não
   existem aqui, `text-black` simplesmente não compila.
   =================================================================== */

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    /* Sobrescreve (não estende) para que apenas cores da marca existam. */
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      navy: NAVY, // dominante, 60-70% da composição
      gold: GOLD, // acento, 10-15%
      papel: PAPEL, // secundária e texto, 20-25%
      /* Pontual — abaixo de 5%, no máximo 2 elementos por composição.
         Nunca pareado com Gold no mesmo elemento, nunca como par
         texto/fundo com Papel (contraste insuficiente). */
      oceano: OCEANO,
    },

    /* Escala 8px estrita. Um `p-5` (20px) fora da escala não compila. */
    spacing: {
      0: "0px",
      1: "4px",
      2: "8px",
      4: "16px",
      6: "24px",
      8: "32px",
      12: "48px",
      16: "64px",
      20: "80px",
      /* Múltiplos maiores, ainda na base 8, para respiro de seção */
      24: "96px",
      28: "112px",
      36: "144px",
      48: "192px",
      px: "1px",
    },

    /* Sem arredondamento "amigável", sem cards pill. */
    borderRadius: {
      none: "0px",
      sm: "2px", // controles de formulário, tags
      md: "4px", // cards, dialogs
      full: "9999px", // reservado a Badge/Switch
    },

    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
      },

      /* Pares [tamanho, { ... }] já com tracking, leading e peso corretos,
         para que usar o token errado seja mais difícil que usar o certo. */
      fontSize: {
        eyebrow: [
          "9px",
          { letterSpacing: "3.5px", lineHeight: "1.4", fontWeight: "500" },
        ],
        caption: [
          "12px",
          { letterSpacing: "0.1px", lineHeight: "1.5", fontWeight: "400" },
        ],
        body: [
          "15px",
          { letterSpacing: "0px", lineHeight: "1.65", fontWeight: "400" },
        ],
        h4: ["15px", { letterSpacing: "0px", lineHeight: "1.3", fontWeight: "600" }],
        /* Cormorant nunca abaixo de 20px — perde legibilidade. */
        h3: ["20px", { letterSpacing: "0px", lineHeight: "1.3", fontWeight: "500" }],
        h2: ["30px", { letterSpacing: "-0.3px", lineHeight: "1.1", fontWeight: "400" }],
        h1: ["40px", { letterSpacing: "-0.8px", lineHeight: "1.05", fontWeight: "300" }],
        display: [
          "56px",
          { letterSpacing: "-1.5px", lineHeight: "1.0", fontWeight: "300" },
        ],
      },

      letterSpacing: {
        eyebrow: "3.5px",
        wordmark: "6px",
      },

      maxWidth: {
        container: "1280px",
      },

      /* Escala de motion do manual. */
      transitionDuration: {
        micro: "125ms", // micro-interação (100-150ms)
        ui: "250ms", // transição de UI (200-300ms)
        enter: "500ms", // entrada de página/seção (400-600ms)
        cinematic: "1000ms", // sequência cinematográfica (800-1200ms)
      },
      transitionTimingFunction: {
        "brand-out": "cubic-bezier(0, 0, 0.2, 1)", // entradas
        "brand-in-out": "cubic-bezier(0.4, 0, 0.2, 1)", // transições
        "brand-in": "cubic-bezier(0.4, 0, 1, 1)", // saídas
        /* Exclusivo do traço do preloader: acelera e desacelera de forma
           simétrica, o que faz a linha parecer desenhada por uma mão. */
        draw: "cubic-bezier(0.65, 0, 0.35, 1)",
      },

      /* Grid de 12 colunas do manual (gutter 24px, margem 80px). */
      gridTemplateColumns: {
        brand: "repeat(12, minmax(0, 1fr))",
      },
      gap: {
        gutter: "24px",
        "gutter-mobile": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
