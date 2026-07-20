"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { NelvoxSymbol } from "@/components/brand/NelvoxSymbol";
import { GOLD, NAVY } from "@/tokens/brand";
import { signalPreloaderDone } from "./preloaderEvents";

/* ===== PRELOADER ===== */
/**
 * A sequência de abertura — o único lugar do site onde a ousadia é
 * gasta. O resto permanece disciplinado e silencioso.
 *
 * Ordem: o fundo clareia de Navy 950 para Navy 900, pontos luminosos
 * aparecem, as órbitas se formam e então o símbolo é desenhado traço a
 * traço. As duas foices abrem o envelope da letra e as duas diagonais
 * descem para fechá-la — nessa ordem a animação é lida como o N sendo
 * escrito, e não como quatro formas surgindo.
 *
 * O símbolo é traçado com stroke-dashoffset sobre a geometria real do
 * arquivo vetorial oficial, e só depois preenchido. Um fade simples
 * entregaria a forma pronta e perderia justamente a ideia de precisão
 * que a marca quer comunicar.
 */

/* --- Timing (segundos). Total ~2,73s, dentro da faixa de 2,2-2,8s. --- */
const T = {
  bgFade: { at: 0, duration: 0.4 },
  nodes: { at: 0.3, duration: 0.4, stagger: 0.06 },
  orbits: { at: 0.5, duration: 0.6, stagger: 0.12 },
  symbol: { at: 0.75, duration: 0.5, stagger: 0.166 },
  crossfade: { at: 1.75, duration: 0.2 },
  hold: 0.18, // a pausa que faz o fechamento registrar visualmente
  exit: { duration: 0.6 },
};

/** Curva do traço: acelera e desacelera de forma simétrica, como uma mão. */
const DRAW_EASE = "power2.inOut";

/** Teto absoluto: o preloader nunca segura o conteúdo além disso. */
const MAX_BLOCKING_MS = 3000;

/** Pontos luminosos: poucos e precisos, não uma chuva de partículas. */
const NODES = [
  { cx: 620, cy: 780, r: 9 },
  { cx: 2380, cy: 900, r: 7 },
  { cx: 1180, cy: 2420, r: 8 },
  { cx: 2520, cy: 2180, r: 6 },
  { cx: 480, cy: 1820, r: 7 },
];

