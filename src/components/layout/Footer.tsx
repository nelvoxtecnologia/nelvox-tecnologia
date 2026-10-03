"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import {
  CITY,
  EMAIL,
  FOOTER,
  FOOTER_LINKS,
  GMB_URL,
  INSTAGRAM_URL,
  LEGAL_CNPJ,
  LEGAL_NAME,
  LINKEDIN_URL,
  OPENING_HOURS_LABEL,
  PHONE_DISPLAY,
  POSTAL_CODE,
  STATE,
  STREET_ADDRESS,
  WHATSAPP_NUMBER,
} from "@/content/site";
import { openConsentPreferences } from "@/lib/consent";

/**
 * Rodapé completo do site — usado no fim da home (depois da Cena 6),
 * em /quem-somos, /planos, /politica-de-privacidade e /termos-de-uso. Duas
 * colunas que quebram para empilhado no mobile: marca + slogan + identificação
 * de um lado, links institucionais e perfis do outro.
 *
 * O canto inferior esquerdo real da tela (onde o farol docado vive)
 * fica livre porque `brand-container` já aplica a margem lateral do
 * grid (80px desktop / 20px mobile) — o farol some por baixo dela.
 *
 * Identificação (razão social, CNPJ, contato, horário) vem de site.ts: campo vazio
 * (endereço, CEP, LinkedIn) é omitido, nunca publicado em branco.
 */

const linkClass = "transition-colors duration-ui ease-brand-in-out hover:text-papel-300";

/** Perfis externos: abrem em outra aba, sem repassar a origem. */
function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-hot
      aria-label={`${children} (abre em nova aba)`}
      className={linkClass}
    >
      {children}
    </a>
  );
}

export function Footer() {
  const location = [STREET_ADDRESS, POSTAL_CODE, `${CITY}, ${STATE}`].filter(Boolean).join(" · ");

  return (
    <footer className="relative z-10 border-t border-navy-700 py-16">
      <div className="brand-container flex flex-col gap-[40px] lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-[12px]">
          <Wordmark tone="papel" />
          <p className="font-display text-h3 font-light italic text-gold-400">
            {FOOTER.tagline}
          </p>
          <address className="flex flex-col gap-1 font-body text-caption not-italic text-papel-500">
            <span>
              {LEGAL_NAME} · <span className="whitespace-nowrap">CNPJ {LEGAL_CNPJ}</span>
            </span>
            <span>{location}</span>
            <span>
              <a href={`mailto:${EMAIL}`} data-hot className={linkClass}>
                {EMAIL}
              </a>
              {WHATSAPP_NUMBER && (
                <>
                  {" · "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-hot
                    className={`whitespace-nowrap ${linkClass}`}
                  >
                    WhatsApp {PHONE_DISPLAY}
                  </a>
                </>
              )}
            </span>
            <span>{OPENING_HOURS_LABEL}</span>
          </address>
        </div>

        <nav
          aria-label="Rodapé"
          className="flex flex-col gap-[32px] font-body text-[14px] text-papel-500 sm:flex-row sm:gap-[64px]"
        >
          <ul className="flex flex-col gap-4">
            <li>
              <Link href={FOOTER_LINKS.quemSomos.href} data-hot className={linkClass}>
                {FOOTER_LINKS.quemSomos.label}
              </Link>
            </li>
            <li>
              <Link href={FOOTER_LINKS.planos.href} data-hot className={linkClass}>
                {FOOTER_LINKS.planos.label}
              </Link>
            </li>
            <li>
              <Link href={FOOTER_LINKS.privacidade.href} data-hot className={linkClass}>
                {FOOTER_LINKS.privacidade.label}
              </Link>
            </li>
            <li>
              <Link href={FOOTER_LINKS.termos.href} data-hot className={linkClass}>
                {FOOTER_LINKS.termos.label}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openConsentPreferences}
                data-hot
                className={`text-left ${linkClass}`}
              >
                {FOOTER_LINKS.preferenciasCookies.label}
              </button>
            </li>
          </ul>

          <ul className="flex flex-col gap-4">
            {INSTAGRAM_URL && (
              <li>
                <ExternalLink href={INSTAGRAM_URL}>Instagram</ExternalLink>
              </li>
            )}
            {GMB_URL && (
              <li>
                <ExternalLink href={GMB_URL}>Google Meu Negócio</ExternalLink>
              </li>
            )}
            {LINKEDIN_URL && (
              <li>
                <ExternalLink href={LINKEDIN_URL}>LinkedIn</ExternalLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
