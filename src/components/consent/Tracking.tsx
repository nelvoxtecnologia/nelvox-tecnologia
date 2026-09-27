"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_COOKIE_PREFIXES,
  CONSENT_CHANGED_EVENT,
  MARKETING_COOKIE_PREFIXES,
  type ConsentState,
  clearTrackingCookies,
  readConsent,
} from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/* Os IDs entram como texto dentro de scripts inline (snippets do Google e da
   Meta). Se um valor errado ou malicioso viesse das variáveis de ambiente, ele
   viraria código — por isso só passam IDs no formato oficial; qualquer outra
   coisa é ignorada (o script simplesmente não carrega). */
const GA_ID = /^G-[A-Z0-9]{4,20}$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "")
  ? process.env.NEXT_PUBLIC_GA_ID
  : undefined;
const META_PIXEL_ID = /^\d{6,20}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "")
  ? process.env.NEXT_PUBLIC_META_PIXEL_ID
  : undefined;

/**
 * GA4 e Meta Pixel — guardrails em CLAUDE.md ("Guardrails de Rastreamento e
 * Consentimento"):
 *  - Regra 1: nenhum script de rastreamento carrega, dispara ou faz requisição de
 *    rede antes do consentimento da categoria (GA4 = Análise, Meta = Marketing).
 *  - Regra 2: Google Consent Mode v2 com padrão TUDO NEGADO desde o carregamento
 *    da página, antes de qualquer interação com o banner; só vira "granted" na
 *    categoria aceita. O trecho que declara o padrão (`ga4-consent-default`) é um
 *    stub local: não baixa nada e não faz nenhuma chamada de rede.
 * Sem os IDs válidos nas variáveis de ambiente (.env.example), nada é injetado.
 */
const CONSENT_DENIED =
  '{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"}';

const grant = (ok: boolean) => (ok ? "granted" : "denied");

export function Tracking() {
  const [consent, setConsent] = useState<ConsentState | null>(() =>
    typeof window === "undefined" ? null : readConsent(),
  );
  const pathname = usePathname();

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<ConsentState>).detail;
      setConsent(detail);

      /* Mantém o Consent Mode em dia a cada escolha (aceitar, recusar, revogar). */
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: grant(detail.analytics),
          ad_storage: grant(detail.marketing),
          ad_user_data: grant(detail.marketing),
          ad_personalization: grant(detail.marketing),
        });
      }
      if (!detail.marketing && typeof window.fbq === "function") {
        window.fbq("consent", "revoke");
      }
      /* Cada categoria limpa só os próprios cookies, para revogar uma não apagar
         cookies de uma categoria ainda consentida. */
      if (!detail.analytics) clearTrackingCookies(ANALYTICS_COOKIE_PREFIXES);
      if (!detail.marketing) clearTrackingCookies(MARKETING_COOKIE_PREFIXES);
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, []);

  /* Pageview a cada troca de rota (navegação client-side entre / e /origem/privacidade). */
  useEffect(() => {
    if (consent?.analytics && typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: pathname });
    }
    if (consent?.marketing && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, consent]);

  return (
    <>
      {/* Padrão do Consent Mode v2: tudo negado, sempre, antes de qualquer escolha. */}
      {GA_ID && (
        <Script id="ga4-consent-default" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)}window.gtag=gtag;gtag("consent","default",${CONSENT_DENIED});`}
        </Script>
      )}

      {/* GA4: só com consentimento de Análise. Marketing só libera os sinais de anúncio. */}
      {consent?.analytics && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag("consent","update",{analytics_storage:"granted",ad_storage:"${grant(consent.marketing)}",ad_user_data:"${grant(consent.marketing)}",ad_personalization:"${grant(consent.marketing)}"});gtag("js",new Date());gtag("config","${GA_ID}");`}
          </Script>
        </>
      )}

      {/* Meta Pixel: só com consentimento de Marketing. */}
      {consent?.marketing && META_PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script",
            "https://connect.facebook.net/en_US/fbevents.js");
            fbq("init", "${META_PIXEL_ID}");
            fbq("track", "PageView");`}
        </Script>
      )}
    </>
  );
}
