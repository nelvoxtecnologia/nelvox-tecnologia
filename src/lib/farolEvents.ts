/* ===== SINAL DE FAROL ACESO ===== */
/**
 * Mesmo padrão do preloader (ver preloaderEvents.ts): um atributo no
 * <html> cobre a corrida de quem hidrata depois do evento, e o evento
 * em si avisa quem já está montado.
 *
 * `nelvox:farol-status` no sessionStorage existe só para a navegação de
 * volta de /origem para a home: lá o farol já está aceso e docado, e a
 * home não deveria travar o scroll de novo nem repetir a sequência de
 * acender.
 *
 * Este módulo não importa nada de React de propósito: `MotionScript`
 * (Server Component) usa `readFarolStatusScript`, e importar
 * `useSyncExternalStore` aqui obrigaria toda essa árvore a virar
 * Client Component. O hook `useFarolLit` vive em `useFarolLit.ts`.
 */
export const FAROL_LIT_EVENT = "nelvox:farol-lit";

const STORAGE_KEY = "nelvox:farol-status";

export function signalFarolLit() {
  document.documentElement.dataset.farol = "on";
  try {
    sessionStorage.setItem(STORAGE_KEY, "on");
  } catch {
    /* sessionStorage indisponível: a home simplesmente pede o clique de novo. */
  }
  window.dispatchEvent(new CustomEvent(FAROL_LIT_EVENT));
}

/** Lido apenas no cliente, antes do primeiro paint (ver MotionScript). */
export function readFarolStatusScript(): string {
  return `try{if(sessionStorage.getItem("${STORAGE_KEY}")==="on")document.documentElement.setAttribute("data-farol","on")}catch(e){}`;
}

export function isFarolLit(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.farol === "on";
}
