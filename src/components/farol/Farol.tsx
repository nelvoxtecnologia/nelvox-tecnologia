"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { FarolSvg } from "./FarolSvg";
import { isFarolLit, signalFarolLit } from "@/lib/farolEvents";
import { useFarolLit } from "@/lib/useFarolLit";
import { PRELOADER_DONE_EVENT } from "@/components/preloader/preloaderEvents";
import { prefersReducedMotion } from "@/lib/motion";
import { SCENES } from "@/content/site";

type FarolProps = {
  /** /quem-somos e /politica-de-privacidade mostram o farol já aceso e atracado, sem a sequência de acender. */
  initialDocked?: boolean;
};

/* ===== GEOMETRIA (ver docs/design-handoff/README.md) ===== */
const SIZE = {
  centerBig: { desktop: 760, mobile: 460 },
  centerSmall: { desktop: 520, mobile: 300 }, // mobile: artboard 01B (300×216)
  dock: { desktop: { w: 220, h: 158 }, mobile: { w: 120, h: 86 } },
};
/* Distância do topo da tela: o farol "sobe" ao encolher (grande → pequeno). */
const TOP_BIG = { desktop: 150, mobile: 190 };
const TOP_SMALL = { desktop: 100, mobile: 84 }; // mobile: artboard 01B (top 84)
const DOCK_OFFSET = { desktop: { left: -30, bottom: 24 }, mobile: { left: -16, bottom: 14 } };
const DOCK_OPACITY = { desktop: 0.35, mobile: 0.3 };
const ASPECT = 720 / 1000; // viewBox do FarolSvg
/* As medidas desktop acima valem para uma tela de 900px de altura. Em telas
   mais baixas (notebooks 1366×768 etc.) o farol no centro encolhe na mesma
   proporção, senão a base sai da tela e o texto da Cena 1 cai sobre ele.
   Mesma referência de `lg:pt-[clamp(...)]` em SceneHero.tsx. */
const DESKTOP_REFERENCE_HEIGHT = 900;
const DESKTOP_MIN_SCALE = 0.6;

/* Mesmo corte (lg = 1024px) do resto do site: abaixo disso vale o layout mobile. */
const MOBILE_BREAKPOINT = 1024;
const SCRUB_VH = 0.85;
const BEAM_PERIOD_S = 7;
const BEAM_AMPLITUDE_DEG = 35;
const REDUCED_BEAM_ANGLE = -10;

/* Sequência de acender (README, Cena 1B): o farol encolhe em 1200ms com
   atraso de 900ms. O texto da Cena 1 só entra DEPOIS disso (ver
   `signalFarolLit` no fim de `lightUp`). */
const SHRINK_DELAY_MS = 900;
const SHRINK_DURATION_MS = 1200;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Fator de suavização exponencial normalizado por delta-time (segundos),
 * para o farol não "teletransportar" em saltos discretos de scroll (roda do
 * mouse, PageDown) e para o resultado não depender da taxa de quadros do
 * dispositivo. `tau` é o tempo (s) para percorrer ~63% da distância até o
 * alvo — quanto menor, mais rápido a docagem "cola" no scroll real.
 */
function smoothingFactor(dt: number, tau: number) {
  return dt > 0 ? 1 - Math.exp(-dt / tau) : 0;
}

const DOCK_SMOOTH_TAU_S = 0.15;
const MENU_DOCK_TAU_S = 0.2;

