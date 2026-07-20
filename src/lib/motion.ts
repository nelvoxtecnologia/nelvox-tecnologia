/* ===== PREFERÊNCIA DE MOVIMENTO ===== */
/**
 * Fonte de verdade para decisões de animação em JavaScript.
 *
 * O atributo data-motion no <html> existe para o CSS: ele precisa
 * conhecer a preferência antes da primeira pintura, e só um script
 * inline consegue isso. Mas o React reverte atributos escritos antes da
 * hidratação quando eles divergem do HTML do servidor — então ler o
 * atributo em JS é frágil: ele pode ter desaparecido bem na hora em que
 * um componente decide se anima ou não.
 *
 * matchMedia não tem esse problema. É a mesma pergunta, feita direto ao
 * navegador.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
