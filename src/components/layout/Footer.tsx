"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { FOOTER, FOOTER_LINKS } from "@/content/site";
import { openConsentPreferences } from "@/lib/consent";

/**
 * Rodapé completo do site — usado no fim da home (depois da Cena 6),
 * em /origem e em /privacidade. Duas colunas que quebram para
 * empilhado no mobile: marca+slogan de um lado, links institucionais
 * do outro.
 *
 * O canto inferior esquerdo real da tela (onde o farol docado vive)
 * fica livre porque `brand-container` já aplica a margem lateral do
 * grid (80px desktop / 20px mobile) — o farol some por baixo dela.
 */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-navy-700 py-16">
      <div className="brand-container flex flex-col gap-[40px] lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-[12px]">
          <Wordmark tone="papel" />
          <p className="font-display text-h3 font-light italic text-gold-400">
            {FOOTER.tagline}
          </p>
          <p className="font-body text-caption text-papel-700">{FOOTER.copyright}</p>
        </div>

        <nav
          aria-label="Rodapé"
          className="flex flex-col gap-4 font-body text-[14px] text-papel-500 sm:flex-row sm:gap-[40px]"
        >
          <Link
            href={FOOTER_LINKS.quemSomos.href}
            data-hot
            className="transition-colors duration-ui ease-brand-in-out hover:text-papel-300"
          >
            {FOOTER_LINKS.quemSomos.label}
          </Link>
          <button
            type="button"
            onClick={openConsentPreferences}
            data-hot
            className="text-left transition-colors duration-ui ease-brand-in-out hover:text-papel-300"
          >
            {FOOTER_LINKS.preferenciasCookies.label}
          </button>
          <Link
            href={FOOTER_LINKS.privacidade.href}
            data-hot
            className="transition-colors duration-ui ease-brand-in-out hover:text-papel-300"
          >
            {FOOTER_LINKS.privacidade.label}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