/** ease-in-out quadrático — equivalente prático ao cubic-bezier(.4,0,.2,1) do manual. */
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function Farol({ initialDocked = false }: FarolProps) {
  /* `clicked`: o visitante acabou de tocar no farol. `ready`: a sequência
     terminou (ou já estava aceso nesta sessão, ao voltar de /quem-somos). */
  const [clicked, setClicked] = useState(false);
  const ready = useFarolLit();
  const isOn = initialDocked || clicked || ready;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const beamsRef = useRef<SVGGElement>(null);
  const progressA = useRef(initialDocked ? 1 : 0); // 0 = centro grande, 1 = centro pequeno
  const progressB = useRef(initialDocked ? 1 : 0); // 0 = centro pequeno, 1 = atracado — alvo bruto do scroll
  const progressBSmooth = useRef(initialDocked ? 1 : 0); // valor de fato desenhado (ver applyStyle)
  const rafId = useRef(0);
  const startTime = useRef(0);
  const lastFrameTime = useRef(0);
  const reducedRef = useRef(false);
  const litRef = useRef(initialDocked);
  /* Com o menu mobile aberto o farol vai para o canto (como na artboard do
     menu), em vez de ficar no meio da tela cobrindo os links. */
  const menuDock = useRef(0);

  const applyStyle = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const key = window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop";
    const dock = SIZE.dock[key];
    const dockOffset = DOCK_OFFSET[key];
    const scale =
      key === "desktop"
        ? Math.min(1, Math.max(DESKTOP_MIN_SCALE, window.innerHeight / DESKTOP_REFERENCE_HEIGHT))
        : 1;
    const centerBig = SIZE.centerBig[key] * scale;
    const centerSmall = SIZE.centerSmall[key] * scale;

    /* Lê o valor SUAVIZADO (progressBSmooth), não o alvo bruto do scroll
       (progressB) — ver `tick`. Evita que o farol salte instantaneamente
       para a posição correspondente a um scroll discreto (roda do mouse,
       PageDown, trackpad). */
    const width =
      progressBSmooth.current > 0
        ? lerp(centerSmall, dock.w, progressBSmooth.current)
        : lerp(centerBig, centerSmall, progressA.current);
    const height = width * ASPECT;

    const centerX = window.innerWidth / 2 - width / 2;
    const topY = lerp(TOP_BIG[key], TOP_SMALL[key], progressA.current) * scale;
    const dockY = window.innerHeight - dockOffset.bottom - height;

    /* Curvas diferentes em x e y: o farol desliza para a ESQUERDA primeiro
       (ease-out) e só depois desce (ease-in), saindo da coluna do texto da
       Cena 1 logo no começo do scroll. Junto com o farol ficar atrás do
       conteúdo (z-5 x z-10), ele nunca cobre o texto. */
    const p = progressBSmooth.current;
    const x = lerp(centerX, dockOffset.left, 1 - (1 - p) * (1 - p));
    const y = lerp(topY, dockY, p * p);

    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    wrapper.style.transform = `translate(${x}px, ${y}px)`;
    wrapper.style.opacity = String(lerp(1, DOCK_OPACITY[key], p));
  }, []);

  const lightUp = useCallback(() => {
    if (litRef.current) return;
    litRef.current = true;
    setClicked(true);

    const reduced = reducedRef.current;
    const delay = reduced ? 0 : SHRINK_DELAY_MS;
    const duration = reduced ? 0 : SHRINK_DURATION_MS;
    const start = performance.now();

    const step = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, Math.max(0, (now - start - delay) / duration));
      progressA.current = easeInOut(t);

      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }
      /* Só agora — farol aceso E já encolhido — o resto da página entra:
         scroll liberado, texto da Cena 1, menu e indicador. */
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      signalFarolLit();
    };
    requestAnimationFrame(step);
  }, []);

  /* useLayoutEffect (não useEffect): em /quem-somos e /politica-de-privacidade o atributo
     data-farol="on" precisa existir ANTES da primeira pintura para o
     Header não "piscar" ao aparecer. */
  useLayoutEffect(() => {
    reducedRef.current = prefersReducedMotion();

    if (initialDocked || isFarolLit()) {
      /* Já aceso: /quem-somos, /politica-de-privacidade, ou a volta à home na mesma sessão. */
      litRef.current = true;
      progressA.current = 1;
      document.documentElement.dataset.farol = "on";
    } else {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    const onDone = () => applyStyle();
    if (document.documentElement.dataset.preloader === "done" || initialDocked) {
      applyStyle();
    } else {
      window.addEventListener(PRELOADER_DONE_EVENT, onDone, { once: true });
    }

    /* Função nomeada (não useCallback) para poder se autorreferenciar no
       loop sem o problema de "acessada antes de declarada". */
    function tick(now: number) {
      if (!startTime.current) startTime.current = now;
      const elapsed = (now - startTime.current) / 1000;
      const dt = lastFrameTime.current ? (now - lastFrameTime.current) / 1000 : 0;
      lastFrameTime.current = now;

      if (litRef.current) {
        /* Nas páginas internas o farol nasce atracado, independente do scroll. */
        const menuOpen = document.documentElement.dataset.menu === "open";
        menuDock.current += ((menuOpen ? 1 : 0) - menuDock.current) * smoothingFactor(dt, MENU_DOCK_TAU_S);
        const scrolled = Math.min(1, window.scrollY / (window.innerHeight * SCRUB_VH));
        progressB.current = initialDocked ? 1 : Math.max(scrolled, menuDock.current);
        progressBSmooth.current +=
          (progressB.current - progressBSmooth.current) * smoothingFactor(dt, DOCK_SMOOTH_TAU_S);

        const beams = beamsRef.current;
        if (beams) {
          const angle = reducedRef.current
            ? REDUCED_BEAM_ANGLE
            : BEAM_AMPLITUDE_DEG * Math.sin((2 * Math.PI * elapsed) / BEAM_PERIOD_S);
          beams.setAttribute("transform", `rotate(${angle.toFixed(2)} 500 178)`);
        }
      }

      applyStyle();
      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener("resize", applyStyle);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", applyStyle);
      window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      lightUp();
    }
  };

  return (
    <>
      <div
        ref={wrapperRef}
        data-farol-wrapper
        className={`pointer-events-none fixed left-0 top-0 ${isOn ? "z-[5]" : "z-[20]"}`}
        style={{ willChange: "transform, opacity, width, height" }}
      >
        {isOn ? (
          <FarolSvg ref={beamsRef} lit showBeams animateIn={clicked} className="h-full w-full" />
        ) : (
          <button
            type="button"
            onClick={lightUp}
            onKeyDown={onKeyDown}
            aria-label={SCENES.heroOff.ariaLabel}
            data-hot
            className="pointer-events-auto block h-full w-full cursor-pointer"
          >
            <FarolSvg lit={false} showBeams={false} className="h-full w-full" />
          </button>
        )}
      </div>

      {/* Hint (README, Cena 1A): anel de 16px AO LADO do texto, centralizado a
          88px da base (120px no mobile). Só o anel pulsa; o texto é estático. */}
      {!isOn && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-[120px] z-[20] flex items-center justify-center gap-[12px] lg:bottom-[88px] lg:gap-[14px]"
        >
          <span
            className="farol-hint__ring flex h-4 w-4 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(200,179,138,.45)" }}
          >
            <span className="h-1 w-1 rounded-full bg-gold-400" />
          </span>
          <span className="font-body text-eyebrow text-gold-400">{SCENES.heroOff.hint}</span>
        </div>
      )}
    </>
  );
}
