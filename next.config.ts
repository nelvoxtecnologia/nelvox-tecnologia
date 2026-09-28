import type { NextConfig } from "next";

/* ===== CABEÇALHOS DE SEGURANÇA =====
   Guia KipperDev "Vibe coding com segurança" (itens 05, 10 e 12) — detalhes e
   evidências em docs/SEGURANCA.md. Valem para `next start` (Hostinger Node.js).

   CSP ESTÁTICA (sem nonce): mantém as páginas estáticas e rápidas. Como o site
   não recebe conteúdo de visitantes (sem formulários, sem API), o risco de XSS
   é mínimo; a CSP é a camada extra contra script injetado e clickjacking.
   'unsafe-inline' é necessário porque o Next injeta scripts inline de
   hidratação e o site tem um script inline (MotionScript) e os snippets do
   GA4/Meta Pixel. Só carregam origens que o site realmente usa. */
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  // Padrão: só o próprio site.
  "default-src 'self'",
  // Scripts: o site, os inline necessários e as duas ferramentas de métricas
  // (só carregam após consentimento — ver Tracking.tsx). 'unsafe-eval' apenas em dev (HMR).
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net${isDev ? " 'unsafe-eval'" : ""}`,
  // Estilos: Tailwind gera CSS próprio; o Next injeta <style> inline.
  "style-src 'self' 'unsafe-inline'",
  // Imagens/pixels de rastreio do GA4 e do Meta.
  "img-src 'self' data: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
  // Fontes vêm do próprio domínio (next/font baixa e serve localmente).
  "font-src 'self'",
  // Envio de eventos do GA4 e do Meta Pixel.
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net",
  // Nada de plugins, <base> alheio, formulários para fora ou embutir o site em outro.
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Em produção, força HTTPS nos subrecursos (em dev, localhost é http).
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Bloqueia o site dentro de <iframe> de terceiros (clickjacking) — reforça o frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  // O navegador não "adivinha" o tipo do arquivo.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Não vaza a URL completa para outros sites ao clicar num link externo.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga recursos do aparelho que o site nunca usa.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // HTTPS obrigatório por 2 anos (só em produção; sem `preload` de propósito —
  // preload é difícil de desfazer, avaliar depois que o domínio estiver estável).
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  // Não anuncia "X-Powered-By: Next.js" (menos informação para quem faz varredura).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Rotas renomeadas (28/09/2026): preserva links já compartilhados/indexados.
  async redirects() {
    return [
      { source: "/origem", destination: "/quem-somos", permanent: true },
      { source: "/privacidade", destination: "/politica-de-privacidade", permanent: true },
    ];
  },
};

export default nextConfig;
