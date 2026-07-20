/* ===== SINAL DE FIM DO PRELOADER ===== */
/**
 * O Preloader e o ScrollReveal são componentes irmãos e independentes,
 * mas o hero só deve entrar depois que o símbolo sair. Um evento no
 * window desacopla os dois sem precisar de um provider de contexto
 * envolvendo a página inteira.
 *
 * O atributo data-preloader no <html> cobre a corrida: se o ScrollReveal
 * hidratar depois do preloader já ter terminado, ele lê o estado em vez
 * de esperar por um evento que nunca mais virá.
 */
export const PRELOADER_DONE_EVENT = "nelvox:preloader-done";

/** Marca o documento e avisa quem estiver esperando. */
export function signalPreloaderDone() {
  document.documentElement.dataset.preloader = "done";
  window.dispatchEvent(new CustomEvent(PRELOADER_DONE_EVENT));
}
