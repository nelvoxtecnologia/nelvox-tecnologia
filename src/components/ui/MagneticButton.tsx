"use client";

import { useEffect, useRef } from "react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { contactHref } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import { trackLead } from "@/lib/track";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Botão magnético do CTA final. Física do handoff: raio de atração 120px
 * além da borda, deslocamento = vetor até o cursor × .35 (limite ±14px),
 * o rótulo anda ×.5 (paralaxe), lerp .16 por frame. Desliga em
 * `(hover: none)` e com reduced motion — nesses casos o botão continua
 * clicável, só sem o efeito.
 */
export function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  const areaRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    const label = labelRef.current;
    if (!area || !label) return;

    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover || prefersReducedMotion()) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = area.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const radius = 120 + rect.width / 2;

      if (Math.hypot(dx, dy) < radius) {
        targetX = Math.max(-14, Math.min(14, dx * 0.35));
        targetY = Math.max(-14, Math.min(14, dy * 0.35));
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      area.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      label.style.transform = `translate(${(currentX * 0.5).toFixed(2)}px, ${(currentY * 0.5).toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };

    area.addEventListener("mousemove", onMouseMove);
    area.addEventListener("mouseleave", onMouseLeave);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener("mousemove", onMouseMove);
      area.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <a
      ref={areaRef}
      href={contactHref()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackLead}
      data-hot
      className={
        "inline-flex items-center gap-[10px] rounded-sm border border-gold-300 bg-gold-400 " +
        "h-[56px] w-full justify-center font-body text-[16px] font-semibold tracking-[0.3px] text-navy-950 " +
        "transition-[background-color,box-shadow] duration-ui ease-brand-in-out " +
        "hover:bg-[#DAC7A2] hover:shadow-[0_12px_40px_-12px_rgba(200,179,138,.5)] " +
        "active:scale-[0.97] active:bg-[#B89968] " +
        "lg:h-auto lg:w-auto lg:px-[36px] lg:py-[18px] " +
        className
      }
      style={{ willChange: "transform" }}
    >
      <span ref={labelRef} className="inline-flex items-center gap-[10px]" style={{ willChange: "transform" }}>
        <WhatsappLogo size={18} weight="regular" aria-hidden="true" />
        {children}
      </span>
    </a>
  );
}
