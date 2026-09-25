"use client";

import { useCallback, useEffect, useRef } from "react";
import { RichText } from "@/components/ui/RichText";
import { SCENES } from "@/content/site";

/**
 * Cena 5 — Missão. Revelação palavra por palavra ligada ao scroll
 * (scrub, não entrada única): cada palavra vai de opacidade .14 a 1
 * conforme a página rola pelo "pin" (sticky) desta cena.
 */
export function SceneMission() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  /* As palavras não mudam depois do primeiro render — buscá-las de novo
     a cada quadro seria refazer o mesmo `querySelectorAll` 60x por
     segundo para nada. */
  const wordsRef = useRef<HTMLElement[]>([]);

  const update = useCallback(() => {
    const wrapper = wrapperRef.current;
    const words = wordsRef.current;
    if (!wrapper || words.length === 0) return;

    const rect = wrapper.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    const n = words.length;

    words.forEach((word, index) => {
      const opacity = 0.14 + 0.86 * Math.min(1, Math.max(0, progress * n - index));
      word.style.opacity = opacity.toFixed(3);
    });
  }, []);

  /* O loop de rAF só roda enquanto a cena está perto da viewport — ver
     o mesmo cuidado em SceneSea.tsx. */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const text = textRef.current;
    if (!wrapper || !text) return;

    wordsRef.current = Array.from(text.querySelectorAll<HTMLElement>("[data-mission-word]"));

    let raf = 0;
    const loop = () => {
      update();
      raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "50% 0px 50% 0px" },
    );
    observer.observe(wrapper);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [update]);

  return (
    // 140vh (não 200vh): tempo suficiente para revelar a frase palavra a
    // palavra sem deixar o scroll "pesado" — ver DECISOES.md.
    <div ref={wrapperRef} className="relative h-[140vh]">
      <section
        id="cena-5"
        data-scene="5"
        className="sticky top-0 h-screen overflow-hidden pt-[210px] lg:pt-[260px]"
      >
        <div className="mx-auto flex w-full max-w-container flex-col gap-6 pl-6 pr-[28px] lg:px-20">
          <p className="eyebrow">{SCENES.missao.eyebrow}</p>
          <p
            ref={textRef}
            className="max-w-4xl font-display text-mission-mobile font-light text-papel-300 lg:text-mission"
          >
            <RichText text={SCENES.missao.text} reveal="mission" />
          </p>
        </div>
      </section>
    </div>
  );
}
