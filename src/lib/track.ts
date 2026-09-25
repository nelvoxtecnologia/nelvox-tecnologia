/* ===== EVENTO DE CONVERSÃO ===== */
/**
 * Um único ponto de disparo para o clique nos CTAs de WhatsApp — é o
 * evento de conversão que alimenta as campanhas de Google e Meta.
 * Cada chamada verifica o próprio consentimento antes de disparar, então
 * este módulo pode ser importado por qualquer CTA sem risco de mandar
 * dado sem permissão.
 */
import { readConsent } from "./consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackLead() {
  const consent = readConsent();
  if (!consent) return;

  if (consent.analytics && typeof window.gtag === "function") {
    window.gtag("event", "generate_lead");
  }
  if (consent.marketing && typeof window.fbq === "function") {
    window.fbq("track", "Contact");
  }
}
