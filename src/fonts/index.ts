/* ===== FONTES ===== */
/**
 * Duas famílias, conforme o Manual de Marca V1.0 — nenhuma terceira é permitida.
 *
 * Cormorant Garamond vem do Google Fonts (mesma origem que o manual indica).
 * General Sans NÃO existe no Google Fonts: é distribuída pela Fontshare. Em vez de
 * carregar o CSS remoto da Fontshare (uma requisição bloqueante para um domínio
 * terceiro, cara em LCP no celular), os .woff2 estão vendorizados aqui e servidos
 * pelo próprio domínio via next/font/local. A ITF Free Font License permite o
 * self-hosting.
 */
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";

/** Display e headings. Light 300 é o padrão da marca; Bold 700 é proibido. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

/** Toda a UI: corpo, botões, navegação, eyebrows. */
export const generalSans = localFont({
  src: [
    { path: "./GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  // Aproxima a métrica do fallback para reduzir o deslocamento de layout na troca.
  adjustFontFallback: "Arial",
});
