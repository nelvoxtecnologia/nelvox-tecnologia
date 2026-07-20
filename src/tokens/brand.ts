/* ===================================================================
   PALETA NELVOX — fonte de verdade única
   ===================================================================
   Valores do Manual de Marca V1.0, via Nelvox Design System
   (tokens/colors.css).

   Este módulo existe porque a paleta precisa ser consumida em dois
   lugares: pelo tailwind.config.ts (para gerar as classes) e pelo
   OrbitalCanvas (que pinta em canvas 2D e precisa das strings em
   runtime). Um único arquivo importado pelos dois evita que a segunda
   cópia se desatualize em silêncio.

   Preto e branco puros não existem aqui de propósito — o manual os
   substitui por Navy 950 e Papel 50.
   =================================================================== */

export const NAVY = {
  950: "#050D18",
  900: "#0A1A2F",
  800: "#102841",
  700: "#1A3B5C",
  600: "#2C567F",
} as const;

export const GOLD = {
  200: "#E8DCC4",
  300: "#DAC7A2",
  400: "#C8B38A",
  500: "#B89968",
  600: "#A17F4C",
} as const;

export const PAPEL = {
  50: "#F5F2EE",
  100: "#EDE8E0",
  300: "#D9D4CC",
  500: "#B8AFA0",
  700: "#8F8574",
} as const;

export const OCEANO = {
  500: "#00B8D4",
} as const;

/** Converte hex da paleta para rgba, para uso em canvas com opacidade. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
