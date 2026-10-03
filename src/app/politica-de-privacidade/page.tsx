import type { Metadata } from "next";
import { Preloader } from "@/components/preloader/Preloader";
import { Farol } from "@/components/farol/Farol";
import { CursorHalo } from "@/components/ui/CursorHalo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyContent } from "@/components/privacy/PrivacyContent";
import { BackLink } from "@/components/ui/BackLink";
import { pageMetadata } from "@/lib/seo/metadata";
import { PRIVACY, PRIVACY_HAS_PLACEHOLDER, META, NAV_PRIVACIDADE_HREF } from "@/content/site";

if (PRIVACY_HAS_PLACEHOLDER) {
  console.warn(
    "[privacidade] Ainda há [dados a confirmar] em PRIVACY / LEGAL_* (src/content/site.ts) — " +
      "preencher e revisar juridicamente antes de publicar ou rodar campanhas pagas.",
  );
}

export const metadata: Metadata = pageMetadata({
  title: `${PRIVACY.metaTitle} — ${META.siteName}`,
  description: PRIVACY.metaDescription,
  path: NAV_PRIVACIDADE_HREF,
});

export default function PrivacidadePage() {
  return (
    <>
      <Preloader />
      <CursorHalo />
      <Farol initialDocked />
      <Header />

      <main id="conteudo" className="relative z-10 pb-[128px] pt-[160px] lg:pt-48">
        <div className="brand-container pb-8 lg:pb-12">
          <BackLink />
        </div>
        <div className="brand-container">
          <PrivacyContent />
        </div>
      </main>

      <Footer />
    </>
  );
}
