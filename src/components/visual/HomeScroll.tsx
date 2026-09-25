"use client";

import { useEffect } from "react";
import { NAVY } from "@/tokens/brand";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Cor global do `body` por cena. Nenhuma seção tem fundo opaco próprio
 * (ver README do handoff) — é a cor da página que interpola, para que
 * o farol persistente nunca fique atrás de um bloco opaco. Scrolls
 * 1-4 e 6 são Navy 950 (o padrão do body); só a Cena 5 muda para Navy
 * 900, e a Cena 6 devolve para 950.
 */
export function HomeScroll() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    document.body.style.transition = reduced ? "none" : "background-color 800ms ease-in-out";

    const scene5 = document.querySelector<HTMLElement>('[data-scene="5"]');
    const scene6 = document.querySelector<HTMLElement>('[data-scene="6"]');
    if (!scene5 || !scene6) return;

    let inScene5 = false;
    let inScene6 = false;

    const apply = () => {
      document.body.style.backgroundColor = inScene6 || !inScene5 ? NAVY[950] : NAVY[900];
    };

    const observer5 = new IntersectionObserver(
      ([entry]) => {
        inScene5 = entry.isIntersecting;
        apply();
      },
      { threshold: 0.15 },
    );
    const observer6 = new IntersectionObserver(
      ([entry]) => {
        inScene6 = entry.isIntersecting;
        apply();
      },
      { threshold: 0.15 },
    );

    observer5.observe(scene5);
    observer6.observe(scene6);

    return () => {
      observer5.disconnect();
      observer6.disconnect();
      document.body.style.backgroundColor = "";
      document.body.style.transition = "";
    };
  }, []);

  return null;
}
