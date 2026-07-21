"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRELOADER_DONE_EVENT } from "@/components/preloader/preloaderEvents";
import { prefersReducedMotion } from "@/lib/motion";

/* ===== MOVIMENTO DE SCROLL ===== */
/**
 * Orquestra as animações de scroll da página inteira a partir de um
 * único componente cliente.
 *
 * As seções continuam sendo server components: elas só marcam elementos
 * com data-attributes, e toda a seleção acontece aqui. O alternativo —
 * transformar cada seção em client component para poder animá-la —
 * mandaria todo o JSX das seções para o navegador sem necessidade.
 *
 * Este componente não renderiza nada.
 */

/** Entrada de seção: 500ms, dentro da faixa de 400-600ms do manual. */
const DURATION = 0.5;
/**
 * Stagger largo o bastante para que no máximo três elementos estejam em
 * movimento simultâneo, como o manual exige.
 */
const STAGGER = 0.18;
/** Revelação por máscara: mais lenta, é o gesto caro da composição. */
const MASK_DURATION = 1.1;

export function ScrollReveal() {
  useEffect(() => {
    /* Sob movimento reduzido nada é criado. Os elementos já estão
       visíveis pelo CSS, então não há o que fazer. */
    if (prefersReducedMotion()) return;

    /* Garante a regra de CSS que mantém os itens invisíveis até entrarem.
       O script inline já escreveu isto, mas a hidratação do React pode
       tê-lo revertido. */
    document.documentElement.dataset.motion = "full";

    gsap.registerPlugin(ScrollTrigger);

    /* gsap.context recolhe tudo criado dentro dele, então um único
       revert() no cleanup mata tweens, ScrollTriggers e matchMedia. */
    const ctx = gsap.context(() => {
      /**
       * Revelação palavra a palavra: cada palavra sobe de trás de uma
       * máscara, em cascata. É o gesto que separa uma entrada genérica
       * de uma composição tipográfica — a frase se monta diante do
       * leitor em vez de simplesmente aparecer.
       *
       * O elemento fica visível de imediato porque quem estava escondido
       * eram as palavras, não o bloco; ficar de fora do stagger comum
       * evita dois tweens disputando as mesmas propriedades.
       */
      const revealMask = (el: HTMLElement, delay = 0) => {
        const inner = el.querySelectorAll<HTMLElement>(".reveal-word__inner");
        gsap.set(el, { opacity: 1, y: 0 });

        if (inner.length === 0) return;

        gsap.to(inner, {
          y: "0%",
          duration: MASK_DURATION,
          ease: "power3.out",
          stagger: 0.055,
          delay,
        });
      };

      /* ---------- Entradas de seção ---------- */
      const sections = gsap.utils.toArray<HTMLElement>('[data-animate="section"]');

      sections.forEach((section) => {
        /* Os elementos com máscara saem do stagger: têm animação própria. */
        const items = Array.from(
          section.querySelectorAll<HTMLElement>("[data-animate-item]"),
        ).filter((el) => el.dataset.reveal !== "mask");

        const masked = section.querySelectorAll<HTMLElement>('[data-reveal="mask"]');

        if (items.length > 0) {
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: DURATION,
            ease: "power2.out", // equivalente ao ease-out (0,0,0.2,1) do manual
            stagger: STAGGER,
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
          });
        }

        masked.forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => revealMask(el),
          });
        });
      });

      /* ---------- Parallax ----------
         Amplitude pequena de propósito: o suficiente para dar camada, não
         para chamar atenção para si mesmo. */
      const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");

      parallax.forEach((el) => {
        const distance = Number(el.dataset.parallax) || 60;
        gsap.fromTo(
          el,
          { y: distance },
          {
            y: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      /* ---------- Saída do hero ----------
         O motivo orbital afunda e desaparece conforme a página sai do
         hero, em vez de simplesmente rolar para fora junto com o resto. */
      const heroVisual = document.querySelector<HTMLElement>("[data-hero-visual]");
      const hero = document.querySelector<HTMLElement>('[data-animate="hero"]');

      if (heroVisual && hero) {
        gsap.to(heroVisual, {
          y: 120,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* ---------- Scroll lateral do Método ----------
         Só em desktop: prender a página no celular para mover conteúdo de
         lado é desorientador. gsap.matchMedia cuida de criar e destruir
         conforme a largura muda. */
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const section = document.querySelector<HTMLElement>("[data-horizontal]");
        const track = document.querySelector<HTMLElement>("[data-horizontal-track]");
        if (!section || !track) return;

        /* Distância medida em função, não fixada: o ScrollTrigger a
           recalcula em cada refresh, então continua correta se as fontes
           carregarem depois ou a janela mudar de tamanho.
           A folga do fim vem do padding-right do trilho — somar margem
           aqui faria o trilho correr além do último bloco. */
        const overflow = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const progress = section.querySelector<HTMLElement>(
          "[data-horizontal-progress]",
        );

        gsap.to(track, {
          x: () => -overflow(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${overflow()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress) gsap.set(progress, { scaleX: self.progress });
            },
          },
        });
      });

      /* ---------- Hero na abertura ----------
         Entra quando o preloader sai, para as duas animações não
         disputarem a atenção. */
      const heroAll = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-animate="hero"] [data-animate-item]',
        ),
      );
      const heroItems = heroAll.filter((el) => el.dataset.reveal !== "mask");
      const heroMasked = heroAll.filter((el) => el.dataset.reveal === "mask");

      const revealHero = () => {
        gsap.to(heroItems, {
          opacity: 1,
          y: 0,
          duration: DURATION,
          ease: "power2.out",
          stagger: STAGGER,
        });
        /* A headline entra logo após o eyebrow, com a máscara mais lenta
           puxando o olho para ela antes do resto do bloco. */
        heroMasked.forEach((el) => revealMask(el, STAGGER));
      };

      /**
       * Enquanto o preloader está na tela o body fica com overflow
       * travado, então todo ScrollTrigger criado até aqui mediu a página
       * sem rolagem — inclusive o pin do Método, cujas distâncias
       * dependem da altura real do documento. Recalcular na saída é o
       * que impede a seção lateral de prender no ponto errado.
       */
      const onPreloaderDone = () => {
        revealHero();
        ScrollTrigger.refresh();
      };

      if (document.documentElement.dataset.preloader === "done") {
        onPreloaderDone();
      } else {
        window.addEventListener(PRELOADER_DONE_EVENT, onPreloaderDone, {
          once: true,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
