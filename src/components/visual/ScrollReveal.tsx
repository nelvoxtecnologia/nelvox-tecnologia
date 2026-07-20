"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRELOADER_DONE_EVENT } from "@/components/preloader/preloaderEvents";

/* ===== ENTRADAS DE SEÇÃO ===== */
/**
 * Orquestra as animações de scroll de toda a página a partir de um único
 * componente cliente.
 *
 * As seções em si continuam sendo server components: elas apenas marcam
 * os elementos com data-animate-item, e a seleção acontece aqui. O
 * alternativo — transformar cada seção em client component só para poder
 * animá-la — mandaria todo o JSX das seções para o navegador sem
 * necessidade.
 *
 * Este componente não renderiza nada.
 */

/** Entrada de página/seção: 500ms, dentro da faixa de 400-600ms do manual. */
const DURATION = 0.5;
/**
 * Stagger largo o bastante para que no máximo três elementos estejam em
 * movimento simultâneo, como o manual exige. Com 0.5s de duração e 0.18s
 * de intervalo, nunca há um quarto item animando junto.
 */
const STAGGER = 0.18;

export function ScrollReveal() {
  useEffect(() => {
    /* Sob movimento reduzido nenhuma timeline é criada. Os elementos já
       estão visíveis pelo CSS, então não há nada a fazer. */
    if (document.documentElement.dataset.motion !== "full") return;

    gsap.registerPlugin(ScrollTrigger);

    /* gsap.context recolhe tudo que for criado dentro dele, então um
       único revert() no cleanup mata tweens e ScrollTriggers juntos. */
    const ctx = gsap.context(() => {
      /* --- Seções: entram conforme o scroll --- */
      const sections = gsap.utils.toArray<HTMLElement>(
        '[data-animate="section"]',
      );

      sections.forEach((section) => {
        const items = section.querySelectorAll("[data-animate-item]");
        if (items.length === 0) return;

        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: "power2.out", // equivalente ao ease-out (0,0,0.2,1) do manual
          stagger: STAGGER,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });
      });

      /* --- Hero: entra na abertura da página, não por scroll --- */
      const heroItems = document.querySelectorAll(
        '[data-animate="hero"] [data-animate-item]',
      );

      const revealHero = () => {
        gsap.to(heroItems, {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: "power2.out",
          stagger: STAGGER,
        });
      };

      /* O hero só entra quando o preloader sai, para as duas animações
         não disputarem a atenção. Se o preloader já terminou (ou nunca
         existiu), entra imediatamente. */
      if (document.documentElement.dataset.preloader === "done") {
        revealHero();
      } else {
        window.addEventListener(PRELOADER_DONE_EVENT, revealHero, {
          once: true,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
