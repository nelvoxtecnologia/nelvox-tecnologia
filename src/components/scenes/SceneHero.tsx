"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { RichText } from "@/components/ui/RichText";
import { SCENES } from "@/content/site";
import { useFarolLit } from "@/lib/useFarolLit";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Cena 1 — Hero. Cobre a tela inteira: é onde o farol apagado (e depois
 * aceso) vive, sobreposto pelo componente `Farol` (fixed, fora desta
 * árvore).
 *
 * Antes do clique (Cena 1A) só existem o farol e o hint "TOQUE NO
 * FAROL" — nenhum outro texto. Eyebrow, headline e corpo (Cena 1B)
 * só aparecem depois de aceso, junto com o fundo radial dourado.
 */
export function SceneHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lit = useFarolLit();

  /* Neblina da headline: cada palavra sai do blur/opacidade 0 assim que
     a Cena 1B entra em cena — não precisa esperar o evento de novo
     aqui, o próprio `lit` já dispara este efeito quando muda. */
  useEffect(() => {
    if (!lit) return;
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-fog-word]"));
    if (words.length === 0) return;

    /* A neblina termina no espaçamento de letras DO PRÓPRIO título (−1px no
       celular, −1,5px no desktop) — terminar em 0 deixava a headline mais larga
       que a do design depois da animação. */
    const restingTracking = getComputedStyle(root.querySelector("h1") ?? root).letterSpacing;

    gsap.to(words, {
      opacity: 1,
      filter: "blur(0px)",
      letterSpacing: restingTracking,
      duration: 1.2,
      ease: "power2.out",
      stagger: 0.08,
    });
  }, [lit]);

  /* Ao rolar da Cena 1 para a 2, o farol atravessa a tela em direção ao
     canto inferior esquerdo — por cima do texto. Para o texto não ficar
     sob o farol, ele some e sobe um pouco conforme o scroll (0 → 45% da
     altura da tela), já fora do caminho quando o farol chega perto. */
  useEffect(() => {
    if (!lit) return;
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-fade]"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.45));
      targets.forEach((el) => {
        el.style.opacity = String(1 - p);
        el.style.transform = `translateY(${(-p * 40).toFixed(1)}px)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [lit]);

  return (
    <section
      ref={rootRef}
      id="cena-1"
      data-scene="1"
      className={`relative flex min-h-screen flex-col overflow-hidden ${lit ? "hero-glow" : ""}`}
    >
      {/* Bloco de texto: mobile a partir de y=350 (artboard 01B), desktop a partir
          de y=500 numa tela de 900px de altura — em telas mais baixas sobe na
          mesma proporção do farol (ver DESKTOP_REFERENCE_HEIGHT em Farol.tsx);
          margens de 24px no celular. */}
      {lit && (
        <div
          data-hero-fade
          className="mx-auto flex w-full max-w-container flex-col items-center gap-[20px] px-6 pt-[350px] text-center lg:gap-6 lg:px-20 lg:pt-[clamp(300px,calc(500*100vh/900),500px)]"
        >
          <p className="eyebrow">{SCENES.heroOn.eyebrow}</p>
          <h1 className="hero-headline max-w-4xl font-display text-display-xl-mobile font-light text-papel-300 lg:text-display-xl">
            <RichText text={SCENES.heroOn.headline} reveal="fog" />
          </h1>
          <p className="font-body text-body text-papel-500 lg:max-w-[31em]">{SCENES.heroOn.body}</p>
        </div>
      )}

      {/* Deixa de scroll: linha estática, sem loop (36px no celular, 40px no desktop). */}
      {lit && (
        <div
          data-hero-fade
          aria-hidden="true"
          className="mx-auto mb-[28px] mt-auto h-[36px] w-px lg:h-[40px]"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(200,179,138,.7))" }}
        />
      )}
    </section>
  );
}