export function Preloader() {
  const [isDone, setIsDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    /* Sob movimento reduzido o CSS já escondeu o preloader; aqui apenas
       liberamos o hero imediatamente. */
    if (document.documentElement.dataset.motion !== "full") {
      signalPreloaderDone();
      setIsDone(true);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    let watchdog = 0;

    /* Enquanto a sequência roda, o resto da página fica inerte: sem isso
       o Tab alcançaria links escondidos atrás do preloader, e o scroll
       moveria um conteúdo que ninguém está vendo. `inert` cobre foco e
       leitura por tecnologia assistiva de uma vez só. */
    const blocked = Array.from(
      document.querySelectorAll<HTMLElement>("header, #conteudo, footer"),
    );
    blocked.forEach((el) => el.setAttribute("inert", ""));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const release = () => {
      blocked.forEach((el) => el.removeAttribute("inert"));
      document.body.style.overflow = previousOverflow;
    };

    const finish = () => {
      window.clearTimeout(watchdog);
      release();
      signalPreloaderDone();
      setIsDone(true);
    };

    const ctx = gsap.context(() => {
      /* Cada traço é medido em vez de ter o comprimento fixado no código:
         se o arquivo vetorial da marca for atualizado, a animação
         continua correta sem ninguém precisar lembrar de recalcular. */
      const strokes = gsap.utils.toArray<SVGPathElement>(
        ".preloader__symbol-stroke path",
      );
      const orbits = gsap.utils.toArray<SVGEllipseElement>(".preloader__orbit");

      [...strokes, ...orbits].forEach((el) => {
        const length = el.getTotalLength();
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
      });

      const tl = gsap.timeline({ onComplete: finish });

      /* 1. Navy 950 quase preto clareia para Navy Profundo. */
      tl.to(
        root,
        {
          backgroundColor: NAVY[900],
          duration: T.bgFade.duration,
          ease: "power1.out",
        },
        T.bgFade.at,
      );

      /* 2. Pontos luminosos. */
      tl.to(
        ".preloader__node",
        {
          opacity: 1,
          duration: T.nodes.duration,
          stagger: T.nodes.stagger,
          ease: "power2.out",
        },
        T.nodes.at,
      );

      /* 3. Órbitas se formam, também por traço. */
      tl.to(
        orbits,
        {
          strokeDashoffset: 0,
          duration: T.orbits.duration,
          stagger: T.orbits.stagger,
          ease: "power2.out",
        },
        T.orbits.at,
      );

      /* 4. O símbolo é desenhado. */
      tl.to(
        strokes,
        {
          strokeDashoffset: 0,
          duration: T.symbol.duration,
          stagger: T.symbol.stagger,
          ease: DRAW_EASE,
        },
        T.symbol.at,
      );

      /* 5. O traço vira forma preenchida. */
      tl.to(
        ".preloader__symbol-fill",
        { opacity: 1, duration: T.crossfade.duration, ease: "power1.inOut" },
        T.crossfade.at,
      );
      tl.to(
        ".preloader__symbol-stroke",
        { opacity: 0, duration: T.crossfade.duration, ease: "power1.inOut" },
        T.crossfade.at,
      );

      /* 6. Pausa com o símbolo completo, e 7. saída. */
      tl.to(
        root,
        {
          opacity: 0,
          duration: T.exit.duration,
          ease: "power2.out", // ease-out (0,0,0.2,1) do manual
        },
        T.crossfade.at + T.crossfade.duration + T.hold,
      );

      /* O conteúdo entra com o scale sutil de 0.98 → 1 descrito no
         manual, em paralelo à saída do preloader. fromTo em vez de to
         para que o estado inicial venha do JS: assim o conteúdo nunca
         fica preso em escala reduzida se algo falhar antes daqui. */
      tl.fromTo(
        "#conteudo",
        { scale: 0.98, transformOrigin: "50% 40%" },
        { scale: 1, duration: T.exit.duration, ease: "power2.out" },
        T.crossfade.at + T.crossfade.duration + T.hold,
      );
    }, rootRef);

    /* O preloader nunca pode bloquear o conteúdo por mais de 3s, mesmo
       que algum asset demore ou a timeline trave. */
    watchdog = window.setTimeout(finish, MAX_BLOCKING_MS);

    return () => {
      window.clearTimeout(watchdog);
      release();
      ctx.revert();
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 z-50 flex items-center justify-center bg-navy-950"
      /* Puramente decorativo: descrever a sequência para um leitor de
         tela só atrasaria o acesso ao conteúdo. O <main> recebe inert
         enquanto isto está na tela, então nada aqui recebe foco. */
      aria-hidden="true"
    >
      <div className="relative h-[min(38vw,260px)] w-[min(38vw,260px)]">
        {/* Órbitas e pontos, no mesmo viewBox do símbolo para que tudo
            compartilhe o sistema de coordenadas da marca. */}
        <svg
          viewBox="0 0 3000 3000"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
          focusable="false"
        >
          {/* Inclinação de -56°: o mesmo eixo da diagonal do símbolo. */}
          <ellipse
            className="preloader__orbit"
            cx="1500"
            cy="1500"
            rx="1900"
            ry="1150"
            fill="none"
            stroke={GOLD[400]}
            strokeOpacity="0.3"
            strokeWidth="4"
            transform="rotate(-56 1500 1500)"
          />
          <ellipse
            className="preloader__orbit"
            cx="1500"
            cy="1500"
            rx="1450"
            ry="1250"
            fill="none"
            stroke={GOLD[400]}
            strokeOpacity="0.18"
            strokeWidth="4"
            transform="rotate(-22 1500 1500)"
          />

          {NODES.map((node) => (
            <circle
              key={`${node.cx}-${node.cy}`}
              className="preloader__node"
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={GOLD[300]}
            />
          ))}
        </svg>

        {/* Contorno sendo traçado, e a forma preenchida por baixo. */}
        <NelvoxSymbol
          variant="outline"
          strokeWidth={2}
          className="preloader__symbol-stroke absolute inset-0 h-full w-full text-gold-400"
        />
        <NelvoxSymbol
          variant="solid"
          className="preloader__symbol-fill absolute inset-0 h-full w-full text-gold-400"
        />
      </div>
    </div>
  );
}
