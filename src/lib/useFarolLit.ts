"use client";

import { useSyncExternalStore } from "react";
import { FAROL_LIT_EVENT, isFarolLit } from "./farolEvents";

/**
 * Hook seguro para hidratação: usa `useSyncExternalStore`, a API do
 * próprio React para ler um valor externo (aqui, um atributo do DOM)
 * sem divergir do HTML do servidor.
 *
 * O truque: no primeiro render do cliente (o que é comparado com o
 * servidor), o React usa `getServerSnapshot` — sempre `false`, igual
 * ao servidor. Só depois, numa passada já fora da hidratação, ele lê
 * o valor real via `isFarolLit()` e atualiza se for diferente. Sem
 * isso, ler `isFarolLit()` direto num `useState` ou dentro de um
 * `useEffect`/`useLayoutEffect` pode divergir do servidor (quando o
 * farol já estava aceso nesta sessão, por exemplo voltando de
 * /origem) e disparar erro de hidratação.
 *
 * Fica num arquivo próprio, separado de farolEvents.ts, porque este
 * hook obriga quem o importa a ser Client Component — e
 * MotionScript.tsx (Server Component) também usa farolEvents.ts.
 */
export function useFarolLit(): boolean {
  return useSyncExternalStore(subscribe, isFarolLit, getServerSnapshot);
}

function subscribe(callback: () => void) {
  window.addEventListener(FAROL_LIT_EVENT, callback);
  return () => window.removeEventListener(FAROL_LIT_EVENT, callback);
}

function getServerSnapshot() {
  return false;
}
