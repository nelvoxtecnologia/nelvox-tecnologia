"use client";

import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { contactHref } from "@/content/site";
import { trackLead } from "@/lib/track";

/**
 * Botão flutuante de WhatsApp — só no mobile/tablet (`lg:hidden`, mesmo
 * corte de 1024px do resto do site). No desktop o CTA do Header já abre o
 * WhatsApp direto; no mobile ele fica escondido dentro do menu hambúrguer,
 * e o feedback (28/09/2026) foi que falta um jeito rápido de contato visível
 * de cara na tela. Montado uma vez em layout.tsx — aparece em toda página.
 *
 * z-30: acima do conteúdo (z-10) e do farol atracado (z-5, canto inferior
 * ESQUERDO — este botão fica no inferior direito, sem colisão), mas abaixo
 * do banner de cookies (z-50), que pode cobrir a mesma região enquanto o
 * visitante não respondeu — ver docs/MANUTENCAO.md.
 */
export function WhatsappFloatingButton() {
  return (
    <a
      href={contactHref()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackLead}
      data-hot
      aria-label="Falar com a Nelvox no WhatsApp"
      className="fixed right-4 z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gold-400 text-navy-950 shadow-[0_12px_32px_-8px_rgba(0,0,0,.5)] transition-[background-color,box-shadow] duration-ui ease-brand-in-out hover:bg-[#DAC7A2] active:scale-[0.94] lg:hidden"
      style={{ bottom: "calc(24px + env(safe-area-inset-bottom))" }}
    >
      <WhatsappLogo size={26} weight="fill" aria-hidden="true" />
    </a>
  );
}
