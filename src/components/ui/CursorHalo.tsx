"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Halo do cursor: anel de 28px com atraso (lerp .15) e ponto de 4px sem
 * atraso. Cresce para 56px + fundo Gold 8% sobre elementos marcados
 * com `data-hot` (links, botões). Desliga em `(hover: none)` e com
 * reduced motion — nesses casos o cursor nativo permanece, e
 * `html[data-cursor="halo"]` nunca é escrito, então o CSS que esconde o
 * cursor nativo (globals.css) nunca entra em vigor.
 */
export function CursorHalo() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover || prefersReducedMotion()) return;

    document.documentElement.dataset.cursor = "halo";

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let over = false;
    let raf = 0;

    const onMouseMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      over = !!(event.target as Element)?.closest?.("[data-hot]");
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    const onMouseLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const onMouseDown = () => {
      ring.style.transform += " scale(0.8)";
      window.setTimeout(() => {
        ring.style.transform = ring.style.transform.replace(" scale(0.8)", "");
      }, 150);
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      const size = over ? 56 : 28;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.background = over ? "rgba(200,179,138,.08)" : "transparent";
      ring.style.transform = `translate(${(currentX - size / 2).toFixed(1)}px, ${(currentY - size / 2).toFixed(1)}px)`;
      dot.style.transform = `translate(${(targetX - 2).toFixed(1)}px, ${(targetY - 2).toFixed(1)}px)`;
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    tick();

    return () => {
      delete document.documentElement.dataset.cursor;
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full opacity-0 transition-[width,height,background-color] duration-150"
        style={{ border: "1px solid rgba(200,179,138,.6)" }}
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1 w-1 rounded-full bg-[#F0DFB8] opacity-0"
      />
    </div>
  );
}
