import type { Metadata } from "next";
import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";
import { PRIVACY, PRIVACY_HAS_PLACEHOLDER, META, SITE_URL } from "@/content/site";

if (PRIVACY_HAS_PLACEHOLDER) {
  console.warn(
    "[privacidade] Ainda há [dados a confirmar] em PRIVACY / LEGAL_* (src/content/site.ts) — " +
      "preencher e revisar juridicamente antes de publicar ou rodar campanhas pagas.",
  );
}

export const metadata: Metadata = {
  title: `${PRIVACY.metaTitle} — ${META.siteName}`,
  description: PRIVACY.metaDescription,
  alternates: { canonical: "/privacidade" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${SITE_URL}/privacidade`,
    title: `${PRIVACY.metaTitle} — ${META.siteName}`,
    description: PRIVACY.metaDescription,
  },
};

export default function PrivacidadePage() {
  return (
    <>
      <Preloader />
      <CursorHalo />
      <Farol initialDocked />
      <Header />

      <main id="conteudo" className="relative z-10 pb-[128px] pt-[160px] lg:pt-48">
        <div className="brand-container">
          <PrivacyContent />
        </div>
      </main>

      <Footer />
    </>
  );
}
