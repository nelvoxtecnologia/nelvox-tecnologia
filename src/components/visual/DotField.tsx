"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { field, paint, refl, type Point } from "./dotFieldMath";
import { prefersReducedMotion } from "@/lib/motion";

export type DotFieldHandle = {
  /** Dispara a cascata a partir da origem (posição real da lâmpada no DOM). */
  lightUp: (originX: number, originY: number) => void;
};

type DotFieldProps = {
  className?: string;
};

const MOBILE_BREAKPOINT = 1024; // lg — mesmo corte do resto do site
const CASCADE_MS = 1600;

/**
 * Desktop/mobile: parâmetros do handoff (README, seção "Cena 2 —
 * Problema"), com o horizonte e a zona de exclusão do farol em fração
 * da altura/largura real do canvas — no artboard de referência
 * (1440×900 / 390×844) `hz` é 500/900 e 520/844 dessas alturas.
 */
function fieldParamsFor(width: number, height: number) {
  return width < MOBILE_BREAKPOINT
    ? {
        hz: height * (520 / 844),
        rows: 8,
        nFar: 14,
        nNear: 6,
        seed: 11,
        dw: width * (84 / 390),
        dh: height * (110 / 844),
        sMax: 3,
      }
    : {
        hz: height * (500 / 900),
        rows: 9,
        nFar: 30,
        nNear: 11,
        seed: 7,
        dw: width * (200 / 1440),
        dh: height * (190 / 900),
        sMax: 3.6,
      };
}

export const DotField = forwardRef<DotFieldHandle, DotFieldProps>(function DotField(
  { className },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const litRef = useRef(false);
  const originRef = useRef({ x: 80, y: 757 }); // fallback: posição aproximada da lâmpada docada
  const rafRef = useRef(0);
  const cascadeStartRef = useRef(0);

  const draw = useCallback((cascade: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = sizeRef.current;
    ctx.clearRect(0, 0, width, height);

    const painted = paint(pointsRef.current, litRef.current, cascade);
    const reflections = litRef.current ? refl(pointsRef.current, cascade) : [];

    painted.forEach((p) => {
      if (p.glow > 0) {
        ctx.shadowColor = `rgba(240,223,184,${p.glowAlpha})`;
        ctx.shadowBlur = p.glow;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.s / 2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    reflections.forEach((r) => {
      const gradient = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
      gradient.addColorStop(0, "rgba(200,179,138,.4)");
      gradient.addColorStop(1, "rgba(200,179,138,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(r.x - r.w / 2, r.y, r.w, r.h);
    });
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = rect.width;
    const height = rect.height || Math.round(width * (900 / 1440));

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    sizeRef.current = { width, height, dpr };

    const params = fieldParamsFor(width, height);
    pointsRef.current = field(
      width,
      height,
      params.hz,
      params.rows,
      params.nFar,
      params.nNear,
      params.seed,
      originRef.current.x,
      originRef.current.y,
      params.dw,
      params.dh,
      params.sMax,
    );

    draw(litRef.current ? 1 : 0);
  }, [draw]);

  useImperativeHandle(
    ref,
    () => ({
      lightUp(originX: number, originY: number) {
        if (litRef.current) return;
        originRef.current = { x: originX, y: originY };
        litRef.current = true;
        resize(); // recalcula os delays com a origem real da lâmpada

        if (prefersReducedMotion()) {
          draw(1);
          return;
        }

        cascadeStartRef.current = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - cascadeStartRef.current) / CASCADE_MS);
          draw(t);
          if (t < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
      },
    }),
    [draw, resize],
  );

  useEffect(() => {
    resize();
    const observer = new ResizeObserver(resize);
    if (canvasRef.current) observer.observe(canvasRef.current);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
});
