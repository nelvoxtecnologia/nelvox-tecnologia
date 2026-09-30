"use client";

import { useEffect, useRef, useState } from "react";
import type { SCENES } from "@/content/site";

type NicheCardData = (typeof SCENES)["metodo"]["cards"][number];
type Dot = readonly [string, number, "bright" | "gold" | "off"];

type NicheCardProps = {
  card: NicheCardData;
  delayMs: number;
  onOpen: () => void;
};

/** Aparência dos pontos-alvo. Desktop: 5px com brilho; celular: 4px, sem brilho (mockup). */
const DOT_COLOR = { bright: "#F0DFB8", gold: "#C8B38A", off: "#1A3B5C" } as const;
const DOT_GLOW = {
  bright: "0 0 8px rgba(240,223,184,.7)",
  gold: "0 0 8px rgba(240,223,184,.5)",
  off: "none",
} as const;

function Dots({ dots, mobile, visible }: { dots: readonly Dot[]; mobile: boolean; visible: boolean }) {
  return (
    <>
      {dots.map(([left, top, tone], index) => {
        const size = mobile || tone === "off" ? 4 : 5;
        return (
          <span
            key={index}
            className="absolute rounded-full transition-opacity duration-500 ease-brand-out"
            style={{
              left,
              top,
              width: size,
              height: size,
              background: DOT_COLOR[tone],
              boxShadow: mobile ? "none" : DOT_GLOW[tone],
              opacity: visible ? 1 : 0,
              transitionDelay: visible ? "500ms" : "0ms",
            }}
          />
        );
      })}
    </>
  );
}

/**
 * Card de nicho. O diagrama do feixe é um degradê recortado por `clip-path`
 * (triângulo), com a lâmpada e os pontos-alvo por cima — acesos dentro do
 * feixe, apagados fora. O celular tem diagrama próprio (80px de altura,
 * lâmpada em x=24, pontos de 4px) e o desktop o dele (104px, lâmpada em x=40).
 * Tudo vem de `SCENES.metodo.cards` (site.ts).
 *
 * Espaçamentos em px arbitrários de propósito: a escala de spacing do
 * tailwind.config.ts é fechada (4, 8, 16, 24…) e não tem 11px, 28px etc.
 *
 * O card é um <button> (não <div>): clicar abre o diálogo com o
 * detalhamento da solução (ver MethodCards.tsx) — pedido de usuário
 * (28/09/2026), que muda a especificação original do handoff
 * ("sem clicável, sem CTA nos cards").
 */
export function NicheCard({ card, delayMs, onOpen }: NicheCardProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setVisible(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [delayMs]);

  /* O feixe "abre" a partir da lâmpada em 800ms; no hover fica um pouco mais aberto. */
  const beamStyle = (clipPath: string) => ({
    transform: visible ? "scaleX(1)" : "scaleX(0)",
    clipPath,
    background: card.gradient,
  });
  const beamClass =
    "absolute inset-0 origin-left transition-transform duration-[800ms] ease-brand-out group-hover:scale-x-110";
  const lampStyle = {
    background: "#F0DFB8",
    boxShadow: "0 0 12px #F0DFB8, 0 0 32px rgba(200,179,138,.6)",
  };

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      data-hot
      className="group flex flex-col gap-[14px] overflow-hidden rounded-md border border-navy-700 bg-navy-800/90 px-6 pb-[20px] pt-[28px] text-left transition-[opacity,transform,border-color] duration-500 ease-brand-out hover:-translate-y-1 hover:border-gold-600 lg:gap-4 lg:bg-navy-800 lg:px-[40px] lg:pb-[28px] lg:pt-[36px]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {/* Diagrama — celular */}
      <div className="relative -mx-6 -mt-[8px] h-[80px] lg:hidden">
        <div className={beamClass} style={beamStyle(card.clipPathMobile)} />
        <span className="absolute left-6 top-[34px] h-[12px] w-[12px] rounded-full" style={lampStyle} />
        <Dots dots={card.dotsMobile} mobile visible={visible} />
      </div>

      {/* Diagrama — desktop (sangra até a borda do card: margem negativa = padding) */}
      <div className="relative -mx-[40px] -mt-[12px] mb-[4px] hidden h-[104px] lg:block">
        <div className={beamClass} style={beamStyle(card.clipPath)} />
        <span className="absolute left-[40px] top-[46px] h-[12px] w-[12px] rounded-full" style={lampStyle} />
        <Dots dots={card.dots} mobile={false} visible={visible} />
      </div>

      <p className="eyebrow">{card.eyebrow}</p>
      <h3 className="font-display text-card-title-mobile font-normal text-papel-300 lg:text-card-title">
        {card.title}
      </h3>
      <p className="font-body text-[15px] leading-[1.6] text-papel-300 lg:max-w-[30em] lg:leading-[1.65]">
        {card.audience}
      </p>

      <div className="flex flex-col lg:mt-1">
        {card.lines.map((line) => (
          <div
            key={line.label}
            className="grid grid-cols-[84px_1fr] gap-[12px] border-t border-navy-700 py-[10px] lg:grid-cols-1 lg:gap-1 lg:py-[11px] xl:grid-cols-[96px_1fr] xl:gap-4"
          >
            <span className="eyebrow pt-1 tracking-[3px] text-papel-700 lg:tracking-eyebrow">{line.label}</span>
            <span className="font-body text-[14px] leading-[1.5] text-papel-500">{line.text}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
