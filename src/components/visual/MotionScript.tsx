/* ===== DETECÇÃO DE MOVIMENTO (antes da primeira pintura) ===== */
/**
 * Marca o <html> com data-motion="full" ou "reduced" antes de qualquer
 * pixel ser pintado.
 *
 * Isso resolve dois problemas de uma vez:
 *
 * 1. O preloader é escondido por CSS para quem pediu movimento reduzido.
 *    Detectar via useEffect só rodaria depois da hidratação, e o
 *    preloader piscaria justamente para quem não quer animação.
 *
 * 2. Os elementos que o GSAP anima começam com opacity 0 — mas apenas
 *    sob data-motion="full". Se o JavaScript não executar, o atributo
 *    nunca é escrito e o conteúdo permanece visível. Um site que some
 *    quando o script falha é pior que um site sem animação.
 */
const SCRIPT = `(function(){try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.setAttribute("data-motion",r?"reduced":"full")}catch(e){document.documentElement.setAttribute("data-motion","reduced")}})();`;

export function MotionScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
