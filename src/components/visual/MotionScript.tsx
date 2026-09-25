import { readFarolStatusScript } from "@/lib/farolEvents";

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
 *
 * Também escreve data-farol="on" quando a home é revisitada depois de
 * já ter acendido o farol (ver farolEvents.ts) — sem isso o scroll
 * travaria de novo a cada retorno de /origem.
 */
const SCRIPT = `(function(){try{var r=window.matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.setAttribute("data-motion",r?"reduced":"full")}catch(e){document.documentElement.setAttribute("data-motion","reduced")}${readFarolStatusScript()}})();`;

export function MotionScript() {
  return (
    /* `type` alterna entre "text/javascript" (servidor, executa) e
       "text/plain" (cliente, inerte) — é o padrão recomendado pelo
       próprio Next.js para <script> literal em JSX (ver
       node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md).
       Sem isso, o React avisa "Encountered a script tag while
       rendering..." ao hidratar, porque um <script> em JSX nunca
       executa de novo no cliente — só faz sentido no HTML do servidor,
       que o navegador processa antes do React entrar em cena.
       suppressHydrationWarning evita o aviso sobre essa troca de tipo. */
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
